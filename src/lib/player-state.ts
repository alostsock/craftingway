import { autorun, makeAutoObservable } from "mobx";
import type { Player as PlayerStats } from "crafty";

import { Job, JOBS } from "./jobs";
import Storage from "./storage";
import { Consumable, calculateConsumableBonus, ConsumableBonus } from "./consumables";

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
  food?: Consumable;
  foodIsHq: boolean = false;
  potion?: Consumable;
  potionIsHq: boolean = false;

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

  get statsWithBonuses(): PlayerStats {
    let food = this.foodBonus;
    let potion = this.potionBonus;
    return {
      job_level: this.stats.job_level,
      craftsmanship: this.stats.craftsmanship + food.craftsmanship + potion.craftsmanship,
      control: this.stats.control + food.control + potion.control,
      cp: this.stats.cp + food.cp + potion.cp,
    };
  }

  get foodBonus(): ConsumableBonus {
    if (!this.food) return { craftsmanship: 0, control: 0, cp: 0 };
    return calculateConsumableBonus(this.stats, this.food, this.foodIsHq);
  }

  get potionBonus(): ConsumableBonus {
    if (!this.potion) return { craftsmanship: 0, control: 0, cp: 0 };

    return calculateConsumableBonus(this.stats, this.potion, this.potionIsHq);
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
