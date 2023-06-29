mod error;
mod models;
mod routes;
mod serde_custom;
mod slugger;
mod tracing;

pub use crate::error::ApiError;
pub use crate::routes::create_router;
pub use crate::slugger::Slugger;
pub use crate::tracing::setup_tracing;

#[derive(Clone)]
pub struct ApiState {
    pub db: sqlx::SqlitePool,
    pub slugger: Slugger,
}

pub type ApiResult<T> = std::result::Result<T, ApiError>;
