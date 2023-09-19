use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use serde_json::json;
use tracing::warn;

#[derive(thiserror::Error, Debug)]
pub enum ApiError {
    #[error("There was a problem with the database")]
    Sqlx(#[from] sqlx::Error),

    #[error("Invalid JSON")]
    Json(#[from] serde_json::Error),

    #[error("Try again in {wait_time} seconds")]
    TooManyRequests {
        client_ip: std::net::IpAddr,
        wait_time: u64,
    },
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            Self::Sqlx(sqlx::Error::RowNotFound) => {
                (StatusCode::NOT_FOUND, String::from("Record not found"))
            }
            Self::Sqlx(sqlx::Error::Io(ref err)) => {
                warn!("Database communication error: {err}");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    String::from("Database communication error"),
                )
            }
            Self::Sqlx(sqlx::Error::Tls(ref err)) => {
                warn!("Database communication error: {err}");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    String::from("Database communication error"),
                )
            }
            Self::TooManyRequests {
                client_ip,
                wait_time: _,
            } => {
                warn!("Rate limit quota reached for {client_ip}");
                (StatusCode::TOO_MANY_REQUESTS, format!("{self}"))
            }
            _ => (StatusCode::INTERNAL_SERVER_ERROR, format!("{self}")),
        };

        let body = axum::Json(json!({ "error": error_message }));

        (status, body).into_response()
    }
}
