use crate::{ApiError, ApiState};
use axum::{
    extract::{ConnectInfo, State},
    http::{Method, Request, StatusCode},
    middleware::Next,
    response::{IntoResponse, Response},
};
use governor::{
    clock::{Clock, QuantaClock},
    state::keyed::DashMapStateStore,
    Quota, RateLimiter,
};
use std::{net::IpAddr, net::SocketAddr, num::NonZeroU32};

type RateLimitKey = IpAddr;
pub type KeyedRateLimiter = RateLimiter<RateLimitKey, DashMapStateStore<RateLimitKey>, QuantaClock>;

pub fn create_rate_limiter() -> KeyedRateLimiter {
    let quota = NonZeroU32::new(5).unwrap();
    let burst = NonZeroU32::new(15).unwrap();
    RateLimiter::keyed(Quota::per_minute(quota).allow_burst(burst))
}

pub async fn rate_limit_middleware<Body>(
    State(state): State<ApiState>,
    request: Request<Body>,
    next: Next<Body>,
) -> Response {
    if request.method() != Method::POST {
        return next.run(request).await;
    }

    let client_ip: Option<IpAddr> = if let Some(value) = request.headers().get("fly-client-ip") {
        value.to_str().map_or(None, |ip_str| ip_str.parse().ok())
    } else if let Some(ConnectInfo(addr)) = request.extensions().get::<ConnectInfo<SocketAddr>>() {
        Some(addr.ip())
    } else {
        None
    };

    let Some(client_ip) = client_ip else {
        return StatusCode::FORBIDDEN.into_response();
    };

    match state.rate_limiter.check_key(&client_ip) {
        Ok(_) => next.run(request).await,
        Err(err) => {
            let wait_time = err.wait_time_from(QuantaClock::default().now()).as_secs();

            ApiError::TooManyRequests {
                client_ip,
                wait_time,
            }
            .into_response()
        }
    }
}
