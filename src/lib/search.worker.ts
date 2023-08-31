import type { Action, CraftOptions, Player, Recipe, SearchOptions } from "crafty";
import init, { searchStepwise, simulateActions } from "crafty";

import { checkAttrs } from "./utils";

export interface SearchRequestMessage {
  type: "search-request";
  recipe: Recipe;
  player: Player;
  actionHistory: Action[];
  craftOptions: CraftOptions;
  searchOptions: SearchOptions;
}

export interface SearchResponseMessage {
  type: "search-response";
  actions: Action[];
  score: number;
}

export interface SearchCompleteMessage {
  type: "search-complete";
}

onmessage = (event) => {
  const { type } = event.data;

  if (type === "search-request") {
    const message = checkAttrs<SearchRequestMessage>(event.data, [
      "recipe",
      "player",
      "actionHistory",
      "craftOptions",
      "searchOptions",
    ]);

    const { recipe, player, actionHistory, craftOptions, searchOptions } = message;

    init().then(() => {
      const actions: Action[] = [...actionHistory];

      const callback = (action: Action) => {
        actions.push(action);

        const { score } = simulateActions(recipe, player, actions, craftOptions);

        postMessage({
          type: "search-response",
          actions,
          score,
        } satisfies SearchResponseMessage);
      };

      searchStepwise(recipe, player, actionHistory, craftOptions, searchOptions, callback);

      postMessage({
        type: "search-complete",
      } satisfies SearchCompleteMessage);
    });
  } else {
    throw new TypeError("invalid message type");
  }
};
