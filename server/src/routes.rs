mod rotation;
mod words;

use axum::{
    routing::{get, post},
    Router,
};
use hyper::Body;
use serde::Serialize;

use crate::ApiState;

pub fn create_router() -> Router<ApiState, Body> {
    Router::new()
        .route("/rotation/:slug", get(rotation::get))
        .route("/rotation", post(rotation::insert))
        .route("/words", get(words::get))
}

#[derive(Serialize)]
pub struct Slug {
    slug: String,
}
