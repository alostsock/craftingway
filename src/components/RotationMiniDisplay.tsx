import "./RotationMiniDisplay.scss";

import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { Link } from "wouter";

import { LocaleState } from "../lib/locale-state";
import { type RotationData, useSimulatorResult } from "../lib/rotation-data";
import { stars } from "../lib/utils";
import CopyButton from "./CopyButton";
import CopyMacroButtons from "./CopyMacroButtons";
import { ActionIcon } from "./Icons";
import ProgressMini from "./ProgressMini";
import RotationLoadButton from "./RotationLoadButton";
import StatDisplay from "./StatDisplay";

interface Props {
  rotationData: RotationData;
  slug?: string;
}

const RotationMiniDisplay = observer(function RotationMiniDisplay({ rotationData, slug }: Props) {
  const { player, job, recipe, startingQuality, food, potion, actions } = rotationData;

  const simulatorResult = useSimulatorResult(rotationData);

  const CopyLink = () =>
    slug ? (
      <CopyButton className="link" copyText={`${window.origin}/rotation/${slug}`}>
        Copy link
      </CopyButton>
    ) : null;

  const translatedRecipeName = LocaleState.translateItemName(recipe.name);

  return (
    <section className="RotationMiniDisplay">
      <div className="header">
        <h2 className="nowrap">
          {slug ? (
            <Link href={`/rotation/${slug}`}>{translatedRecipeName}</Link>
          ) : (
            translatedRecipeName
          )}{" "}
        </h2>
        <span className="rlvl nowrap">
          Lv.{recipe.job_level} {stars(recipe.stars)}
        </span>
      </div>

      <StatDisplay job={job} player={player} food={food} potion={potion} />

      <div className="consumables">
        {food && (
          <span className="food nowrap">{LocaleState.translateItemName(food.name, true)}</span>
        )}
        {potion && (
          <span className="potion nowrap">{LocaleState.translateItemName(potion.name, true)}</span>
        )}
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
                  disabled: index > (simulatorResult?.lastValidActionIndex ?? 0),
                })}
              >
                <ActionIcon name={action} step={step} />
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

        <RotationLoadButton rotationData={rotationData} />
      </div>
    </section>
  );
});

export default RotationMiniDisplay;
