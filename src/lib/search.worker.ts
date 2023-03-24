import init, { searchStepwise } from "crafty";
import type { Recipe, Player, Action, SearchOptions } from "crafty";

import { checkAttrs } from "./utils";

export interface SearchRequestMessage {
  type: "search-request";
  recipe: Recipe;
  player: Player;
  actionHistory: Action[];
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
      "searchOptions",
    ]);

    const { recipe, player, actionHistory, searchOptions } = message;

    init().then(() => {
      let actions: Action[] = [...actionHistory];

      searchStepwise(recipe, player, actionHistory, searchOptions, (action) => {
        actions.push(action);

        postMessage({
          type: "search-response",
          actions,
        } satisfies SearchResponseMessage);
      });

      postMessage({
        type: "search-complete",
      } satisfies SearchCompleteMessage);
    });
  } else {
    throw new TypeError("invalid message type");
  }
};
