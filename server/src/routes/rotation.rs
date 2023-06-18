use crate::models::shared_rotation::{NewSharedRotation, SharedRotation, SharedRotationBody};
use crate::routes::Slug;
use crate::{ApiResult, ApiState};
use axum::extract::{Path, State};
use axum::Json;

pub async fn get(
    State(state): State<ApiState>,
    Path(slug): Path<String>,
) -> ApiResult<Json<SharedRotation>> {
    let result = sqlx::query_as!(
        SharedRotation,
        "select * from shared_rotations where slug = ?",
        slug
    )
    .fetch_one(&state.db)
    .await?;

    Ok(Json(result))
}

pub async fn insert(
    State(state): State<ApiState>,
    Json(value): Json<serde_json::Value>,
) -> ApiResult<Json<Slug>> {
    let body: SharedRotationBody = serde_json::from_value(value)?;

    let NewSharedRotation {
        slug,
        version,
        job,
        job_level,
        craftsmanship,
        control,
        cp,
        food,
        potion,
        recipe_job_level,
        recipe,
        hq_ingredients,
        actions,
    } = NewSharedRotation::from_body(body, state.slugger.generate(5));

    let slug = sqlx::query_scalar!(
        r#"
            insert into shared_rotations (
                slug,
                version,
                job,
                job_level,
                craftsmanship,
                control,
                cp,
                food,
                potion,
                recipe_job_level,
                recipe,
                hq_ingredients,
                actions
            )
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            returning slug as "slug!"
        "#,
        slug,
        version,
        job,
        job_level,
        craftsmanship,
        control,
        cp,
        food,
        potion,
        recipe_job_level,
        recipe,
        hq_ingredients,
        actions
    )
    .fetch_one(&state.db)
    .await?;

    Ok(Json(Slug { slug }))
}
