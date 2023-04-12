import { Buffs } from "crafty";

export type Buff = keyof Buffs;

type BuffData = {
  name: Buff;
  label: string;
  stackable?: boolean;
  expires?: boolean;
};

export const BUFF_LOOKUP: Record<Buff, BuffData> = {
  inner_quiet: { name: "inner_quiet", label: "Inner Quiet", stackable: true },
  waste_not: { name: "waste_not", label: "Waste Not", expires: true },
  waste_not_ii: { name: "waste_not_ii", label: "Waste Not II", expires: true },
  manipulation: { name: "manipulation", label: "Manipulation", expires: true },
  great_strides: { name: "great_strides", label: "Great Strides", expires: true },
  innovation: { name: "innovation", label: "Innovation", expires: true },
  veneration: { name: "veneration", label: "Veneration", expires: true },
  makers_mark: { name: "makers_mark", label: "Maker's Mark", expires: true },
  muscle_memory: { name: "muscle_memory", label: "Muscle Memory", expires: true },
} as const;
