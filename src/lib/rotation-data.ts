import type { Action, Player, SimulatorResult } from "crafty";
import { runInAction } from "mobx";
import { useEffect, useState } from "react";

import { ACTIONS } from "../lib/actions";
import { ApiError, getRotation, RotationResponse } from "../lib/api";
import { ConsumableVariant, FOOD_VARIANTS, POTION_VARIANTS } from "../lib/consumables";
import { calculateConsumableBonus } from "../lib/consumables";
import type { Job } from "../lib/jobs";
import { RecipeData, RecipeState } from "../lib/recipe-state";
import { SimulatorState } from "../lib/simulator-state";
import { objectHash } from "./hash";
import { useAutorun } from "./hooks";
import { LogbookState } from "./logbook-state";

export interface RotationData {
  player: Player;
  job: Job;
  recipe: RecipeData;
  ingredients: Record<string, number>;
  startingQuality: number;
  food: ConsumableVariant | null;
  potion: ConsumableVariant | null;
  actions: Action[];
  createdAt: Date;
}

type RotationDataError = { error: string };

export function useRotationData(slug: string): RotationData | RotationDataError | null {
  const [apiResult, setApiResult] = useState<RotationResponse | ApiError | null>(null);
  const [result, setResult] = useState<RotationData | RotationDataError | null>(null);

  useEffect(() => {
    getRotation(slug).then((result) => setApiResult(result));
  }, [slug]);

  useAutorun(() => {
    if (!RecipeState.loaded || !SimulatorState.loaded || !apiResult) {
      return;
    }

    if ("error" in apiResult) {
      setResult(apiResult);
      return;
    }

    const {
      job_level,
      craftsmanship,
      control,
      cp,
      job,
      recipe: recipeName,
      recipe_job_level,
      hq_ingredients,
      food: foodName,
      potion: potionName,
      actions: rawActions,
      created_at,
    } = apiResult;

    if (!job_level || !craftsmanship || !control || !cp) {
      setResult({ error: "Invalid player stats" });
      return;
    }

    const recipe = recipeName.startsWith("Generic Recipe")
      ? SimulatorState.recipesByLevel(recipe_job_level).find((r) => r.name === recipeName) ?? null
      : RecipeState.recipes.find((r) => r.name === recipeName) ?? null;

    if (!recipe) {
      setResult({ error: "Invalid recipe" });
      return;
    }

    const actionNames: string[] = rawActions.split(",");
    const actions = actionNames.every((actionName) => ACTIONS.some((a) => a.name === actionName))
      ? (actionNames as Action[])
      : null;

    if (!actions) {
      setResult({ error: "Invalid actions" });
      return;
    }

    setResult({
      player: { job_level, craftsmanship, control, cp },
      job,
      recipe,
      ingredients: hq_ingredients,
      startingQuality: RecipeState.calculateStartingQuality(recipe, hq_ingredients),
      food: FOOD_VARIANTS.find((f) => f.name === foodName) ?? null,
      potion: POTION_VARIANTS.find((p) => p.name === potionName) ?? null,
      actions,
      createdAt: new Date(created_at * 1000),
    });
  }, [apiResult]);

  if (result && !("error" in result)) {
    runInAction(() => {
      LogbookState.addEntry({
        slug,
        data: result,
        hash: objectHash(result, ["createdAt"]),
      });
    });
  }

  return result;
}

export function useSimulatorResult(rotationData: RotationData | null): SimulatorResult | null {
  const [result, setResult] = useState<SimulatorResult | null>(null);

  useAutorun(() => {
    if (rotationData == null || !SimulatorState.loaded) {
      return;
    }

    const foodBonus = calculateConsumableBonus(rotationData.player, rotationData.food);
    const potionBonus = calculateConsumableBonus(rotationData.player, rotationData.potion);

    const { job_level, craftsmanship, control, cp } = rotationData.player;

    const player: Player = {
      job_level,
      craftsmanship: craftsmanship + foodBonus.craftsmanship + potionBonus.craftsmanship,
      control: control + foodBonus.control + potionBonus.control,
      cp: cp + foodBonus.cp + potionBonus.cp,
    };

    setResult(
      SimulatorState.simulateActions(
        rotationData.recipe,
        player,
        rotationData.actions,
        rotationData.startingQuality
      )
    );
  }, [rotationData]);

  return result;
}
