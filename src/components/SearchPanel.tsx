import "./SearchPanel.scss";

import * as Tooltip from "@radix-ui/react-tooltip";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { SimulatorState } from "../lib/simulator-state";
import Storage from "../lib/storage";
import NumberInput from "./NumberInput";

const CONFIG_VISIBILITY_STORE = "showConfig";

const SearchPanel = observer(function SearchPanel() {
  const [showConfig, setShowConfig] = useState(Storage.retrieve(CONFIG_VISIBILITY_STORE) || false);

  const toggleConfig = () =>
    setShowConfig((previous) => {
      Storage.store(CONFIG_VISIBILITY_STORE, JSON.stringify(!previous));
      return !previous;
    });

  const existingRotation = !!SimulatorState.completionReason;
  const isSearching = SimulatorState.isSearching;

  const search = action(() => {
    if (existingRotation) {
      SimulatorState.actions = [];
    }
    SimulatorState.searchStepwise();
  });

  return (
    <div className="SearchPanel">
      <button className="search" onClick={search} disabled={isSearching}>
        {isSearching ? "Searching..." : existingRotation ? "Reset rotation and search" : "Search"}
      </button>

      <p>
        We'll attempt to find a rotation by exploring lots of possible actions and outcomes. It
        won't be perfect, but it should be good enough to get you started. If you already know which
        actions to use first, you can add them from the "Craft manually" tab.
      </p>

      <button className="link" onClick={toggleConfig} disabled={isSearching}>
        {showConfig ? "Hide" : "Show"} search settings
      </button>

      {showConfig && (
        <div className="config">
          <div className="field max-steps">
            <LabelHelp
              htmlFor="config-max-steps"
              labelText="Max number of crafting steps"
              helpText={
                <span>
                  This is generally the only setting you should change, and it should be set to
                  around 5 steps more than what you'd expect. If this value is too low, the solver
                  won't learn much per iteration; too high and it will waste time on useless extra
                  steps.
                </span>
              }
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
              helpText={
                <span>
                  The number of iterations to run per crafting step. Increasing this value depends
                  on your computational budget, and there are diminishing returns. If you decide to
                  increase this value, then you should probably also increase the exploration
                  constant.
                </span>
              }
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
              helpText={
                <span>
                  A constant ranging from 0 to 1 that configures how the solver scores and picks
                  paths to travel next. A value of 0.0 means actions will be chosen based on their
                  average outcome, whereas 1.0 uses their best outcome achieved so far.
                </span>
              }
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
              helpText={
                <span>
                  A constant that decides how often the solver will explore new, possibly good
                  paths. If this value is too high, moves will basically be decided at random. More
                  info can be found{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Monte_Carlo_tree_search#Exploration_and_exploitation"
                    target="_blank"
                    rel="noreferrer"
                  >
                    here
                  </a>
                  .
                </span>
              }
            />
            <NumberInput
              id="config-exploration"
              isFloatingPoint
              min={0}
              max={1000}
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
  helpText: React.ReactNode;
}) {
  return (
    <Tooltip.Root>
      <Tooltip.TooltipTrigger asChild>
        <label htmlFor={htmlFor}>{labelText}</label>
      </Tooltip.TooltipTrigger>
      <Tooltip.Content asChild side="top" align="start">
        <div className="tooltip">{helpText}</div>
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
