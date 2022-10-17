import { observer } from "mobx-react-lite";

import { JOBS } from "../lib/jobs";
import { PlayerState } from "../lib/player-state";

const statConfig = [
  { name: "job_level", label: "Job Level", min: 1, max: 90 },
  { name: "craftsmanship", label: "Craftsmanship", min: 0, max: 4000 },
  { name: "control", label: "Control", min: 0, max: 4000 },
  { name: "cp", label: "CP", min: 180, max: 800 },
] as const;

const PlayerConfig = observer(function PlayerConfig() {
  return (
    <div>
      <select id="select-job">
        {JOBS.map((job) => (
          <option key={job}>{job}</option>
        ))}
      </select>

      {statConfig.map(({ name, label, min, max }) => (
        <input
          id={`input-${name}`}
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
      ))}
    </div>
  );
});

export default PlayerConfig;
