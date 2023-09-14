import "./RotationMiniDisplay.scss";

import clsx from "clsx";
import React from "react";
import { Link } from "wouter";

import { calculateConsumableBonus } from "../lib/consumables";
import { type RotationData, useSimulatorResult } from "../lib/rotation-data";
import { stars } from "../lib/utils";
import CopyButton from "./CopyButton";
import CopyMacroButtons from "./CopyMacroButtons";
import { ActionIcon } from "./Icons";
import ProgressMini from "./ProgressMini";

interface Props {
  rotationData: RotationData;
  slug?: string;
}

export default function RotationMiniDisplay({ rotationData, slug }: Props) {
  const { player, recipe, startingQuality, food, potion, actions } = rotationData;

  const simulatorResult = useSimulatorResult(rotationData);

  const foodBonus = calculateConsumableBonus(player, food);
  const potionBonus = calculateConsumableBonus(player, potion);

  const CopyLink = () =>
    slug ? (
      <CopyButton className="link" copyText={`${window.origin}/rotation/${slug}`}>
        Copy link
      </CopyButton>
    ) : null;

  const Stat = ({ name }: { name: "craftsmanship" | "control" | "cp" }) => {
    const foodValue = foodBonus[name];
    const potionValue = potionBonus[name];

    return (
      <React.Fragment>
        {player[name] + foodValue + potionValue}
        {foodValue > 0 ? <span className="food">*</span> : null}
        {potionValue > 0 ? <span className="potion">*</span> : null}
      </React.Fragment>
    );
  };

  const Sep = () => <span className="separator"> / </span>;

  return (
    <div className="RotationMiniDisplay">
      <div className="header">
        <h2 className="nowrap">
          {slug ? <Link href={`/rotation/${slug}`}>{recipe.name}</Link> : recipe.name}{" "}
        </h2>
        <span className="rlvl nowrap">
          Lv.{recipe.job_level} {stars(recipe.stars)}
        </span>
      </div>

      <div className="stats">
        <span className="level">Lv.{player.job_level}</span>{" "}
        <span className="nowrap">
          <Stat name="craftsmanship" />
          <Sep />
          <Stat name="control" />
          <Sep />
          <Stat name="cp" />
        </span>
      </div>

      <div className="consumables">
        {food && <span className="food nowrap">{food.name}</span>}
        {potion && <span className="potion nowrap">{potion.name}</span>}
      </div>

      <div className="bars">
        <ProgressMini
          label="Progress"
          value={simulatorResult?.craft_state.progress ?? 0}
          target={simulatorResult?.craft_state.progress_target ?? 0}
        />
        {recipe.can_hq && (
          <ProgressMini
            label="Quality"
            initialValue={startingQuality}
            value={simulatorResult?.craft_state.quality ?? 0}
            target={simulatorResult?.craft_state.quality_target ?? 0}
          />
        )}
      </div>

      <details>
        <summary>
          Show {actions.length} {actions.length > 1 ? "steps" : "step"}
        </summary>

        <div className="actions">
          {actions.map((action, index) => {
            const step = index + 1;
            return (
              <div
                key={index}
                className={clsx("action", {
                  disabled: step >= (simulatorResult?.craft_state.step || 0),
                })}
              >
                <ActionIcon name={action} />
              </div>
            );
          })}
        </div>
      </details>

      <div className="controls">
        <CopyLink />
        {simulatorResult && (
          <CopyMacroButtons craftState={simulatorResult.craft_state} actions={actions} />
        )}
      </div>
    </div>
  );
}
