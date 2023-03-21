import { action } from "mobx";
import { observer } from "mobx-react-lite";

import type { Action } from "crafty";

import { PlayerState } from "../../lib/player-state";
import { RecipeState } from "../../lib/recipe-state";
import { SimulatorState } from "../../lib/simulator-state";

type Props = {
  onSearch: (actions: Action[]) => void;
};

const SearchPanel = observer(function SearchPanel({ onSearch }: Props) {
  const search = action(() => {
    if (!RecipeState.recipe) {
      return;
    }

    const actions = SimulatorState.searchStepwise(
      RecipeState.recipe,
      PlayerState.stats,
      SimulatorState.actions,
      (action) => console.log(action)
    );

    onSearch(actions);
  });

  return <button onClick={search}>Search</button>;
});

export default SearchPanel;
