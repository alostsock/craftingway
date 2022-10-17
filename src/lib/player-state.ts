import { makeAutoObservable } from "mobx";
import type { Player as PlayerStats } from "crafty";

import { Job, JOBS } from "./jobs";

type JobStats = Record<Job, PlayerStats>;

const DEFAULT_STATS: PlayerStats = {
  job_level: 1,
  craftsmanship: 0,
  control: 0,
  cp: 180,
};

class _PlayerState {
  private currentJob: Job = "CRP";
  private statsByJob: JobStats;

  constructor() {
    makeAutoObservable(this);

    this.statsByJob = JOBS.reduce((obj, job) => {
      obj[job] = DEFAULT_STATS;
      return obj;
    }, {} as JobStats);
  }

  get stats(): PlayerStats {
    return this.statsByJob[this.currentJob];
  }

  setJob(job: Job) {
    this.currentJob = job;
  }

  setStats(stats: Partial<PlayerStats>) {
    for (const stat of ["job_level", "craftsmanship", "control", "cp"] as const) {
      let value = stats[stat];
      if (value != null) this.statsByJob[this.currentJob][stat] = value;
    }
  }
}

export const PlayerState = new _PlayerState();
