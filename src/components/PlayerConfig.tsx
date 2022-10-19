import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";

import Emoji from "./Emoji";
import { Job } from "../lib/jobs";
import { PlayerState } from "../lib/player-state";

const jobs: [emoji: string, job: Job][] = [
  ["🪚", "CRP"],
  ["⚔️", "BSM"],
  ["🛡️", "ARM"],
  ["💎", "GSM"],
  ["🥾", "LTW"],
  ["🧦", "WVR"],
  ["☕", "ALC"],
  ["🍞", "CUL"],
];

const statConfig = [
  { name: "job_level", label: "Level", min: 1, max: 90 },
  { name: "craftsmanship", label: "Craftsmanship", min: 0, max: 4000 },
  { name: "control", label: "Control", min: 0, max: 4000 },
  { name: "cp", label: "CP", min: 180, max: 800 },
] as const;

const PlayerConfig = observer(function PlayerConfig() {
  return (
    <div className="PlayerConfig">
      <fieldset>
        {jobs.map(([emoji, job]) => {
          const id = `radio-${job}`;

          return (
            <React.Fragment key={job}>
              <input
                type="radio"
                id={id}
                name="job"
                checked={PlayerState.job === job}
                value={job}
                onChange={action((e) => (PlayerState.job = e.target.value as Job))}
                autoComplete="off"
              />
              <label htmlFor={id}>
                <Emoji emoji={emoji} />
                {job}
              </label>
            </React.Fragment>
          );
        })}
      </fieldset>

      <div className="stats">
        {statConfig.map(({ name, label, min, max }) => {
          const id = `input-${name}`;

          return (
            <div className="field" key={name}>
              <label htmlFor={id}>{label}</label>
              <input
                id={id}
                key={name}
                type="number"
                min={min}
                max={max}
                value={PlayerState.stats[name].toString()}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  PlayerState.setStats({ [name]: value });
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default PlayerConfig;
