export type StatConfig = {
  name: string;
  label: string;
  min: number;
  max: number;
};

export const STATS = [
  { name: "job_level", label: "Level", min: 1, max: 90 },
  { name: "craftsmanship", label: "Craftsmanship", min: 0, max: 9000 },
  { name: "control", label: "Control", min: 0, max: 9000 },
  { name: "cp", label: "CP", min: 180, max: 1000 },
] as const satisfies readonly StatConfig[];
