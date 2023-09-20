mod rotation;
mod words;

use axum::{
    body::Body,
    routing::{get, post},
    Router,
};
use serde::Serialize;

use crate::ApiState;

pub fn create_router() -> Router<ApiState, http_body::Limited<Body>> {
    Router::new()
        .route("/rotation/:slug", get(rotation::get))
        .route("/rotation", post(rotation::insert))
        .route("/words", get(words::get))
}

#[derive(Serialize)]
pub struct Slug {
    slug: String,
}
