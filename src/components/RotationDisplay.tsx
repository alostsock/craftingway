import "./RotationDisplay.scss";

import clsx from "clsx";
import type { Action, Player, SimulatorResult } from "crafty";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";

import { ACTIONS } from "../lib/actions";
import { getRotation } from "../lib/api";
import { ConsumableVariant, FOOD_VARIANTS, POTION_VARIANTS } from "../lib/consumables";
import { calculateConsumableBonus } from "../lib/consumables";
import { useReaction } from "../lib/hooks";
import type { Job } from "../lib/jobs";
import { RecipeData, RecipeState } from "../lib/recipe-state";
import { SimulatorState } from "../lib/simulator-state";
import CopyMacroButtons from "./CopyMacroButtons";
import CraftStepDisplay from "./CraftStepDisplay";
import { ActionIcon } from "./Icons";
import Progress from "./Progress";
import RecipeDisplay from "./RecipeDisplay";

const STATS = [
  { name: "job_level", label: "Level" },
  { name: "craftsmanship", label: "Craftsmanship" },
  { name: "control", label: "Control" },
  { name: "cp", label: "CP" },
] as const;

interface Props {
  slug: string;
}

const RotationDisplay = observer(function RotationDisplay({ slug }: Props) {
  const [recipesLoaded, setRecipesLoaded] = useState(RecipeState.loaded);
  useReaction(
    () => RecipeState.loaded,
    (loaded) => setRecipesLoaded(loaded)
  );

  const [simulatorLoaded, setSimulatorLoaded] = useState(SimulatorState.loaded);
  useReaction(
    () => SimulatorState.loaded,
    (loaded) => setSimulatorLoaded(loaded)
  );

  const rotationData = useRotationData(slug, recipesLoaded, simulatorLoaded);

  const simulatorResult = useSimulatorResult(rotationData);

  if (!recipesLoaded || !simulatorLoaded || rotationData == null || simulatorResult == null) {
    return <section className="RotationDisplay">Loading...</section>;
  }

  if (typeof rotationData === "string") {
    return <section className="RotationDisplay">{rotationData}</section>;
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
});

export default RotationDisplay;

interface RotationData {
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

function useRotationData(
  slug: string,
  recipesLoaded: boolean,
  simulatorLoaded: boolean
): RotationData | string | null {
  const [loading, setLoading] = useState(true);
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
    if (!recipesLoaded || !simulatorLoaded) {
      return;
    }

    getRotation(slug).then((result) => {
      setLoading(false);

      if ("error" in result) {
        setApiError(result.error);
        return;
      }

      const {
        job_level,
        craftsmanship,
        control,
        cp,
        job,
        recipe: recipeName,
        hq_ingredients,
        food: foodName,
        potion: potionName,
        actions: rawActions,
        created_at,
      } = result;

      if (job_level && craftsmanship && control && cp) {
        setPlayer({ job_level, craftsmanship, control, cp });
      } else {
        setPlayer(null);
      }

      setJob(job);

      setRecipe(RecipeState.recipes.find((r) => r.name === recipeName) ?? null);

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
    });
  }, [slug, recipesLoaded, simulatorLoaded]);

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

  return {
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
}

function useSimulatorResult(rotationData: RotationData | string | null): SimulatorResult | null {
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
