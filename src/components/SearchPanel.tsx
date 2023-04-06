import { action } from "mobx";
import { observer } from "mobx-react-lite";

import { SimulatorState } from "../lib/simulator-state";

const SearchPanel = observer(function SearchPanel() {
  const search = action(() => SimulatorState.searchStepwise());

  return (
    <button onClick={search} disabled={SimulatorState.searchInProgress}>
      Search
    </button>
  );
});

export default SearchPanel;
