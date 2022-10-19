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
    <div className="RecipeConfig">
      <Combobox>
        <Input value={query} onChange={(e) => setQuery(e.target.value)} />

        {queryResults.length > 0 && (
          <Popover>
            <List>
              {queryResults.map((recipe) => (
                <Option key={recipe.name} value={recipe.name}>
                  {recipe.name}
                </Option>
              ))}
            </List>
          </Popover>
        )}
      </Combobox>
    </div>
  );
});

export default RecipeConfig;
