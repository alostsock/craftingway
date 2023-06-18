use crate::{ApiResult, ApiState};
use axum::{extract::State, Json};

pub async fn get(State(state): State<ApiState>) -> ApiResult<Json<Vec<String>>> {
    let words = (0..50).map(|_| state.slugger.generate(0)).collect();
    Ok(Json(words))
}
