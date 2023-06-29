use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use serde_json::json;
use tracing::debug;

#[derive(thiserror::Error, Debug)]
pub enum ApiError {
    #[error("there was a problem with the database")]
    Sqlx(#[from] sqlx::Error),

    #[error("invalid JSON")]
    Json(#[from] serde_json::Error),
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            Self::Sqlx(sqlx::Error::RowNotFound) => {
                (StatusCode::NOT_FOUND, String::from("record not found"))
            }
            Self::Sqlx(sqlx::Error::Io(ref err)) => {
                debug!("database communication error: {err}");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    String::from("database communication error"),
                )
            }
            Self::Sqlx(sqlx::Error::Tls(ref err)) => {
                debug!("database communication error: {err}");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    String::from("database communication error"),
                )
            }
            _ => (StatusCode::INTERNAL_SERVER_ERROR, format!("{self}")),
        };

        let body = axum::Json(json!({ "error": error_message }));

        (status, body).into_response()
    }
}
