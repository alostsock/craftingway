use rand::{
    distributions::{Alphanumeric, DistString},
    rngs::SmallRng,
    seq::SliceRandom,
    thread_rng, SeedableRng,
};

#[derive(Clone)]
pub struct Slugger {
    adjectives: Vec<&'static str>,
    nouns: Vec<&'static str>,
}

#[allow(clippy::new_without_default)]
impl Slugger {
    pub fn new() -> Self {
        Self {
            adjectives: include_str!("words/adjectives.txt").lines().collect(),
            nouns: include_str!("words/nouns.txt").lines().collect(),
        }
    }

    pub fn generate(&self, id_length: usize) -> String {
        let rng = &mut SmallRng::from_rng(&mut thread_rng()).unwrap();
        let adjective = self.adjectives.choose(rng).unwrap();
        let noun = self.nouns.choose(rng).unwrap();
        if id_length > 0 {
            let random_id = Alphanumeric.sample_string(rng, id_length);
            format!("{adjective}-{noun}-{random_id}")
        } else {
            format!("{adjective}-{noun}")
        }
    }
}
