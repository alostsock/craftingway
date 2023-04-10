import "./SearchPanel.scss";

import { useState } from "react";
import { action } from "mobx";
import { observer } from "mobx-react-lite";

import NumberInput from "./NumberInput";
import { SimulatorState } from "../lib/simulator-state";

const SearchPanel = observer(function SearchPanel() {
  const [showConfig, setShowConfig] = useState(false);

  const toggleConfig = () => setShowConfig((prev) => !prev);

  const search = action(() => SimulatorState.searchStepwise());

  return (
    <div className="SearchPanel">
      <p>
        We'll attempt to find a decent rotation by exploring lots of possible branching actions and
        outcomes.
      </p>

      <button className="search" onClick={search}>
        Search
      </button>

      <button className="link" onClick={toggleConfig}>
        {showConfig ? "Hide" : "Show"} search settings
      </button>

      {showConfig && (
        <div className="config">
          <div className="field max-steps">
            <label>Max number of crafting steps</label>
            <NumberInput
              min={0}
              max={40}
              numberValue={SimulatorState.config.maxSteps}
              onNumberChange={(value) => SimulatorState.setConfig({ maxSteps: value })}
            />
          </div>

          <div className="field iterations">
            <label>Iterations</label>
            <NumberInput
              min={0}
              max={10_000_000}
              numberValue={SimulatorState.config.iterations}
              onNumberChange={(value) => SimulatorState.setConfig({ iterations: value })}
            />
          </div>

          <div className="field max-score">
            <label>Score weighting constant</label>{" "}
            <NumberInput
              isFloatingPoint
              min={0}
              max={1}
              numberValue={SimulatorState.config.maxScoreWeightingConstant}
              onNumberChange={(value) =>
                SimulatorState.setConfig({ maxScoreWeightingConstant: value })
              }
            />
          </div>

          <div className="field exploration">
            <label>Exploration constant</label>
            <NumberInput
              isFloatingPoint
              min={0}
              max={100}
              numberValue={SimulatorState.config.explorationConstant}
              onNumberChange={(value) => SimulatorState.setConfig({ explorationConstant: value })}
            />
          </div>

          <button className="link" onClick={() => SimulatorState.resetConfig()}>
            Reset settings to default
          </button>
        </div>
      )}
    </div>
  );
});

export default SearchPanel;
