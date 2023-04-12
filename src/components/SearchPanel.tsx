import "./SearchPanel.scss";

import { useState } from "react";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import * as Tooltip from "@radix-ui/react-tooltip";

import NumberInput from "./NumberInput";
import { SimulatorState } from "../lib/simulator-state";
import Storage from "../lib/storage";

const CONFIG_VISIBILITY_STORE = "showConfig";

const SearchPanel = observer(function SearchPanel() {
  const [showConfig, setShowConfig] = useState(Storage.retrieve(CONFIG_VISIBILITY_STORE) || false);

  const toggleConfig = () =>
    setShowConfig((previous) => {
      Storage.store(CONFIG_VISIBILITY_STORE, JSON.stringify(!previous));
      return !previous;
    });

  const search = action(() => SimulatorState.searchStepwise());

  const isSearching = SimulatorState.isSearching;

  return (
    <div className="SearchPanel">
      <p>
        We'll attempt to find a decent rotation by exploring lots of possible branching actions and
        outcomes.
      </p>

      <button className="search" onClick={search} disabled={isSearching}>
        {isSearching ? "Searching..." : "Search"}
      </button>

      <button className="link" onClick={toggleConfig} disabled={isSearching}>
        {showConfig ? "Hide" : "Show"} search settings
      </button>

      {showConfig && (
        <div className="config">
          <div className="field max-steps">
            <LabelHelp
              htmlFor="config-max-steps"
              labelText="Max number of crafting steps"
              helpText={[
                "Generally, this is the only setting you should change. It should be set to a few",
                "steps more than what you would expect. If the value is too low, the solver won't",
                "learn much per iteration. Too high and it will waste computational budget on",
                "useless extra steps.",
              ].join(" ")}
            />
            <NumberInput
              id="config-max-steps"
              min={0}
              max={40}
              numberValue={SimulatorState.config.maxSteps}
              onNumberChange={(value) => SimulatorState.setConfig({ maxSteps: value })}
              disabled={isSearching}
            />
          </div>

          <div className="field iterations">
            <LabelHelp
              htmlFor="config-iterations"
              labelText="Iterations"
              helpText={[
                "The number of iterations to run per crafting step. Increasing this value depends",
                "on your computational budget, but there are diminishing returns. If you decide to",
                "increase this value, then you should probably also increase the exploration constant.",
              ].join(" ")}
            />
            <NumberInput
              id="config-iterations"
              min={0}
              max={10_000_000}
              numberValue={SimulatorState.config.iterations}
              onNumberChange={(value) => SimulatorState.setConfig({ iterations: value })}
              disabled={isSearching}
            />
          </div>

          <div className="field max-score">
            <LabelHelp
              htmlFor="config-max-score"
              labelText="Score weighting constant"
              helpText={[
                "A constant ranging from 0 to 1 that configures how the solver scores and picks",
                "paths already traveled. A value of 0.0 means actions will be chosen based on their",
                "average outcome, whereas 1.0 uses their best outcome achieved so far.",
              ].join(" ")}
            />
            <NumberInput
              id="config-max-score"
              isFloatingPoint
              min={0}
              max={1}
              numberValue={SimulatorState.config.maxScoreWeightingConstant}
              onNumberChange={(value) =>
                SimulatorState.setConfig({ maxScoreWeightingConstant: value })
              }
              disabled={isSearching}
            />
          </div>

          <div className="field exploration">
            <LabelHelp
              htmlFor="config-exploration"
              labelText="Exploration constant"
              helpText={[
                "A constant that decides how often the solver will explore new, possibly good",
                "paths. If this value is too high, moves will basically be decided entirely at",
                "random.",
              ].join(" ")}
            />
            <NumberInput
              id="config-exploration"
              isFloatingPoint
              min={0}
              max={100}
              numberValue={SimulatorState.config.explorationConstant}
              onNumberChange={(value) => SimulatorState.setConfig({ explorationConstant: value })}
              disabled={isSearching}
            />
          </div>

          <button
            className="link"
            onClick={() => SimulatorState.resetConfig()}
            disabled={isSearching}
          >
            Reset settings to default
          </button>
        </div>
      )}
    </div>
  );
});

export default SearchPanel;

function LabelHelp({
  htmlFor,
  labelText,
  helpText,
}: {
  htmlFor: string;
  labelText: string;
  helpText: string;
}) {
  return (
    <Tooltip.Root>
      <Tooltip.TooltipTrigger asChild>
        <label htmlFor={htmlFor}>{labelText}</label>
      </Tooltip.TooltipTrigger>
      <Tooltip.Content side="top" align="start" sideOffset={8} asChild>
        <div className="tooltip">{helpText}</div>
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
