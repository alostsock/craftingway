import type { Action } from "crafty";
import { groupBy } from "./utils";

type ActionGroup = "Starter" | "Progress" | "Quality" | "Special" | "Observe" | "Buff";

type ActionData = {
  level: number;
  name: Action;
  label: string;
  group: ActionGroup;
};

export const ACTIONS: readonly ActionData[] = [
  // generally sorted in order of level, except when there are related actions
  { level: 54, name: "MuscleMemory", label: "Muscle Memory", group: "Starter" },
  { level: 69, name: "Reflect", label: "Reflect", group: "Starter" },

  { level: 1, name: "BasicSynthesis", label: "Basic Synthesis", group: "Progress" },
  { level: 62, name: "CarefulSynthesis", label: "Careful Synthesis", group: "Progress" },
  { level: 88, name: "PrudentSynthesis", label: "Prudent Synthesis", group: "Progress" },
  { level: 72, name: "Groundwork", label: "Groundwork", group: "Progress" },

  { level: 5, name: "BasicTouch", label: "Basic Touch", group: "Quality" },
  { level: 18, name: "StandardTouch", label: "Standard Touch", group: "Quality" },
  { level: 84, name: "AdvancedTouch", label: "Advanced Touch", group: "Quality" },
  { level: 66, name: "PrudentTouch", label: "Prudent Touch", group: "Quality" },
  { level: 71, name: "PreparatoryTouch", label: "Preparatory Touch", group: "Quality" },

  { level: 7, name: "MastersMend", label: "Master's Mend", group: "Special" },
  { level: 50, name: "ByregotsBlessing", label: "Byregot's Blessing", group: "Special" },
  { level: 76, name: "DelicateSynthesis", label: "Delicate Synthesis", group: "Special" },
  { level: 90, name: "TrainedFinesse", label: "Trained Finesse", group: "Special" },

  { level: 13, name: "Observe", label: "Observe", group: "Observe" },
  { level: 67, name: "FocusedSynthesis", label: "Focused Synthesis", group: "Observe" },
  { level: 68, name: "FocusedTouch", label: "Focused Touch", group: "Observe" },

  { level: 15, name: "Veneration", label: "Veneration", group: "Buff" },
  { level: 15, name: "WasteNot", label: "Waste Not", group: "Buff" },
  { level: 47, name: "WasteNotII", label: "Waste Not II", group: "Buff" },
  { level: 21, name: "GreatStrides", label: "Great Strides", group: "Buff" },
  { level: 26, name: "Innovation", label: "Innovation", group: "Buff" },
  { level: 65, name: "Manipulation", label: "Manipulation", group: "Buff" },

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
