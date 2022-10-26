import { autorun, makeAutoObservable, runInAction } from "mobx";
import init, { simulateActions } from "crafty";
import type { Recipe, Action, CraftState, SearchOptions, Player } from "crafty";

import { RecipeState } from "./recipe-state";
import { PlayerState } from "./player-state";

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
        this.craftState = this.simulateActions(RecipeState.recipe, PlayerState.stats, this.actions);
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

  simulateActions(recipe: Recipe, player: Player, actions: Action[]): CraftState {
    return simulateActions(recipe, player, DEFAULT_SEARCH_OPTIONS, actions);
  }
}

export const SimulatorState = new _SimulatorState();
