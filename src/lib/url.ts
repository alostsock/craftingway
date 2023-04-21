import JsonURL from "@jsonurl/jsonurl";
import type { Player } from "crafty";
import { autorun, when } from "mobx";

import { FOOD_VARIANTS, POTION_VARIANTS } from "./consumables";
import { Job } from "./jobs";
import { PlayerState } from "./player-state";
import { RecipeState } from "./recipe-state";

interface URLData {
  v: number;
  job: Job;
  player: Player;
  food: string | undefined;
  potion: string | undefined;
  recipe: string | undefined;
}

const urlVersion = 1;
const jsonURLOptions = { AQF: true, noEmptyComposite: true };

export function setupURL() {
  // once recipes are loaded, run this function once
  when(
    () => RecipeState.loaded,
    () => {
      deserializeURL(); // deserialize the URL into state
      autorun(updateURL); // whenever state changes, serialize into the URL
    }
  );
}

function deserializeURL() {
  if (location.search.substring(0, 3) !== "?c=") return;
  const data: URLData = JsonURL.parse(location.search.substring(3), jsonURLOptions);
  if (data.v != urlVersion) {
    console.debug("ignoring old url data version", data.v);
    return;
  }

  PlayerState.job = data.job;
  PlayerState.setConfig(data.player);

  if (data.food) {
    const food = FOOD_VARIANTS.find((f) => f.name === data.food);
    if (food) PlayerState.setConfig({ food });
  }
  if (data.potion) {
    const potion = POTION_VARIANTS.find((p) => p.name === data.potion);
    if (potion) PlayerState.setConfig({ potion });
  }
  if (data.recipe) {
    const recipe = RecipeState.recipes.find((r) => r.name === data.recipe);
    if (recipe) RecipeState.recipe = recipe;
  }
}

function updateURL() {
  const player = PlayerState.config;
  const data: URLData = {
    v: urlVersion,
    job: PlayerState.job,
    player: {
      job_level: player.job_level,
      craftsmanship: player.craftsmanship,
      control: player.control,
      cp: player.cp,
    },
    food: player.food?.name,
    potion: player.potion?.name,
    recipe: RecipeState.recipe?.name,
  };
  const encoded = JsonURL.stringify(data, jsonURLOptions);
  history.replaceState({}, "", "/?c=" + encoded);
}
