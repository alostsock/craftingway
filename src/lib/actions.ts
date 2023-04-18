import type { Action } from "crafty";
import { groupBy } from "./utils";

type ActionGroup = "Starter" | "Durability" | "Progress" | "Quality" | "Buff" | "Other";

type ActionData = {
  level: number;
  name: Action;
  label: string;
  group: ActionGroup;
  cp?: number;
};

// prettier-ignore
export const ACTIONS: readonly ActionData[] = [
  { level: 54, name: "MuscleMemory", label: "Muscle Memory", group: "Starter", cp: 6 },
  { level: 69, name: "Reflect", label: "Reflect", group: "Starter", cp: 6 },
  { level: 80, name: "TrainedEye", label: "Trained Eye", group: "Starter", cp: 250 },

  { level: 15, name: "Veneration", label: "Veneration", group: "Buff", cp: 18 },
  { level: 21, name: "GreatStrides", label: "Great Strides", group: "Buff", cp: 32 },
  { level: 26, name: "Innovation", label: "Innovation", group: "Buff", cp: 18 },

  { level: 1, name: "BasicSynthesis", label: "Basic Synthesis", group: "Progress" },
  { level: 31, name: "BasicSynthesisTraited", label: "Basic Synthesis", group: "Progress" },
  { level: 62, name: "CarefulSynthesis", label: "Careful Synthesis", group: "Progress", cp: 7 },
  { level: 82, name: "CarefulSynthesisTraited", label: "Careful Synthesis", group: "Progress", cp: 7 },
  { level: 88, name: "PrudentSynthesis", label: "Prudent Synthesis", group: "Progress", cp: 18 },
  { level: 72, name: "Groundwork", label: "Groundwork", group: "Progress", cp: 18 },
  { level: 86, name: "GroundworkTraited", label: "Groundwork", group: "Progress", cp: 18 },

  { level: 5, name: "BasicTouch", label: "Basic Touch", group: "Quality", cp: 18 },
  { level: 18, name: "StandardTouch", label: "Standard Touch", group: "Quality", cp: 32 },
  { level: 84, name: "AdvancedTouch", label: "Advanced Touch", group: "Quality", cp: 46 },
  { level: 50, name: "ByregotsBlessing", label: "Byregot's Blessing", group: "Quality", cp: 24 },
  { level: 66, name: "PrudentTouch", label: "Prudent Touch", group: "Quality", cp: 25 },
  { level: 71, name: "PreparatoryTouch", label: "Preparatory Touch", group: "Quality", cp: 40 },
  { level: 90, name: "TrainedFinesse", label: "Trained Finesse", group: "Quality", cp: 32 },

  { level: 7, name: "MastersMend", label: "Master's Mend", group: "Durability", cp: 88 },
  { level: 15, name: "WasteNot", label: "Waste Not", group: "Durability", cp: 56 },
  { level: 47, name: "WasteNotII", label: "Waste Not II", group: "Durability", cp: 98 },
  { level: 65, name: "Manipulation", label: "Manipulation", group: "Durability", cp: 96 },

  { level: 13, name: "Observe", label: "Observe", group: "Other", cp: 7 },
  { level: 67, name: "FocusedSynthesis", label: "Focused Synthesis", group: "Other", cp: 5 },
  { level: 68, name: "FocusedTouch", label: "Focused Touch", group: "Other", cp: 18 },
  { level: 76, name: "DelicateSynthesis", label: "Delicate Synthesis", group: "Other", cp: 32 },

  // ignored for now:
  // hasty touch
  // rapid synthesis
  // tricks of the trade
  // final appraisal
  // precise touch
  // intensive synthesis
] as const;

export const ACTIONS_BY_GROUP = groupBy(ACTIONS.slice(), "group");

export const ACTION_LOOKUP = ACTIONS.reduce((prev, current) => {
  prev[current.name] = current;
  return prev;
}, {} as Record<Action, ActionData>);

export function traitedActions(jobLevel: number): ActionData[] {
  const actions: ActionData[] = [];

  for (const action of ACTIONS) {
    if (
      jobLevel < action.level ||
      (action.name === "BasicSynthesis" && jobLevel >= 31) ||
      (action.name === "BasicSynthesisTraited" && jobLevel < 31) ||
      (action.name === "CarefulSynthesis" && jobLevel >= 82) ||
      (action.name === "CarefulSynthesisTraited" && jobLevel < 82) ||
      (action.name === "Groundwork" && jobLevel >= 86) ||
      (action.name === "GroundworkTraited" && jobLevel < 86)
    ) {
      continue;
    }

    actions.push(action);
  }

  return actions;
}
