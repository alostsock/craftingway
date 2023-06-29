use crate::{ApiError, ApiState};
use axum::{
    extract::{ConnectInfo, State},
    http::Request,
    middleware::Next,
    response::{IntoResponse, Response},
};
use governor::{
    clock::{Clock, QuantaClock},
    state::keyed::DashMapStateStore,
    Quota, RateLimiter,
};
use hyper::Method;
use std::{net::SocketAddr, num::NonZeroU32};

type RateLimitKey = SocketAddr;

pub type KeyedRateLimiter = RateLimiter<RateLimitKey, DashMapStateStore<RateLimitKey>, QuantaClock>;

pub fn create_rate_limiter() -> KeyedRateLimiter {
    let quota = NonZeroU32::new(5).unwrap();
    let burst = NonZeroU32::new(5).unwrap();
    RateLimiter::keyed(Quota::per_minute(quota).allow_burst(burst))
}

pub async fn rate_limit_middleware<Body>(
    State(state): State<ApiState>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    request: Request<Body>,
    next: Next<Body>,
) -> Response {
    if request.method() != Method::POST {
        return next.run(request).await;
    }

    match state.rate_limiter.check_key(&addr) {
        Ok(_) => next.run(request).await,
        Err(err) => {
            let wait_time = err.wait_time_from(QuantaClock::default().now()).as_secs();
            ApiError::TooManyRequests { addr, wait_time }.into_response()
        }
    }
}
