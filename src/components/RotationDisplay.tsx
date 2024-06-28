import "./RotationDisplay.scss";

import clsx from "clsx";
import { observer } from "mobx-react-lite";
import React from "react";

import { SPECIALIST_ACTIONS } from "../lib/actions";
import { calculateConsumableBonus } from "../lib/consumables";
import { LocaleState } from "../lib/locale-state";
import { useRotationData, useSimulatorResult } from "../lib/rotation-data";
import { STATS } from "../lib/stats";
import CopyMacroButtons from "./CopyMacroButtons";
import CraftStepDisplay from "./CraftStepDisplay";
import DocumentTitle from "./DocumentTitle";
import { ActionIcon } from "./Icons";
import Progress from "./Progress";
import RecipeDisplay from "./RecipeDisplay";
import RotationLoadButton from "./RotationLoadButton";

interface Props {
  slug: string;
}

const RotationDisplay = observer(function RotationDisplay({ slug }: Props) {
  const rotationData = useRotationData(slug);
  const simulatorResult = useSimulatorResult(
    rotationData && "error" in rotationData ? null : rotationData
  );

  if (rotationData && "error" in rotationData) {
    return <section className="RotationDisplay">{rotationData.error}</section>;
  }

  if (rotationData == null || simulatorResult == null) {
    return <section className="RotationDisplay">Loading...</section>;
  }

  const { player, job, recipe, ingredients, startingQuality, food, potion, actions, createdAt } =
    rotationData;
  const {
    progress,
    progress_target,
    quality,
    quality_target,
    cp,
    cp_max,
    durability,
    durability_max,
  } = simulatorResult.craft_state;

  const foodBonus = calculateConsumableBonus(player, food);
  const potionBonus = calculateConsumableBonus(player, potion);

  const timestamp = createdAt
    .toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    })
    .toLocaleLowerCase();

  const delineationCount = actions.filter((a) => SPECIALIST_ACTIONS.includes(a)).length;

  return (
    <div className="RotationDisplay">
      <DocumentTitle prefix={rotationData.recipe.name} />

      <section className="info">
        <h2>
          Saved Rotation <span>{timestamp}</span>
        </h2>
        <RecipeDisplay recipe={recipe} job={job} />

        <div className="player">
          <div className="stats">
            {STATS.map(({ name, label }) => (
              <React.Fragment key={name}>
                <label>{label}</label>
                <div className={clsx("stat", name)}>{player[name]}</div>
                <div className="bonuses">
                  {name !== "job_level" && foodBonus[name] > 0 && (
                    <span className="food">+{foodBonus[name]}</span>
                  )}
                  {name !== "job_level" && potionBonus[name] > 0 && (
                    <span className="potion">+{potionBonus[name]}</span>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="consumables">
            {food ? (
              <React.Fragment>
                <label className="food-active">Food</label>
                <div>{LocaleState.translateItemName(food.name, true)}</div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <label>Food</label>
                <div>None</div>
              </React.Fragment>
            )}
            {potion ? (
              <React.Fragment>
                <label className="potion-active">Potion</label>
                <div>{LocaleState.translateItemName(potion.name, true)}</div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <label>Potion</label>
                <div>None</div>
              </React.Fragment>
            )}
          </div>
        </div>

        {startingQuality > 0 && (
          <div className="ingredients">
            <label>HQ ingredients:</label>
            {Object.entries(ingredients).map(([ingredientName, quantity]) => (
              <div key={ingredientName} className="ingredient">
                {LocaleState.translateItemName(ingredientName)} <span className="x">⨯</span>
                {quantity}
              </div>
            ))}
          </div>
        )}

        {delineationCount > 0 && (
          <div className="delineations">
            Crafter's delineations required: <span>{delineationCount}</span>
          </div>
        )}

        <div className="controls">
          <CopyMacroButtons craftState={simulatorResult.craft_state} actions={actions} />

          <RotationLoadButton rotationData={rotationData} />
        </div>
      </section>

      <section>
        <CraftStepDisplay
          step={simulatorResult.craft_state.step}
          completionReason={simulatorResult.completion_reason ?? null}
        />

        <div className="bars">
          <Progress label="Progress" value={progress} target={progress_target} />
          <Progress
            label="Quality"
            initialValue={startingQuality}
            value={quality}
            target={recipe.can_hq ? quality_target : 0}
          />
          <Progress label="Durability" value={durability} target={durability_max} />
          <Progress label="CP" value={cp} target={cp_max} />
        </div>

        <div className="rotation">
          {actions.map((action, index) => {
            const step = index + 1;
            return (
              <div
                key={index}
                className={clsx("action", {
                  disabled: index > simulatorResult.lastValidActionIndex,
                })}
              >
                <ActionIcon name={action} job={job} step={step} />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
});

export default RotationDisplay;
