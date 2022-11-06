import c from "clsx";
import { useCombobox } from "downshift";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useState } from "react";

import { useAutorun, useReaction } from "../lib/hooks";
import { PlayerState } from "../lib/player-state";
import { RecipeState, RecipeData } from "../lib/recipe-state";

const RESULT_COUNT = 5;

const stars = (n: number) => Array(n).fill("★").join("");

const RecipeConfig = observer(function RecipeConfig() {
  const [query, setQuery] = useState("");
  const [queryResults, setQueryResults] = useState<RecipeData[]>([]);

  const inputId = "recipe-search";
  const inputPrompt = "Search for a recipe";

  useReaction(
    () => PlayerState.job,
    () => setQuery("")
  );

  useAutorun(() => {
    if (query.length >= 1) {
      const result = RecipeState.searchRecipes(query.toLowerCase(), PlayerState.job, RESULT_COUNT);
      setQueryResults(result);
    } else {
      setQueryResults([]);
    }
  }, [query]);

  const {
    getComboboxProps,
    getLabelProps,
    getInputProps,
    getMenuProps,
    getItemProps,
    isOpen,
    highlightedIndex,
    reset: resetCombobox,
  } = useCombobox({
    inputId,
    inputValue: query,
    onInputValueChange({ inputValue }) {
      setQuery(inputValue || "");
    },
    items: queryResults,
    itemToString(item) {
      return item?.name || "";
    },
    onSelectedItemChange({ selectedItem }) {
      setRecipe(selectedItem || null);
    },
  });

  const setRecipe = action((recipe: RecipeData | null) => {
    if (recipe && !recipe.jobs.has(PlayerState.job)) {
      PlayerState.job = recipe.jobs.values().next().value;
    }
    RecipeState.recipe = recipe;
  });

  const handleReset = action(() => {
    RecipeState.recipe = null;
    setQuery("");
    resetCombobox();
  });

  return (
    <section className="RecipeConfig">
      <div className="field">
        <label htmlFor={inputId} {...getLabelProps()}>
          Recipe
        </label>

        <div className="combobox" {...getComboboxProps()}>
          <input id={inputId} placeholder={inputPrompt} spellCheck="false" {...getInputProps()} />

          <ul {...getMenuProps()}>
            {isOpen &&
              queryResults.map((recipe, index) => (
                <li
                  key={recipe.name}
                  className={c({ selected: highlightedIndex === index })}
                  {...getItemProps({ item: recipe, index })}
                >
                  <HighlightedText needle={query} haystack={recipe.name} />

                  <div className="level-info">
                    Lv.{recipe.job_level} {stars(recipe.stars)}
                  </div>

                  {!recipe.jobs.has(PlayerState.job) && (
                    <div className="job-swap-prompt">
                      Swap to {recipe.jobs.values().next().value}
                    </div>
                  )}
                </li>
              ))}
          </ul>
        </div>
      </div>

      {RecipeState.recipe && (
        <button className="link prompt" onClick={handleReset}>
          Clear recipe
        </button>
      )}
    </section>
  );
});

export default RecipeConfig;

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
        <span key={index} className={c({ highlight })}>
          {text}
        </span>
      ))}
    </div>
  );
}
