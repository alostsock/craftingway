import type { Recipe } from "crafty";
import { makeAutoObservable, runInAction } from "mobx";
import { unpack } from "msgpackr/unpack";

import { fuzzysearch } from "./fuzzysearch";
import { Job } from "./jobs";
import { LocaleState } from "./locale-state";
import { PlayerState } from "./player-state";

export interface Ingredient {
  name: string;
  amount: number;
  item_level: number;
  can_hq: boolean;
}

export interface RecipeData extends Recipe {
  name: string;
  jobs: Job[];
  job_level: number;
  item_level: number;
  equip_level: number;
  stars: number;
  is_specialist: boolean;
  can_hq: boolean;
  material_quality: number;
  ingredients: Ingredient[];
}

class _RecipeState {
  loaded = false;
  recipes: RecipeData[] = [];

  private _recipe: RecipeData | null = null;

  hq_ingredients: Record<string, number> = {};

  constructor() {
    makeAutoObservable(this, {
      recipes: false,
      searchRecipes: false,
    });
    this.loadRecipes();
  }

  async loadRecipes() {
    const response = await fetch("/recipes.msgpack");
    this.recipes = unpack(new Uint8Array(await response.arrayBuffer()));
    runInAction(() => (this.loaded = true));
  }

  get recipe() {
    return this._recipe;
  }

  set recipe(recipe: RecipeData | null) {
    this.hq_ingredients = {};
    this._recipe = recipe;
  }

  get startingQuality(): number {
    return this._recipe ? this.calculateStartingQuality(this._recipe, this.hq_ingredients) : 0;
  }

  calculateStartingQuality(recipe: RecipeData, ingredients: Record<string, number>): number {
    const totalPossibleQuality = recipe.quality * (recipe.material_quality / 100);

    const totalPossibleItemLevels = recipe.ingredients
      .filter((i) => i.can_hq)
      .reduce((sum, { amount, item_level }) => sum + amount * item_level, 0);

    if (totalPossibleItemLevels === 0) return 0;

    const itemLevels = Object.entries(ingredients).reduce((prev, [itemName, quantity]) => {
      const itemLevel = recipe.ingredients.find((i) => i.name === itemName)?.item_level ?? 0;
      return prev + itemLevel * quantity;
    }, 0);

    const quality = totalPossibleQuality * (itemLevels / totalPossibleItemLevels);

    return Math.floor(quality);
  }

  searchRecipes(query: string, limit = 10) {
    query = query.toLowerCase();

    const matches = [];

    for (const recipe of this.recipes) {
      const recipeName = LocaleState.translateItemName(recipe.name);

      let score = fuzzysearch(query, recipeName.toLowerCase());

      if (!score) continue;

      // grant a small boost if the recipe is relevant to the current job
      if (recipe.jobs.includes(PlayerState.job)) {
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
