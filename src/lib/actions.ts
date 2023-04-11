import type { Action } from "crafty";
import { groupBy } from "./utils";

type ActionGroup = "Starter" | "Durability" | "Progress" | "Quality" | "Buff" | "Other";

type ActionData = {
  level: number;
  name: Action;
  label: string;
  group: ActionGroup;
};

export const ACTIONS: readonly ActionData[] = [
  { level: 54, name: "MuscleMemory", label: "Muscle Memory", group: "Starter" },
  { level: 69, name: "Reflect", label: "Reflect", group: "Starter" },
  { level: 80, name: "TrainedEye", label: "Trained Eye", group: "Starter" },

  { level: 7, name: "MastersMend", label: "Master's Mend", group: "Durability" },
  { level: 15, name: "WasteNot", label: "Waste Not", group: "Durability" },
  { level: 47, name: "WasteNotII", label: "Waste Not II", group: "Durability" },
  { level: 65, name: "Manipulation", label: "Manipulation", group: "Durability" },

  { level: 1, name: "BasicSynthesis", label: "Basic Synthesis", group: "Progress" },
  { level: 31, name: "BasicSynthesisTraited", label: "Basic Synthesis", group: "Progress" },
  { level: 62, name: "CarefulSynthesis", label: "Careful Synthesis", group: "Progress" },
  { level: 82, name: "CarefulSynthesisTraited", label: "Careful Synthesis", group: "Progress" },
  { level: 88, name: "PrudentSynthesis", label: "Prudent Synthesis", group: "Progress" },
  { level: 72, name: "Groundwork", label: "Groundwork", group: "Progress" },
  { level: 86, name: "GroundworkTraited", label: "Groundwork", group: "Progress" },

  { level: 5, name: "BasicTouch", label: "Basic Touch", group: "Quality" },
  { level: 18, name: "StandardTouch", label: "Standard Touch", group: "Quality" },
  { level: 84, name: "AdvancedTouch", label: "Advanced Touch", group: "Quality" },
  { level: 50, name: "ByregotsBlessing", label: "Byregot's Blessing", group: "Quality" },
  { level: 66, name: "PrudentTouch", label: "Prudent Touch", group: "Quality" },
  { level: 71, name: "PreparatoryTouch", label: "Preparatory Touch", group: "Quality" },
  { level: 90, name: "TrainedFinesse", label: "Trained Finesse", group: "Quality" },

  { level: 15, name: "Veneration", label: "Veneration", group: "Buff" },
  { level: 21, name: "GreatStrides", label: "Great Strides", group: "Buff" },
  { level: 26, name: "Innovation", label: "Innovation", group: "Buff" },

  { level: 13, name: "Observe", label: "Observe", group: "Other" },
  { level: 67, name: "FocusedSynthesis", label: "Focused Synthesis", group: "Other" },
  { level: 68, name: "FocusedTouch", label: "Focused Touch", group: "Other" },
  { level: 76, name: "DelicateSynthesis", label: "Delicate Synthesis", group: "Other" },

  // ignored for now:
  // hasty touch
  // rapid synthesis
  // tricks of the trade
  // final appraisal
  // precise touch
  // intensive synthesis
  // trained eye
] as const;

export const ACTIONS_BY_GROUP = groupBy(ACTIONS.slice(), "group");

export function traitedActions(jobLevel: number): ActionData[] {
  let actions: ActionData[] = [];

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
