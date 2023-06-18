create table shared_rotations (
  id integer not null primary key,
  slug text not null unique,
  version text not null,
  job text not null,
  job_level integer not null,
  craftsmanship integer not null,
  control integer not null,
  cp integer not null,
  food text,
  potion text,
  recipe_job_level integer not null,
  recipe text not null,
  hq_ingredients text not null,
  actions text not null,
  created_at integer not null default (unixepoch())
) strict;

create index ix_shared_rotations_version ON shared_rotations (version);
