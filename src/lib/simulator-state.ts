import type { Action, CompletionReason, CraftState, Recipe } from "crafty";
import init, { generateMacroText, Player, recipesByJobLevel, simulateActions } from "crafty";
import { autorun, makeAutoObservable, runInAction, toJS } from "mobx";

import { JOBS } from "./jobs";
import { LocaleState } from "./locale-state";
import { PlayerState } from "./player-state";
import { RecipeData, RecipeState } from "./recipe-state";
import type { SearchRequestMessage, SearchResponseMessage } from "./search.worker";
import searchWorkerUrl from "./search.worker?worker&url";
import Storage from "./storage";
import { checkAttrs } from "./utils";

export interface Config {
  maxSteps: number;
  iterations: number;
  maxScoreWeightingConstant: number;
  explorationConstant: number;
  concurrency: number;
}

// Remember to bump version number when updating DEFAULT_CONFIG, so that the
// cache is invalidated
const CONFIG_STORE = "simulatorConfig_v3";

export const DEFAULT_CONFIG: Config = {
  maxSteps: 25,
  iterations: 150_000,
  maxScoreWeightingConstant: 0.1,
  explorationConstant: 3.0,
  concurrency: Math.ceil(navigator.hardwareConcurrency / 2),
};

class _SimulatorState {
  loaded = false;

  private _actions: Action[] = [];
  private _craftState: CraftState | null = null;
  private _completionReason: CompletionReason | null = null;

  config: Config;
  private workers: Set<Worker> = new Set();

  constructor() {
    makeAutoObservable(this);

    init().then(() => runInAction(() => (this.loaded = true)));

    this.config = Storage.retrieve(CONFIG_STORE) || DEFAULT_CONFIG;

    autorun(() => Storage.store(CONFIG_STORE, JSON.stringify(this.config)));

    autorun(() => {
      if (this.loaded && RecipeState.recipe) {
        const { craft_state, completion_reason } = this.simulateActions(
          RecipeState.recipe,
          PlayerState.playerWithBonuses,
          this.actions,
          RecipeState.startingQuality
        );
        this.craftState = craft_state;
        this.completionReason = completion_reason || null;
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

  simulateActions(recipe: Recipe, player: Player, actions: Action[], startingQuality: number) {
    return simulateActions(recipe, player, actions, {
      max_steps: 50,
      starting_quality: startingQuality,
      quality_target: undefined,
    });
  }

  recipesByLevel(jobLevel: number): RecipeData[] {
    if (!this.loaded) return [];

    return recipesByJobLevel(jobLevel).map((recipe) => {
      const key = `${recipe.recipe_level}/${recipe.progress}/${recipe.quality}/${recipe.durability}`;

      return {
        name: `Generic Recipe (${key})`,
        jobs: [...JOBS],
        item_level: 0,
        equip_level: 0,
        is_specialist: false,
        can_hq: true,
        material_quality: 100,
        ingredients: [],
        ...recipe,
      };
    });
  }

  setConfig(attrs: Partial<Config>) {
    if (this.isSearching) return;

    for (const attr of Object.keys(attrs) as Array<keyof Config>) {
      if (attr in this.config) {
        const value = attrs[attr];
        if (value != null) this.config[attr] = value;
      }
    }
  }

  resetConfig() {
    this.config = DEFAULT_CONFIG;
  }

  get isSearching() {
    return this.workers.size > 0;
  }

  terminateWorker(worker: Worker) {
    this.workers.delete(worker);
    worker.terminate();
  }

  terminateAllWorkers() {
    for (const worker of this.workers) {
      this.terminateWorker(worker);
    }
  }

  searchStepwise() {
    this.terminateAllWorkers();

    if (!RecipeState.recipe || !this.loaded) return;

    type Result = { actions: Action[]; score: number };
    const results: Result[] = Array(this.config.concurrency).fill(undefined);
    const bestScore = 0;

    const startedAt = performance.now();
    console.log("creating workers...");

    for (let i = 0; i < this.config.concurrency; i++) {
      const worker = new Worker(searchWorkerUrl, { type: "module" });
      this.workers.add(worker);

      worker.onmessage = (event) => {
        switch (event.data.type) {
          case "search-response": {
            const { actions, score } = checkAttrs<SearchResponseMessage>(event.data, [
              "actions",
              "score",
            ]);

            results[i] = { actions, score };

            // Setting actions here is only for indicating progress visually. We should rely on
            // `results` for determining the actual state of the search, since this comparison and
            // assignment is subject to race conditions. The final set of actions will be set on
            // "search-complete" once all workers terminate.
            if (score > bestScore) {
              this.actions = actions;
            }
            break;
          }
          case "search-complete": {
            const progress = this.config.concurrency - this.workers.size + 1;
            const progressStatus = `[${progress}/${this.config.concurrency}]`;
            console.log(`${progressStatus} search completed in ${performance.now() - startedAt}ms`);
            this.terminateWorker(worker);

            if (this.workers.size == 0) {
              const bestResult = results.reduce((prev, current) =>
                current.score > prev.score ? current : prev
              );
              // I've observed that occasionally the UI isn't consistent with `this.actions`.
              // I think this could be from updates happening too frequently, so this delay is just
              // to let things settle before finalizing the search.
              setTimeout(() => (this.actions = bestResult.actions), 50);
            }
            break;
          }
          default:
            throw new TypeError(`invalid message type: ${event.data.type}`);
        }
      };

      // mobx objects aren't serializable across the wire, so we have to convert
      // them to normal JS objects first
      worker.postMessage({
        type: "search-request",
        recipe: toJS(RecipeState.recipe),
        player: toJS(PlayerState.playerWithBonuses),
        actionHistory: toJS(this.actions),
        craftOptions: {
          max_steps: this.config.maxSteps,
          starting_quality: RecipeState.startingQuality,
          quality_target: RecipeState.recipe.can_hq ? RecipeState.recipe.quality : 0,
        },
        searchOptions: {
          iterations: this.config.iterations,
          max_score_weighting_constant: this.config.maxScoreWeightingConstant,
          exploration_constant: this.config.explorationConstant,
          rng_seed: undefined,
          score_storage_threshold: undefined,
        },
      } satisfies SearchRequestMessage);
    }
  }

  createMacroParts(craftState: CraftState, actions: Action[]): string[][] {
    const lineLimit = 15;

    const latestValidStep = craftState.step;
    const validActions = actions.slice(0, latestValidStep - 1);
    const lines = generateMacroText(validActions).map((line) =>
      line.replace(/^(\/ac )("?.*"?)( <.*)$/, (_line, ac, action, wait) => {
        action = LocaleState.translateActionName(action.replaceAll('"', ""));
        action = action.indexOf(" ") >= 0 ? `"${action}"` : action;
        return `${ac}${action}${wait}`;
      })
    );

    const parts: string[][] = [];
    while (lines.length > 0) {
      const partNumber = parts.length + 1;
      const alarmText = `/e Part ${partNumber} complete <se.8>`;

      if (lines.length == lineLimit) {
        parts.push(lines.splice(0, lines.length));
      } else {
        parts.push(lines.splice(0, lineLimit - 1).concat(alarmText));
      }
    }

    return parts;
  }
}

export const SimulatorState = new _SimulatorState();
