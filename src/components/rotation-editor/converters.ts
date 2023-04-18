import type { Action } from "crafty";

import { generateId } from "../../lib/utils";

export function idFromAction(action: Action) {
  return `${action}-${generateId()}`;
}

export function actionFromId(id: string) {
  const [_, action] = id.match(/(\w+)-?\d*/)!;
  return action as Action;
}
