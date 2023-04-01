import "./RecipeConfig.scss";

import clsx from "clsx";
import { useCombobox } from "downshift";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import ModeSelector from "./ModeSelector";
import { useAutorun } from "../lib/hooks";
import { PlayerState } from "../lib/player-state";
import { RecipeState, RecipeData } from "../lib/recipe-state";
import { SimulatorState } from "../lib/simulator-state";
import Storage from "../lib/storage";
import { stars } from "../lib/utils";

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
            <h2 className="name">{RecipeState.recipe.name}</h2>
            <div className="info">
              Lv.{RecipeState.recipe.job_level} {stars(RecipeState.recipe.stars)}
            </div>
            <div className="info">Recipe Lv.{RecipeState.recipe.recipe_level}</div>
            <div className="info">Equip Lv.{RecipeState.recipe.equip_level}</div>
            <div className="info">Item Lv.{RecipeState.recipe.item_level}</div>
          </div>

          {otherJobs.length > 0 && (
            <div className="prompt">
              Craft as{" "}
              {otherJobs.map((job) => (
                <button key={job} className="link" onClick={action(() => (PlayerState.job = job))}>
                  {job}
                </button>
              ))}
            </div>
          )}

          <button className="link prompt" onClick={resetRecipe}>
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
    RecipeState.recipe = recipe;
  });

  useAutorun(() => {
    setQueryResults(query.length >= 1 ? RecipeState.searchRecipes(query, 10) : []);
  }, [query]);

  const cb = useCombobox({
    inputValue: query,
    onInputValueChange: ({ inputValue }) => setQuery(inputValue || ""),
    items: queryResults,
    itemToString: (item) => item?.name || "",
    onSelectedItemChange: ({ selectedItem }) => setRecipe(selectedItem || null),
    defaultHighlightedIndex: 0,
  });

  return (
    <div className="RecipesByName field">
      <label {...cb.getLabelProps()}>Name</label>
      <div className="combobox" {...cb.getComboboxProps()}>
        <input
          autoFocus
          placeholder="Orphanage Donation"
          spellCheck="false"
          {...cb.getInputProps()}
        />

        <ul {...cb.getMenuProps()}>
          {queryResults.map((recipe, index) => (
            <li
              key={`${recipe.name}-${index}`}
              className={clsx({ selected: cb.highlightedIndex === index })}
              {...cb.getItemProps({ item: recipe, index })}
            >
              <HighlightedText needle={query} haystack={recipe.name} />

              <div className="subtext">
                Lv.{recipe.job_level} {stars(recipe.stars)}
              </div>

              {!recipe.jobs.has(PlayerState.job) && (
                <div className="subtext job-swap-prompt">
                  Swap to {recipe.jobs.values().next().value}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

function HighlightedText({ needle, haystack }: { needle: string; haystack: string }) {
  type Chunk = { highlight: boolean; text: string };

  const chunks: Chunk[] = [];

  // similar to `fuzzysearch` matching
  let n = 0;
  let h = 0;
  while (h < haystack.length) {
    const nch = needle.charAt(n);
    const hch = haystack.charAt(h++);

    let highlight;
    if (nch && nch.toLowerCase() === hch.toLowerCase()) {
      highlight = false;
      n++;
    } else {
      highlight = true;
    }

    const chunk = chunks[chunks.length - 1];
    if (chunk && chunk.highlight === highlight) {
      chunk.text += hch;
    } else {
      chunks.push({ highlight, text: hch });
    }
  }

  return (
    <div className="HighlightedText">
      {chunks.map(({ highlight, text }, index) => (
        <span key={index} className={clsx({ highlight })}>
          {text}
        </span>
      ))}
    </div>
  );
}

const RecipesByLevel = observer(function RecipesByLevel() {
  const [level, setLevel] = useState<number | null>(null);
  const [queryResults, setQueryResults] = useState<RecipeData[]>([]);

  const setRecipe = action((recipe: RecipeData | null) => (RecipeState.recipe = recipe));

  useAutorun(() => {
    setQueryResults(level != null ? SimulatorState.recipesByLevel(level) : []);
  }, [level]);

  const cb = useCombobox({
    inputValue: level?.toString() || "",
    onInputValueChange: ({ inputValue }) => setLevel((inputValue && parseInt(inputValue)) || null),
    items: queryResults,
    itemToString: (item) => item?.name || "",
    onSelectedItemChange: ({ selectedItem }) => setRecipe(selectedItem || null),
    defaultHighlightedIndex: 0,
  });

  return (
    <div className="RecipesByLevel field">
      <label {...cb.getLabelProps()}>Level</label>
      <div className="combobox" {...cb.getComboboxProps()}>
        <input
          autoFocus
          type="number"
          placeholder="00"
          spellCheck="false"
          {...cb.getInputProps()}
        />

        <ul {...cb.getMenuProps()}>
          {queryResults.map((recipe, index) => (
            <li
              key={`${recipe.name}-${index}`}
              className={clsx({ selected: cb.highlightedIndex === index })}
              {...cb.getItemProps({ item: recipe, index })}
            >
              <div>
                Lv.{recipe.job_level} {stars(recipe.stars)} (Recipe Level {recipe.recipe_level})
              </div>

              <div className="subtext">
                {recipe.progress} progress, {recipe.quality} quality, {recipe.durability} durability
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});
