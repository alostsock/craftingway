import { makeAutoObservable, runInAction } from "mobx";
import type { Recipe } from "crafty";

import { fuzzysearch } from "./fuzzysearch";
import { Job } from "./jobs";

interface RawRecipeData extends Recipe {
  name: string;
  jobs: Job[];
  job_level: number;
  item_level: number;
  equip_level: number;
  stars: number;
  is_specialist: number;
}

export interface RecipeData extends Omit<RawRecipeData, "jobs"> {
  jobs: Set<Job>;
}

class _RecipeState {
  loaded = false;
  recipes: RecipeData[] = [];

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

  searchRecipes(query: string, job: Job, limit = 10) {
    const matches = [];

    for (const recipe of this.recipes) {
      if (!recipe.jobs.has(job)) continue;

      const score = fuzzysearch(query, recipe.name.toLowerCase());

      if (!score) continue;

      matches.push({ recipe, score });
    }

    return matches
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((result) => result.recipe);
  }
}

export const RecipeState = new _RecipeState();
