use serde::{Deserialize, Deserializer, Serialize, Serializer};

pub fn serialize_str_to_json<S>(s: &str, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    let json: serde_json::Value = serde_json::from_str(s).map_err(serde::ser::Error::custom)?;
    json.serialize(serializer)
}

pub fn deserialize_json_to_string<'de, D>(deserializer: D) -> Result<String, D::Error>
where
    D: Deserializer<'de>,
{
    let value: serde_json::Value = Deserialize::deserialize(deserializer)?;
    Ok(value.to_string())
}
