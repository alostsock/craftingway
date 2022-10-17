import {
  Combobox,
  ComboboxInput as Input,
  ComboboxPopover as Popover,
  ComboboxList as List,
  ComboboxOption as Option,
} from "@reach/combobox";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import { RecipeState, RecipeData } from "../lib/recipe-state";

const RecipeConfig = observer(function RecipeConfig() {
  const [query, setQuery] = useState("");
  const [queryResults, setQueryResults] = useState<RecipeData[]>([]);

  useEffect(() => {
    const results = query.length >= 1 ? RecipeState.searchRecipes(query) : [];
    setQueryResults(results);
  }, [query]);

  return (
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
  );
});

export default RecipeConfig;
