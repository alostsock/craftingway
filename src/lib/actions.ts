import type { Action } from "crafty";

type ActionData = {
  name: Action;
  label: string;
};

export const ACTIONS: ActionData[] = [
  { name: "MuscleMemory", label: "Muscle Memory" },
  { name: "Reflect", label: "Reflect" },
  { name: "Observe", label: "Observe" },
  { name: "FocusedSynthesis", label: "Focused Synthesis" },
  { name: "FocusedTouch", label: "Focused Touch" },

  { name: "BasicSynthesis", label: "Basic Synthesis" },
  { name: "CarefulSynthesis", label: "Careful Synthesis" },
  { name: "PrudentSynthesis", label: "Prudent Synthesis" },
  { name: "Groundwork", label: "Groundwork" },
  { name: "DelicateSynthesis", label: "Delicate Synthesis" },

  { name: "BasicTouch", label: "Basic Touch" },
  { name: "StandardTouch", label: "Standard Touch" },
  { name: "AdvancedTouch", label: "Advanced Touch" },
  { name: "PrudentTouch", label: "Prudent Touch" },
  { name: "PreparatoryTouch", label: "Preparatory Touch" },
  { name: "ByregotsBlessing", label: "Byregot's Blessing" },

  { name: "GreatStrides", label: "Great Strides" },
  { name: "Innovation", label: "Innovation" },
  { name: "Veneration", label: "Veneration" },
  { name: "Manipulation", label: "Manipulation" },
  { name: "WasteNot", label: "Waste Not" },
  { name: "WasteNotII", label: "Waste Not II" },
  { name: "MastersMend", label: "Master's Mend" },
  { name: "TrainedFinesse", label: "Trained Finesse" },
];
