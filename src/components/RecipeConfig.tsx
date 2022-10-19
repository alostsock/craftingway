import {
  Combobox,
  ComboboxInput as Input,
  ComboboxPopover as Popover,
  ComboboxList as List,
  ComboboxOption as Option,
} from "@reach/combobox";
import { observer } from "mobx-react-lite";
import { useState } from "react";

import { useAutorun, useReaction } from "../lib/hooks";
import { PlayerState } from "../lib/player-state";
import { RecipeState, RecipeData } from "../lib/recipe-state";

const RecipeConfig = observer(function RecipeConfig() {
  const [query, setQuery] = useState("");
  const [queryResults, setQueryResults] = useState<RecipeData[]>([]);

  const inputId = "recipe-search";

  useReaction(
    () => PlayerState.job,
    () => setQuery("")
  );

  useAutorun(() => {
    if (query.length >= 1) {
      setQueryResults(RecipeState.searchRecipes(query, PlayerState.job));
    } else {
      setQueryResults([]);
    }
  }, [query]);

  return (
    <section className="RecipeConfig">
      <Combobox>
        <div className="field">
          <label htmlFor={inputId}>Recipe</label>
          <Input id={inputId} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <Popover>
          {queryResults.length > 0 && (
            <List>
              {queryResults.map((recipe) => (
                <Option key={recipe.name} value={recipe.name}>
                  {recipe.name}
                </Option>
              ))}
            </List>
          )}
        </Popover>
      </Combobox>
    </section>
  );
});

export default RecipeConfig;
