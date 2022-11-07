import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import Emoji from "./Emoji";
import { Job, JOBS, JOB_EMOJIS } from "../lib/jobs";
import { PlayerState } from "../lib/player-state";
import { RecipeState } from "../lib/recipe-state";

const statConfig = [
  { name: "job_level", label: "Level", min: 1, max: 90 },
  { name: "craftsmanship", label: "Craftsmanship", min: 0, max: 4000 },
  { name: "control", label: "Control", min: 0, max: 4000 },
  { name: "cp", label: "CP", min: 180, max: 800 },
] as const;

const PlayerConfig = observer(function PlayerConfig() {
  type CopyMenuState = "inactive" | "copying" | "copying-all";
  const [copyMenuState, setCopyMenuState] = useState<CopyMenuState>("inactive");

  const handleJobChange = action((event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: add warning dialog before clearing recipe
    PlayerState.job = event.target.value as Job;
    RecipeState.recipe = null;
    setCopyMenuState("inactive");
  });

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
                defaultChecked={PlayerState.job === job}
                value={job}
                onChange={handleJobChange}
                autoComplete="off"
              />
              <label htmlFor={id} tabIndex={-1}>
                <Emoji emoji={JOB_EMOJIS[job]} />
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
        <button className="link prompt" onClick={() => setCopyMenuState("copying")}>
          Copy stats <strong>from</strong> another job
        </button>
      )}

      {copyMenuState === "copying" && (
        <div className="prompt">
          Copy stats from…
          {JOBS.map((job) => (
            <React.Fragment>
              {" "}
              <button key={job} className="link" onClick={() => handleStatsCopy(job)}>
                {job}
              </button>
            </React.Fragment>
          ))}{" "}
          <button className="link" onClick={() => setCopyMenuState("inactive")}>
            Cancel
          </button>
        </div>
      )}

      {copyMenuState !== "copying-all" ? (
        <button className="link prompt" onClick={() => setCopyMenuState("copying-all")}>
          Copy stats <strong>to</strong> all other jobs
        </button>
      ) : (
        <div className="prompt">
          Copying <Emoji emoji={JOB_EMOJIS[PlayerState.job]} />
          {PlayerState.job} stats to all other jobs… Are you sure?{" "}
          <button className="link" onClick={handleStatsCopyAll}>
            OK
          </button>{" "}
          <button className="link" onClick={() => setCopyMenuState("inactive")}>
            Cancel
          </button>
        </div>
      )}
    </section>
  );
});

export default PlayerConfig;
