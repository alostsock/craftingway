import "./RotationControls.scss";

import { action } from "mobx";
import { observer } from "mobx-react-lite";

import { createRotation } from "../lib/api";
import { PlayerState } from "../lib/player-state";
import { RecipeState } from "../lib/recipe-state";
import { SimulatorState } from "../lib/simulator-state";
import CopyButton from "./CopyButton";
import CopyMacroButtons from "./CopyMacroButtons";

const RotationControls = observer(function RotationControls() {
  const reset = action(() => {
    SimulatorState.actions = [];
  });

  const getShareableLink = async () => {
    if (!RecipeState.recipe) return;

    const { job_level, craftsmanship, control, cp, food, potion } = PlayerState.config;
    const result = await createRotation({
      version: "6.4-1",
      job: PlayerState.job,
      job_level,
      craftsmanship,
      control,
      cp,
      food: food?.name ?? null,
      potion: potion?.name ?? null,
      recipe_job_level: RecipeState.recipe.job_level,
      recipe: RecipeState.recipe.name,
      hq_ingredients: RecipeState.hq_ingredients,
      actions: SimulatorState.actions.join(","),
    });
    return typeof result === "string" ? `${window.origin}/rotation/${result}` : undefined;
  };

  if (!SimulatorState.craftState || SimulatorState.actions.length === 0) {
    return <div className="RotationControls" />;
  }

  const isSearching = SimulatorState.isSearching;

  return (
    <div className="RotationControls">
      <button className="link reset" onClick={reset} disabled={isSearching}>
        Reset
      </button>

      <CopyMacroButtons
        craftState={SimulatorState.craftState}
        actions={SimulatorState.actions}
        disabled={isSearching}
      />

      <CopyButton className="link" copyText={getShareableLink} disabled={isSearching}>
        Share
      </CopyButton>
    </div>
  );
});

export default RotationControls;
