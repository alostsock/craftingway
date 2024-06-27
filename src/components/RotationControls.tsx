import "./RotationControls.scss";

import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useLocation } from "wouter";

import { createRotation } from "../lib/api";
import { objectHash } from "../lib/hash";
import { LogbookState } from "../lib/logbook-state";
import { PlayerState } from "../lib/player-state";
import { RecipeState } from "../lib/recipe-state";
import { SimulatorState } from "../lib/simulator-state";
import CopyMacroButtons from "./CopyMacroButtons";

const RotationControls = observer(function RotationControls() {
  const [_, setLocation] = useLocation();

  const reset = action(() => {
    SimulatorState.actions = [];
  });

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

      <button className="link" onClick={saveRotation} disabled={isSearching}>
        Save rotation
      </button>
    </div>
  );

  async function saveRotation() {
    if (!RecipeState.recipe) return;

    const { job_level, craftsmanship, control, cp, food, potion } = PlayerState.config;

    const hash = objectHash({
      player: { job_level, craftsmanship, control, cp },
      job: PlayerState.job,
      recipe: RecipeState.recipe,
      ingredients: RecipeState.hq_ingredients,
      startingQuality: RecipeState.startingQuality,
      food: PlayerState.config.food,
      potion: PlayerState.config.potion,
      actions: SimulatorState.actions,
    });

    const existingRotation = LogbookState.entries.find(
      (entry) => entry.hash === hash && entry.slug.length > 0
    );

    if (existingRotation) {
      setLocation(`/rotation/${existingRotation.slug}`);
      return;
    }

    const result = await createRotation({
      version: "7.0-1",
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

    if (typeof result !== "string") {
      // TODO: handle error; introduce toast notifications?
      return;
    }

    setLocation(`/rotation/${result}`);
  }
});

export default RotationControls;
