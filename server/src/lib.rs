mod error;
pub mod models;
pub mod routes;
pub mod serde_custom;
mod slugger;

pub use error::ApiError;
pub use slugger::Slugger;

#[derive(Clone)]
pub struct ApiState {
    pub db: sqlx::SqlitePool,
    pub slugger: Slugger,
}

pub type ApiResult<T> = std::result::Result<T, ApiError>;
