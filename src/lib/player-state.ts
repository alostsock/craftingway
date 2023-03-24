import { autorun, makeAutoObservable } from "mobx";
import type { Player as PlayerStats } from "crafty";

import { Job, JOBS } from "./jobs";
import Storage from "./storage";

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
  statsByJob: JobStats;

  constructor() {
    makeAutoObservable(this);

    this.job = Storage.retrieve(JOB_STORE) || "CRP";

    this.statsByJob =
      Storage.retrieve(STATS_STORE) ||
      JOBS.reduce((obj, job) => {
        obj[job] = DEFAULT_STATS;
        return obj;
      }, {} as JobStats);

    autorun(() => {
      Storage.store(JOB_STORE, JSON.stringify(this.job));
    });

    autorun(() => {
      Storage.store(STATS_STORE, JSON.stringify(this.statsByJob));
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

  setStatsForAllJobs(stats: PlayerStats) {
    for (const job of JOBS) {
      this.statsByJob[job] = JSON.parse(JSON.stringify(stats));
    }
  }
}

export const PlayerState = new _PlayerState();
