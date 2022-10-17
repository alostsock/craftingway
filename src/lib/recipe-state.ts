import { makeAutoObservable, runInAction } from "mobx";

import { fuzzysearch } from "./fuzzysearch";
import { Job } from "./jobs";

export type RecipeData = {
  name: string;
  jobs: Job[];
  jlvl: number;
  rlvl: number;
  ilvl: number;
  elvl: number;
  stars: number;
  p: number;
  q: number;
  d: number;
  pdiv: number;
  pmod: number;
  qdiv: number;
  qmod: number;
  spec: boolean;
  expert: boolean;
  flags: number;
};

class _RecipeState {
  loaded = false;
  private recipeMap: Map<string, RecipeData> = new Map();

  constructor() {
    makeAutoObservable<typeof this, "recipeMap">(this, {
      recipeMap: false,
      searchRecipes: false,
    });
    this.loadRecipes();
  }

  async loadRecipes() {
    const response = await fetch("recipes.json");
    const recipes: RecipeData[] = await response.json();
    this.recipeMap = new Map();
    for (const recipe of recipes) {
      this.recipeMap.set(recipe.name.toLowerCase(), recipe);
    }
  }

  searchRecipes(query: string, limit = 10) {
    const matches = [];

    for (const recipeName of this.recipeMap.keys()) {
      const score = fuzzysearch(query, recipeName);
      if (score > 0) {
        matches.push({ recipeName, score });
      }
    }

    return matches
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((result) => {
        const recipe = this.recipeMap.get(result.recipeName);

        if (!recipe) throw Error(`no recipe found for ${result.recipeName}`);

        return recipe;
      });
  }
}

export const RecipeState = new _RecipeState();
