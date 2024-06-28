import { Buffs } from "crafty";

export type Buff = keyof Buffs & "trained_perfection";

type BuffData = {
  name: Buff;
  label: string;
  tooltip: string;
  stackable?: boolean;
  expires?: boolean;
};

export const BUFF_LOOKUP: Record<Buff, BuffData> = {
  inner_quiet: {
    name: "inner_quiet",
    label: "Inner Quiet",
    tooltip:
      "Receiving a stacking 10% bonus to Touch action efficiency with every increase in quality.",
    stackable: true,
  },
  waste_not: {
    name: "waste_not",
    label: "Waste Not",
    tooltip: "Durability loss is reduced by half.",
    expires: true,
  },
  waste_not_ii: {
    name: "waste_not_ii",
    label: "Waste Not II",
    tooltip: "Durability loss is reduced by half.",
    expires: true,
  },
  manipulation: {
    name: "manipulation",
    label: "Manipulation",
    tooltip: "Receiving 10 points of durability after each step.",
    expires: true,
  },
  great_strides: {
    name: "great_strides",
    label: "Great Strides",
    tooltip: "Efficiency of the next Touch action is increased by 100%.",
    expires: true,
  },
  innovation: {
    name: "innovation",
    label: "Innovation",
    tooltip: "Efficiency of Touch actions is increased by 50%.",
    expires: true,
  },
  veneration: {
    name: "veneration",
    label: "Veneration",
    tooltip: "Efficiency of Synthesis actions is increased by 50%.",
    expires: true,
  },
  muscle_memory: {
    name: "muscle_memory",
    label: "Muscle Memory",
    tooltip: "Efficiency of the next Synthesis action is increased by 100%.",
    expires: true,
  },
  trained_perfection: {
    name: "trained_perfection",
    label: "Trained Perfection",
    tooltip: "Durability loss of next action is reduced to zero.",
  },
} as const;
