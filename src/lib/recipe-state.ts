import { makeAutoObservable } from "mobx";
import type { Recipe } from "crafty";

import { PlayerState } from "./player-state";
import { fuzzysearch } from "./fuzzysearch";
import { Job } from "./jobs";

interface RawRecipeData extends Recipe {
  name: string;
  jobs: Job[];
  job_level: number;
  item_level: number;
  equip_level: number;
  stars: number;
  is_specialist: boolean;
}

export interface RecipeData extends Omit<RawRecipeData, "jobs"> {
  jobs: Set<Job>;
}

class _RecipeState {
  loaded = false;
  recipes: RecipeData[] = [];
  recipe: RecipeData | null = null;

  constructor() {
    makeAutoObservable(this, {
      recipes: false,
      searchRecipes: false,
    });
    this.loadRecipes();
  }

  async loadRecipes() {
    const response = await fetch("recipes.json");
    const rawRecipeData: RawRecipeData[] = await response.json();
    this.recipes = rawRecipeData.map((raw) => ({ ...raw, jobs: new Set(raw.jobs) }));
  }

  searchRecipes(query: string, limit = 10) {
    query = query.toLowerCase();

    const matches = [];

    for (const recipe of this.recipes) {
      let score = fuzzysearch(query, recipe.name.toLowerCase());

      if (!score) continue;

      // grant a small boost if the recipe is relevant to the current job
      if (recipe.jobs.has(PlayerState.job)) {
        score += 0.2;
      }

      matches.push({ recipe, score });
    }

    return matches
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((result) => result.recipe);
  }
}

export const RecipeState = new _RecipeState();
