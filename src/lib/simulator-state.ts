import { autorun, makeAutoObservable, runInAction } from "mobx";
import init, { simulateActions, recipesByJobLevel } from "crafty";
import type { Action, CraftState, Player, Recipe, SearchOptions, SimulatorResult } from "crafty";

import { RecipeState, RecipeData } from "./recipe-state";
import { PlayerState } from "./player-state";
import { JOBS } from "./jobs";
import { stars } from "./utils";

const DEFAULT_SEARCH_OPTIONS: SearchOptions = {
  iterations: 100_000,
  max_steps: 30,
  rng_seed: undefined,
  exploration_constant: undefined,
  max_score_weighting_constant: undefined,
  score_storage_threshold: undefined,
};

class _SimulatorState {
  loaded = false;

  private _actions: Action[] = [];
  private _craftState: CraftState | null = null;

  constructor() {
    makeAutoObservable(this);

    init().then(() => runInAction(() => (this.loaded = true)));

    autorun(() => {
      if (this.loaded && RecipeState.recipe) {
        const { craft_state, completion_reason } = this.simulateActions(
          RecipeState.recipe,
          PlayerState.stats,
          this.actions
        );
        this.craftState = craft_state;
      } else {
        this.craftState = null;
      }
    });
  }

  get actions() {
    return this._actions;
  }

  set actions(actions: Action[]) {
    this._actions = actions;
  }

  get craftState() {
    return this._craftState;
  }

  set craftState(state: CraftState | null) {
    this._craftState = state;
  }

  simulateActions(recipe: Recipe, player: Player, actions: Action[]): SimulatorResult {
    return simulateActions(recipe, player, DEFAULT_SEARCH_OPTIONS, actions);
  }

  recipesByLevel(jobLevel: number): RecipeData[] {
    return recipesByJobLevel(jobLevel).map((recipe) => ({
      name: [
        `Lv.${recipe.job_level}`,
        stars(recipe.stars),
        `(Recipe Level ${recipe.recipe_level})`,
        `${recipe.progress} / ${recipe.quality} / ${recipe.durability}`,
      ].join(" "),
      jobs: new Set(JOBS),
      item_level: 0,
      equip_level: 0,
      is_specialist: false,
      ...recipe,
    }));
  }
}

export const SimulatorState = new _SimulatorState();
