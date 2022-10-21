import { autorun, makeAutoObservable } from "mobx";
import type { Player as PlayerStats } from "crafty";

import { Job, JOBS } from "./jobs";

type JobStats = Record<Job, PlayerStats>;

const DEFAULT_STATS: PlayerStats = {
  job_level: 1,
  craftsmanship: 0,
  control: 0,
  cp: 180,
};

const JOB_STORE = "job";
const STATS_STORE = "statsByJob";

class _PlayerState {
  job: Job;
  private statsByJob: JobStats;

  constructor() {
    makeAutoObservable(this);

    this.job = retrieve(JOB_STORE) || "CRP";

    this.statsByJob =
      retrieve(STATS_STORE) ||
      JOBS.reduce((obj, job) => {
        obj[job] = DEFAULT_STATS;
        return obj;
      }, {} as JobStats);

    autorun(() => {
      console.log("caching player job");
      store(JOB_STORE, JSON.stringify(this.job));
    });

    autorun(() => {
      console.log("caching player stats");
      store(STATS_STORE, JSON.stringify(this.statsByJob));
    });
  }

  get stats(): PlayerStats {
    return this.statsByJob[this.job];
  }

  setStats(stats: Partial<PlayerStats>) {
    for (const stat of ["job_level", "craftsmanship", "control", "cp"] as const) {
      let value = stats[stat];
      if (value != null) this.statsByJob[this.job][stat] = value;
    }
  }
}

export const PlayerState = new _PlayerState();

function store(key: string, item: string) {
  localStorage.setItem(key, item);
}

function retrieve<T>(key: string): T | null {
  const item = localStorage.getItem(key);

  if (!item) return null;

  return JSON.parse(item) as T;
}
