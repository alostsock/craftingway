import "./RotationDisplay.scss";

import clsx from "clsx";
import React from "react";

import { calculateConsumableBonus } from "../lib/consumables";
import { useRotationData, useSimulatorResult } from "../lib/rotation-data";
import { STATS } from "../lib/stats";
import CopyMacroButtons from "./CopyMacroButtons";
import CraftStepDisplay from "./CraftStepDisplay";
import DocumentTitle from "./DocumentTitle";
import { ActionIcon } from "./Icons";
import Progress from "./Progress";
import RecipeDisplay from "./RecipeDisplay";

interface Props {
  slug: string;
}

const RotationDisplay = function RotationDisplay({ slug }: Props) {
  const rotationData = useRotationData(slug);
  const simulatorResult = useSimulatorResult(
    rotationData && "error" in rotationData ? null : rotationData
  );

  if (rotationData == null || simulatorResult == null) {
    return <section className="RotationDisplay">Loading...</section>;
  }

  if ("error" in rotationData) {
    return <section className="RotationDisplay">{rotationData.error}</section>;
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
            {food && (
              <React.Fragment>
                <label className="food-active">Food</label>
                <div>{food.name}</div>
              </React.Fragment>
            )}
            {potion && (
              <React.Fragment>
                <label className="potion-active">Potion</label>
                <div>{potion.name}</div>
              </React.Fragment>
            )}
          </div>
        </div>

        {startingQuality > 0 && (
          <div className="ingredients">
            <label>Quality ingredients:</label>
            {Object.entries(ingredients).map(([ingredientName, quantity]) => (
              <div key={ingredientName} className="ingredient">
                {ingredientName} <span className="x">⨯</span>
                {quantity}
              </div>
            ))}
          </div>
        )}

        <CopyMacroButtons craftState={simulatorResult.craft_state} actions={actions} />
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
                className={clsx("action", { disabled: step >= simulatorResult.craft_state.step })}
              >
                <ActionIcon name={action} step={step} />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default RotationDisplay;
