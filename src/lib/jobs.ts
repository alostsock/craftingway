export const JOBS = ["CRP", "BSM", "ARM", "GSM", "LTW", "WVR", "ALC", "CUL"] as const;

export type Job = typeof JOBS[number];
