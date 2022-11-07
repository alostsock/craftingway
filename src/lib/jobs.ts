export const JOBS = ["CRP", "BSM", "ARM", "GSM", "LTW", "WVR", "ALC", "CUL"] as const;

export type Job = typeof JOBS[number];

export const JOB_EMOJIS: Record<Job, string> = {
  CRP: "🪚",
  BSM: "⚔️",
  ARM: "🛡️",
  GSM: "💎",
  LTW: "🥾",
  WVR: "🧦",
  ALC: "☕",
  CUL: "🍞",
};
