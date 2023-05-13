import "./RecipeConfig.scss";

import { useCombobox } from "downshift";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import ModeSelector from "./ModeSelector";
import Highlighter from "./Highlighter";
import IngredientConfig from "./IngredientConfig";
import { useAutorun } from "../lib/hooks";
import { PlayerState } from "../lib/player-state";
import { RecipeState, RecipeData } from "../lib/recipe-state";
import { SimulatorState } from "../lib/simulator-state";
import Storage from "../lib/storage";
import { sanitizeIntFromText, stars } from "../lib/utils";
import CopyButton from "./CopyButton";

type Mode = "name" | "level";

const MODE_STORE = "recipeMode";

const RecipeConfig = observer(function RecipeConfig() {
  const resetRecipe = action(() => {
    RecipeState.recipe = null;
    SimulatorState.actions = [];
  });

  const onModeChange = (mode: Mode) => {
    Storage.store(MODE_STORE, JSON.stringify(mode));
    resetRecipe();
  };

  const otherJobs = Array.from(RecipeState.recipe?.jobs.values() || []).filter(
    (job) => job !== PlayerState.job
  );

  return (
    <section className="RecipeConfig">
      {!RecipeState.recipe && (
        <ModeSelector
          prompt="Search for a recipe…"
          defaultMode={Storage.retrieve<Mode>(MODE_STORE) || "name"}
          modeOptions={[
            { mode: "name", label: "by name", component: RecipesByName },
            { mode: "level", label: "by level", component: RecipesByLevel },
          ]}
          onChange={onModeChange}
        />
      )}

      {RecipeState.recipe && (
        <React.Fragment>
          <div className="recipe-display">
            <h2 className="name">
              <CopyButton className="text" copyText={RecipeState.recipe.name}>
                {RecipeState.recipe.name}
              </CopyButton>
            </h2>
            <div className="info">
              Lv.{RecipeState.recipe.job_level} {stars(RecipeState.recipe.stars)}
            </div>
            <div className="info">Recipe Lv.{RecipeState.recipe.recipe_level}</div>
            {RecipeState.recipe.equip_level > 0 && (
              <div className="info">Equip Lv.{RecipeState.recipe.equip_level}</div>
            )}
            {RecipeState.recipe.item_level > 0 && (
              <div className="info">Item Lv.{RecipeState.recipe.item_level}</div>
            )}
          </div>

          {otherJobs.length > 0 && (
            <div className="prompt">
              Craftable as{" "}
              {otherJobs.map((job) => (
                <button key={job} className="link" onClick={action(() => (PlayerState.job = job))}>
                  {job}
                </button>
              ))}
            </div>
          )}

          <IngredientConfig />

          <button
            className="link prompt"
            onClick={resetRecipe}
            disabled={SimulatorState.isSearching}
          >
            Change recipe
          </button>
        </React.Fragment>
      )}
    </section>
  );
});

export default RecipeConfig;

const RecipesByName = observer(function RecipesByName() {
  const [query, setQuery] = useState("");
  const [queryResults, setQueryResults] = useState<RecipeData[]>([]);

  const setRecipe = action((recipe: RecipeData | null) => {
    if (recipe && !recipe.jobs.has(PlayerState.job)) {
      PlayerState.job = recipe.jobs.values().next().value;
    }
    SimulatorState.actions = [];
    RecipeState.recipe = recipe;
  });

  useAutorun(() => {
    setQueryResults(query.length >= 1 ? RecipeState.searchRecipes(query, 10) : []);
  }, [query]);

  const cb = useCombobox({
    defaultInputValue: query,
    onInputValueChange: ({ inputValue }) => setQuery(inputValue || ""),
    items: queryResults,
    itemToString: (item) => item?.name || "",
    onSelectedItemChange: ({ selectedItem }) => setRecipe(selectedItem || null),
    defaultHighlightedIndex: 0,
  });

  return (
    <div className="RecipesByName field">
      <label {...cb.getLabelProps()}>Name</label>
      <div className="dropdown-list" {...cb.getComboboxProps()}>
        <input
          autoFocus
          placeholder="Orphanage Donation"
          spellCheck="false"
          {...cb.getInputProps()}
        />

        <ul {...cb.getMenuProps()}>
          {cb.isOpen &&
            queryResults.map((recipe, index) => (
              <li key={`${recipe.name}-${index}`} {...cb.getItemProps({ item: recipe, index })}>
                <Highlighter needle={query} haystack={recipe.name} />

                <div className="subtext">
                  Lv.{recipe.job_level} {stars(recipe.stars)}
                </div>

                {!recipe.jobs.has(PlayerState.job) && (
                  <div className="subtext job-swap-prompt">
                    Swaps to {recipe.jobs.values().next().value}
                  </div>
                )}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
});

const RecipesByLevel = observer(function RecipesByLevel() {
  const [level, setLevel] = useState<number>(0);
  const [queryResults, setQueryResults] = useState<RecipeData[]>([]);

  const setRecipe = action((recipe: RecipeData | null) => {
    SimulatorState.actions = [];
    RecipeState.recipe = recipe;
  });

  useAutorun(() => {
    setQueryResults(SimulatorState.recipesByLevel(level));
  }, [level]);

  const cb = useCombobox({
    defaultInputValue: level.toString() || "",
    onInputValueChange: ({ inputValue }) => setLevel(sanitizeIntFromText(inputValue || "", 90)),
    items: queryResults,
    itemToString: (item) => item?.name || "",
    onSelectedItemChange: ({ selectedItem }) => setRecipe(selectedItem || null),
    defaultHighlightedIndex: 0,
  });

  return (
    <div className="RecipesByLevel field">
      <label {...cb.getLabelProps()}>Level</label>
      <div className="dropdown-list" {...cb.getComboboxProps()}>
        <input autoFocus type="text" inputMode="numeric" placeholder="00" {...cb.getInputProps()} />

        <ul {...cb.getMenuProps()}>
          {cb.isOpen &&
            queryResults.map((recipe, index) => (
              <li key={`${recipe.name}-${index}`} {...cb.getItemProps({ item: recipe, index })}>
                <div>
                  Lv.{recipe.job_level} {stars(recipe.stars)} (Recipe Level {recipe.recipe_level})
                </div>

                <div className="subtext">
                  {recipe.progress} progress, {recipe.quality} quality, {recipe.durability}{" "}
                  durability
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
});
