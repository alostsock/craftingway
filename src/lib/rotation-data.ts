import type { Action, Player, SimulatorResult } from "crafty";
import { useEffect, useState } from "react";

import { ACTIONS } from "../lib/actions";
import { getRotation, RotationResponse } from "../lib/api";
import { ConsumableVariant, FOOD_VARIANTS, POTION_VARIANTS } from "../lib/consumables";
import { calculateConsumableBonus } from "../lib/consumables";
import type { Job } from "../lib/jobs";
import { RecipeData, RecipeState } from "../lib/recipe-state";
import { SimulatorState } from "../lib/simulator-state";
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

export function useRotationData(slug: string): RotationData | string | null {
  const [loading, setLoading] = useState(true);
  const [apiResult, setApiResult] = useState<RotationResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const [player, setPlayer] = useState<Player | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [ingredients, setIngredients] = useState<Record<string, number> | null>(null);
  const [food, setFood] = useState<ConsumableVariant | null>(null);
  const [potion, setPotion] = useState<ConsumableVariant | null>(null);
  const [actions, setActions] = useState<Action[] | null>(null);
  const [createdAt, setCreatedAt] = useState<Date | null>(null);

  useEffect(() => {
    getRotation(slug).then((result) => {
      if ("error" in result) {
        setApiError(result.error);
      } else {
        setApiResult(result);
      }
    });
  }, [slug]);

  useAutorun(() => {
    if (!RecipeState.loaded || !SimulatorState.loaded || !apiResult) {
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

    if (job_level && craftsmanship && control && cp) {
      setPlayer({ job_level, craftsmanship, control, cp });
    } else {
      setPlayer(null);
    }

    setJob(job);

    if (recipeName.startsWith("Generic Recipe")) {
      setRecipe(
        SimulatorState.recipesByLevel(recipe_job_level).find((r) => r.name === recipeName) ?? null
      );
    } else {
      setRecipe(RecipeState.recipes.find((r) => r.name === recipeName) ?? null);
    }

    setIngredients(hq_ingredients);

    setFood(FOOD_VARIANTS.find((f) => f.name === foodName) ?? null);

    setPotion(POTION_VARIANTS.find((p) => p.name === potionName) ?? null);

    const actionNames = rawActions.split(",");
    if (actionNames.every((actionName) => ACTIONS.some((a) => a.name === actionName))) {
      setActions(actionNames as Action[]);
    } else {
      setActions(null);
    }

    setCreatedAt(new Date(created_at * 1000));

    setLoading(false);
  }, [apiResult]);

  if (loading) {
    return null;
  }

  if (apiError != null) {
    return apiError;
  }

  for (const [attr, errorMessage] of [
    [player, "Invalid player stats"],
    [job, "Invalid job"],
    [recipe, "Invalid recipe"],
    [ingredients, "Invalid ingredients"],
    [actions, "Invalid actions"],
    [createdAt, "Invalid date"],
  ] as const) {
    if (attr == null) {
      return errorMessage;
    }
  }

  if (!player || !job || !recipe || !ingredients || !actions || !createdAt) {
    // this should be unreachable
    return "There was a problem loading this rotation";
  }

  const rotationData = {
    player,
    job,
    recipe,
    ingredients,
    startingQuality: RecipeState.calculateStartingQuality(recipe, ingredients),
    food,
    potion,
    actions,
    createdAt,
  };

  LogbookState.addEntry({ key: slug, data: rotationData });

  return rotationData;
}

export function useSimulatorResult(
  rotationData: RotationData | string | null
): SimulatorResult | null {
  const [result, setResult] = useState<SimulatorResult | null>(null);

  useEffect(() => {
    if (rotationData == null || typeof rotationData === "string") {
      return;
    }

    const foodBonus = calculateConsumableBonus(rotationData.player, rotationData.food);
    const potionBonus = calculateConsumableBonus(rotationData.player, rotationData.potion);

    const { job_level, craftsmanship, control, cp } = rotationData.player;

    const player: Player = {
      job_level,
      craftsmanship: craftsmanship + foodBonus.craftsmanship + potionBonus.craftsmanship,
      control: control + foodBonus.control + potionBonus.craftsmanship,
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
