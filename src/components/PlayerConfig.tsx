import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import Emoji from "./Emoji";
import { Job, JOBS } from "../lib/jobs";
import { PlayerState } from "../lib/player-state";
import { RecipeState } from "../lib/recipe-state";

const jobEmojis: Record<Job, string> = {
  CRP: "🪚",
  BSM: "⚔️",
  ARM: "🛡️",
  GSM: "💎",
  LTW: "🥾",
  WVR: "🧦",
  ALC: "☕",
  CUL: "🍞",
};

const statConfig = [
  { name: "job_level", label: "Level", min: 1, max: 90 },
  { name: "craftsmanship", label: "Craftsmanship", min: 0, max: 4000 },
  { name: "control", label: "Control", min: 0, max: 4000 },
  { name: "cp", label: "CP", min: 180, max: 800 },
] as const;

const PlayerConfig = observer(function PlayerConfig() {
  const handleJobChange = action((event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: add warning dialog before clearing recipe
    PlayerState.job = event.target.value as Job;
    RecipeState.recipe = null;
    setCopyMenuState("inactive");
  });

  type CopyMenuState = "inactive" | "copying" | "copying-all";
  const [copyMenuState, setCopyMenuState] = useState<CopyMenuState>("inactive");

  const handleStatsCopy = action((job: Job) => {
    const stats = PlayerState.statsByJob[job];
    PlayerState.setStats(stats);
    setCopyMenuState("inactive");
  });

  const handleStatsCopyAll = action(() => {
    const stats = PlayerState.stats;
    PlayerState.setStatsForAllJobs(stats);
    setCopyMenuState("inactive");
  });

  return (
    <section className="PlayerConfig">
      <fieldset>
        {JOBS.map((job) => {
          const id = `radio-${job}`;

          return (
            <React.Fragment key={job}>
              <input
                id={id}
                className="visually-hidden"
                type="radio"
                name="job"
                checked={PlayerState.job === job}
                value={job}
                onChange={handleJobChange}
                autoComplete="off"
              />
              <label htmlFor={id} tabIndex={-1}>
                <Emoji emoji={jobEmojis[job]} />
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

      {copyMenuState !== "copying" && (
        <button className="link copy-prompt" onClick={() => setCopyMenuState("copying")}>
          Copy stats <strong>from</strong> another job
        </button>
      )}

      {copyMenuState === "copying" && (
        <React.Fragment>
          <div className="copy-prompt">
            Copy stats from…{" "}
            <button className="link" onClick={() => setCopyMenuState("inactive")}>
              Cancel
            </button>
          </div>

          <div className="copy-buttons">
            {JOBS.map((job) => (
              <button key={job} className="link" onClick={() => handleStatsCopy(job)}>
                {job}
              </button>
            ))}
          </div>
        </React.Fragment>
      )}

      {copyMenuState !== "copying-all" && (
        <button className="link copy-prompt" onClick={() => setCopyMenuState("copying-all")}>
          Copy stats <strong>to</strong> all other jobs
        </button>
      )}

      {copyMenuState === "copying-all" && (
        <React.Fragment>
          <div className="copy-prompt">
            Copying <Emoji emoji={jobEmojis[PlayerState.job]} />
            {PlayerState.job} stats to all other jobs…{" "}
          </div>
          <div className="copy-buttons">
            <span>Are you sure?</span>
            <button className="link" onClick={handleStatsCopyAll}>
              OK
            </button>
            <button className="link" onClick={() => setCopyMenuState("inactive")}>
              Cancel
            </button>
          </div>
        </React.Fragment>
      )}
    </section>
  );
});

export default PlayerConfig;
