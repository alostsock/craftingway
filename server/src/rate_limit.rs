use crate::{ApiError, ApiState};
use axum::{
    extract::State,
    http::Request,
    middleware::Next,
    response::{IntoResponse, Response},
};
use governor::{
    clock::{Clock, QuantaClock},
    state::{InMemoryState, NotKeyed},
    Quota, RateLimiter,
};
use hyper::Method;
use std::num::NonZeroU32;

pub type NotKeyedRateLimiter = RateLimiter<NotKeyed, InMemoryState, QuantaClock>;

pub fn create_rate_limiter() -> NotKeyedRateLimiter {
    let quota = NonZeroU32::new(1000).unwrap();
    let burst = NonZeroU32::new(1500).unwrap();
    RateLimiter::direct(Quota::per_minute(quota).allow_burst(burst))
}

pub async fn rate_limit_middleware<Body>(
    State(state): State<ApiState>,
    request: Request<Body>,
    next: Next<Body>,
) -> Response {
    if request.method() != Method::POST {
        return next.run(request).await;
    }

    match state.rate_limiter.check() {
        Ok(_) => next.run(request).await,
        Err(err) => {
            let wait_time = err.wait_time_from(QuantaClock::default().now()).as_secs();

            ApiError::TooManyRequests { wait_time }.into_response()
        }
    }
}
