import { Buffs } from "crafty";

type BuffData = {
  name: keyof Buffs;
  label: string;
  stackable?: boolean;
  expires?: boolean;
};

export const BUFFS: BuffData[] = [
  { name: "inner_quiet", label: "Inner Quiet", stackable: true },
  { name: "waste_not", label: "Waste Not", expires: true },
  { name: "waste_not_ii", label: "Waste Not II", expires: true },
  { name: "manipulation", label: "Manipulation", expires: true },
  { name: "great_strides", label: "Great Strides", expires: true },
  { name: "innovation", label: "Innovation", expires: true },
  { name: "veneration", label: "Veneration", expires: true },
  { name: "makers_mark", label: "Maker's Mark", expires: true },
  { name: "muscle_memory", label: "Muscle Memory", expires: true },
];
