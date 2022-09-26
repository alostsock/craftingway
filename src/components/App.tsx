import { observer } from "mobx-react-lite";
import { useState } from "react";
import type { CraftState } from "crafty";

import { JOBS } from "../lib/jobs";
import { Player } from "../lib/player";
import { Simulator } from "../lib/simulator";

const statConfig = [
  { name: "job_level", label: "Job Level", min: 1, max: 90 },
  { name: "craftsmanship", label: "Craftsmanship", min: 0, max: 4000 },
  { name: "control", label: "Control", min: 0, max: 4000 },
  { name: "cp", label: "CP", min: 0, max: 800 },
] as const;

const App = observer(function App() {
  let [result, setResult] = useState<CraftState>();

  const testSim = () => {
    const start = performance.now();
    const recipe = Simulator.recipesByJobLevel(90)[0];
    console.log(JSON.stringify(recipe, null, 2));
    const result = Simulator.simulateActions(recipe, Player.stats, [
      "MuscleMemory",
      "Manipulation",
      "WasteNotII",
      "Veneration",
      "Groundwork",
      "Innovation",
      "PreparatoryTouch",
      "PreparatoryTouch",
      "GreatStrides",
      "ByregotsBlessing",
    ]);
    const elapsed = performance.now() - start;
    console.log(`time elapsed: ${elapsed} ms`);
    setResult(result);
  };

  return (
    <div className="App">
      <div className="player-stats">
        <select id="select-job">
          {JOBS.map((job) => (
            <option key={job}>{job}</option>
          ))}
        </select>

        {statConfig.map((config) => (
          <input
            id={`input-${config.name}`}
            key={config.name}
            type="number"
            min={config.min}
            max={config.max}
            value={Player.stats[config.name].toString()}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              Player.setStats({ [config.name]: value });
            }}
          />
        ))}
      </div>

      {}

      {Simulator.loaded && <button onClick={testSim}>test sim</button>}

      {result && (
        <pre>
          <code>{JSON.stringify(result, null, 2)}</code>
        </pre>
      )}
    </div>
  );
});

export default App;
