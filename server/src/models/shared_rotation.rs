use crate::serde_custom::{deserialize_json_to_string, serialize_str_to_json};
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct SharedRotation {
    pub id: i64,
    pub slug: String,
    pub version: String,
    pub job: String,
    pub job_level: i64,
    pub craftsmanship: i64,
    pub control: i64,
    pub cp: i64,
    pub food: Option<String>,
    pub potion: Option<String>,
    pub recipe_job_level: i64,
    pub recipe: String,
    #[serde(serialize_with = "serialize_str_to_json")]
    pub hq_ingredients: String,
    pub actions: String,
    pub created_at: i64,
}

#[derive(Deserialize)]
pub struct SharedRotationBody {
    pub version: String,
    pub job: String,
    pub job_level: i64,
    pub craftsmanship: i64,
    pub control: i64,
    pub cp: i64,
    pub food: Option<String>,
    pub potion: Option<String>,
    pub recipe_job_level: i64,
    pub recipe: String,
    #[serde(deserialize_with = "deserialize_json_to_string")]
    pub hq_ingredients: String,
    pub actions: String,
}

pub struct NewSharedRotation {
    pub slug: String,
    pub version: String,
    pub job: String,
    pub job_level: i64,
    pub craftsmanship: i64,
    pub control: i64,
    pub cp: i64,
    pub food: Option<String>,
    pub potion: Option<String>,
    pub recipe_job_level: i64,
    pub recipe: String,
    pub hq_ingredients: String,
    pub actions: String,
}

impl NewSharedRotation {
    pub fn from_body(
        SharedRotationBody {
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
        }: SharedRotationBody,
        slug: String,
    ) -> Self {
        Self {
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
        }
    }
}
