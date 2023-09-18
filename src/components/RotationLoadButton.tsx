import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useLocation } from "wouter";

import { objectHash } from "../lib/hash";
import { PlayerState } from "../lib/player-state";
import { RecipeState } from "../lib/recipe-state";
import { RotationData } from "../lib/rotation-data";
import { SimulatorState } from "../lib/simulator-state";
import StatDisplay from "./StatDisplay";

interface Props {
  rotationData: RotationData;
}

const RotationLoadButton = observer(function RotationLoadButton({ rotationData }: Props) {
  const [shouldConfirm, setShouldConfirm] = useState(false);
  const [_, setLocation] = useLocation();

  const { job_level, craftsmanship, control, cp, food, potion } =
    PlayerState.configByJob[rotationData.job];

  const currentConfig = {
    player: { job_level, craftsmanship, control, cp },
    food,
    potion,
  };

  const load = (confirmed = false) => {
    const newConfig: typeof currentConfig = {
      player: rotationData.player,
      food: rotationData.food,
      potion: rotationData.potion,
    };

    if (confirmed || objectHash(currentConfig) === objectHash(newConfig)) {
      runInAction(() => {
        PlayerState.job = rotationData.job;
        PlayerState.setConfig({
          job_level: rotationData.player.job_level,
          craftsmanship: rotationData.player.craftsmanship,
          control: rotationData.player.control,
          cp: rotationData.player.cp,
          food: rotationData.food,
          potion: rotationData.potion,
        });
        RecipeState.recipe = rotationData.recipe;
        RecipeState.hq_ingredients = rotationData.ingredients;
        SimulatorState.actions = rotationData.actions;
      });
      setLocation("/?recipe");
    } else {
      setShouldConfirm(true);
    }
  };

  return !shouldConfirm ? (
    <button className="link" onClick={() => load()}>
      Edit rotation
    </button>
  ) : (
    <div>
      Editing this rotation will replace your current stats and consumables (
      <StatDisplay job={rotationData.job} {...currentConfig} />
      ). Are you sure?{" "}
      <button className="link" onClick={() => load(true)}>
        OK
      </button>{" "}
      <button className="link" onClick={() => setShouldConfirm(false)}>
        Cancel
      </button>
    </div>
  );
});

export default RotationLoadButton;
