import { autorun, makeAutoObservable, runInAction, toJS } from "mobx";
import init, { recipesByJobLevel, simulateActions } from "crafty";
import type { Action, CraftState, Player, Recipe, SearchOptions, CompletionReason } from "crafty";

import { RecipeState, RecipeData } from "./recipe-state";
import { PlayerState } from "./player-state";
import { JOBS } from "./jobs";
import { checkAttrs } from "./utils";

import searchWorkerUrl from "./search.worker?worker&url";
import type { SearchRequestMessage, SearchResponseMessage } from "./search.worker";

const DEFAULT_SEARCH_OPTIONS: SearchOptions = {
  iterations: 100_000,
  rng_seed: undefined,
  exploration_constant: undefined,
  max_score_weighting_constant: undefined,
  score_storage_threshold: undefined,
};

class _SimulatorState {
  loaded = false;

  private _actions: Action[] = [];
  private _craftState: CraftState | null = null;
  private _completionReason: CompletionReason | null = null;

  private worker: Worker | null = null;

  constructor() {
    makeAutoObservable(this);

    init().then(() => runInAction(() => (this.loaded = true)));

    autorun(() => {
      if (this.loaded && RecipeState.recipe) {
        this.simulateActions(RecipeState.recipe, PlayerState.stats, this.actions);
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

  get completionReason() {
    return this._completionReason;
  }

  set completionReason(reason: CompletionReason | null) {
    this._completionReason = reason;
  }

  recipesByLevel(jobLevel: number): RecipeData[] {
    return recipesByJobLevel(jobLevel).map((recipe) => ({
      name: "Generic Recipe",
      jobs: new Set(JOBS),
      item_level: 0,
      equip_level: 0,
      is_specialist: false,
      ...recipe,
    }));
  }

  private simulateActions(recipe: Recipe, player: Player, actions: Action[]) {
    const { craft_state, completion_reason } = simulateActions(recipe, player, actions);
    this.craftState = craft_state;
    this.completionReason = completion_reason || null;
  }

  get searchInProgress() {
    return !!this.worker;
  }

  stopSearch() {
    if (this.worker) {
      this.worker.terminate();
      console.log("worker killed");
      this.worker = null;
    }
  }

  searchStepwise() {
    this.stopSearch();

    if (!RecipeState.recipe) {
      return;
    }

    const startedAt = performance.now();

    this.worker = new Worker(searchWorkerUrl, { type: "module" });
    console.log("worker started");

    this.worker.onmessage = (event) => {
      const { type } = event.data;

      if (type === "search-response") {
        const { actions } = checkAttrs<SearchResponseMessage>(event.data, ["actions"]);
        this.actions = actions;
      } else if (type === "search-complete") {
        console.log(`search completed in ${performance.now() - startedAt}ms`);
        this.stopSearch();
      } else {
        throw new TypeError(`invalid message type: ${type}`);
      }
    };

    // mobx objects aren't serializable across the wire, so we have to convert
    // them to normal JS objects first
    this.worker.postMessage({
      type: "search-request",
      recipe: toJS(RecipeState.recipe),
      player: toJS(PlayerState.stats),
      actionHistory: toJS(this.actions),
      searchOptions: { ...DEFAULT_SEARCH_OPTIONS, iterations: 100_000 },
    } satisfies SearchRequestMessage);
  }
}

export const SimulatorState = new _SimulatorState();
