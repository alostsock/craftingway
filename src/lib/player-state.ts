import { autorun, makeAutoObservable } from "mobx";
import type { Player } from "crafty";

import { Job, JOBS } from "./jobs";
import Storage from "./storage";
import { calculateConsumableBonus, ConsumableBonus, ConsumableVariant } from "./consumables";

interface JobConfig extends Player {
  food: ConsumableVariant | null;
  potion: ConsumableVariant | null;
}

const DEFAULT_CONFIG: JobConfig = {
  job_level: 1,
  craftsmanship: 0,
  control: 0,
  cp: 180,
  food: null,
  potion: null,
};

const JOB_STORE = "job";
const JOB_CONFIG_STORE = "configByJob";

class _PlayerState {
  job: Job;
  configByJob: Record<Job, JobConfig>;

  constructor() {
    makeAutoObservable(this);

    this.job = Storage.retrieve(JOB_STORE) || "CRP";

    autorun(() => Storage.store(JOB_STORE, JSON.stringify(this.job)));

    this.configByJob =
      Storage.retrieve(JOB_CONFIG_STORE) ||
      JOBS.reduce((obj, job) => {
        obj[job] = DEFAULT_CONFIG;
        return obj;
      }, {} as Record<Job, JobConfig>);

    autorun(() => Storage.store(JOB_CONFIG_STORE, JSON.stringify(this.configByJob)));
  }

  get config(): JobConfig {
    return this.configByJob[this.job];
  }

  get playerWithBonuses(): Player {
    const food = this.foodBonus;
    const potion = this.potionBonus;
    return {
      job_level: this.config.job_level,
      craftsmanship: this.config.craftsmanship + food.craftsmanship + potion.craftsmanship,
      control: this.config.control + food.control + potion.control,
      cp: this.config.cp + food.cp + potion.cp,
    };
  }

  get foodBonus(): ConsumableBonus {
    if (!this.config.food) return { craftsmanship: 0, control: 0, cp: 0 };
    return calculateConsumableBonus(this.config, this.config.food);
  }

  get potionBonus(): ConsumableBonus {
    if (!this.config.potion) return { craftsmanship: 0, control: 0, cp: 0 };
    return calculateConsumableBonus(this.config, this.config.potion);
  }

  setConfig(attrs: Partial<JobConfig>) {
    for (const stat of ["job_level", "craftsmanship", "control", "cp"] as const) {
      const value = attrs[stat];
      if (value != null) this.configByJob[this.job][stat] = value;
    }
    for (const consumable of ["food", "potion"] as const) {
      const variant = attrs[consumable];
      if (variant !== undefined) this.configByJob[this.job][consumable] = variant;
    }
  }

  setConfigForAllJobs(stats: JobConfig) {
    for (const job of JOBS) {
      this.configByJob[job] = JSON.parse(JSON.stringify(stats));
    }
  }
}

export const PlayerState = new _PlayerState();
