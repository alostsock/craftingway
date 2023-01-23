import clsx from "clsx";
import { useCombobox } from "downshift";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { useAutorun } from "../lib/hooks";
import { PlayerState } from "../lib/player-state";
import { RecipeState, RecipeData } from "../lib/recipe-state";
import { SimulatorState } from "../lib/simulator-state";
import { stars } from "../lib/utils";

const RESULT_COUNT = 5;

const RecipeConfig = observer(function RecipeConfig() {
  const modes = ["name", "level"] as const;
  type Mode = typeof modes[number];
  const [selectedMode, selectMode] = useState<Mode>("name");

  const handleReset = action(() => (RecipeState.recipe = null));

  const handleModeChange = (mode: Mode) => {
    selectMode(mode);
    handleReset();
  };

  const otherJobs = Array.from(RecipeState.recipe?.jobs.values() || []).filter(
    (job) => job !== PlayerState.job
  );

  return (
    <section className="RecipeConfig">
      {!RecipeState.recipe && (
        <fieldset>
          {/* <legend> on its own doesn't respect display: flex for some reason */}
          <span className="legend">
            <legend>Search for a recipe…</legend>
          </span>

          {modes.map((mode) => {
            const id = `input-mode-${mode}`;
            return (
              <React.Fragment key={mode}>
                <input
                  id={id}
                  className="visually-hidden"
                  type="radio"
                  name="mode"
                  checked={selectedMode === mode}
                  value={mode}
                  onChange={() => handleModeChange(mode)}
                  autoComplete="off"
                />
                <label htmlFor={id} tabIndex={-1}>
                  by {mode}
                </label>
              </React.Fragment>
            );
          })}
        </fieldset>
      )}

      {!RecipeState.recipe && selectedMode === "name" && <RecipesByName />}
      {!RecipeState.recipe && selectedMode === "level" && <RecipesByLevel />}

      {RecipeState.recipe && (
        <React.Fragment>
          <div className="recipe-display">
            <h2 className="name">{RecipeState.recipe.name}</h2>
            <div className="job level">
              Lv.{RecipeState.recipe.job_level} {stars(RecipeState.recipe.stars)}
            </div>
            <div className="recipe level">Recipe Lv.{RecipeState.recipe.recipe_level}</div>
            <div className="equip level">Equip Lv.{RecipeState.recipe.equip_level}</div>
            <div className="item level">Item Lv.{RecipeState.recipe.item_level}</div>
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

          <button className="link prompt" onClick={handleReset}>
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
    setQueryResults(query.length >= 1 ? RecipeState.searchRecipes(query, RESULT_COUNT) : []);
  }, [query]);

  const cb = useCombobox({
    inputValue: query,
    onInputValueChange: ({ inputValue }) => setQuery(inputValue || ""),
    items: queryResults,
    itemToString: (item) => item?.name || "",
    onSelectedItemChange: ({ selectedItem }) => setRecipe(selectedItem || null),
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
          {cb.isOpen &&
            queryResults.map((recipe, index) => (
              <li
                key={`${recipe.name}-${index}`}
                className={clsx({ selected: cb.highlightedIndex === index })}
                {...cb.getItemProps({ item: recipe, index })}
              >
                <HighlightedText needle={query} haystack={recipe.name} />

                <div className="level-info">
                  Lv.{recipe.job_level} {stars(recipe.stars)}
                </div>

                {!recipe.jobs.has(PlayerState.job) && (
                  <div className="job-swap-prompt">Swap to {recipe.jobs.values().next().value}</div>
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
          {cb.isOpen &&
            queryResults.map((recipe, index) => (
              <li
                key={`${recipe.name}-${index}`}
                className={clsx({ selected: cb.highlightedIndex === index })}
                {...cb.getItemProps({ item: recipe, index })}
              >
                <div>{recipe.name}</div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
});
