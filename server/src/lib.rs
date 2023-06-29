mod error;
mod models;
mod rate_limit;
mod routes;
mod serde_custom;
mod slugger;
mod tracing;

use std::sync::Arc;

pub use crate::error::ApiError;
pub use crate::rate_limit::{create_rate_limiter, rate_limit_middleware};
pub use crate::routes::create_router;
pub use crate::slugger::Slugger;
pub use crate::tracing::setup_tracing;

#[derive(Clone)]
pub struct ApiState {
    pub db: sqlx::SqlitePool,
    pub slugger: Slugger,
    pub rate_limiter: Arc<rate_limit::KeyedRateLimiter>,
}

pub type ApiResult<T> = std::result::Result<T, ApiError>;
