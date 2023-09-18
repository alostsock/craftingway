use crate::{ApiResult, ApiState};
use axum::{extract::State, http::HeaderMap, Json};
use tracing::info;

pub async fn get(
    State(state): State<ApiState>,
    headers: HeaderMap,
) -> ApiResult<Json<Vec<String>>> {
    info!("{:?}", headers);
    let words = (0..50).map(|_| state.slugger.generate(0)).collect();
    Ok(Json(words))
}
