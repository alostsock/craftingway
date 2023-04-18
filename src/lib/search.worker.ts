import init, { searchStepwise } from "crafty";
import type { Recipe, Player, Action, SearchOptions } from "crafty";

import { checkAttrs } from "./utils";

export interface SearchRequestMessage {
  type: "search-request";
  recipe: Recipe;
  player: Player;
  actionHistory: Action[];
  maxSteps: number;
  searchOptions: SearchOptions;
}

export interface SearchResponseMessage {
  type: "search-response";
  actions: Action[];
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
      "maxSteps",
      "searchOptions",
    ]);

    const { recipe, player, actionHistory, maxSteps, searchOptions } = message;

    init().then(() => {
      const actions: Action[] = [...actionHistory];

      const callback = (action: Action) => {
        actions.push(action);

        postMessage({
          type: "search-response",
          actions,
        } satisfies SearchResponseMessage);
      };

      searchStepwise(
        recipe,
        player,
        actionHistory,
        Math.min(maxSteps, 255),
        searchOptions,
        callback
      );

      postMessage({
        type: "search-complete",
      } satisfies SearchCompleteMessage);
    });
  } else {
    throw new TypeError("invalid message type");
  }
};
