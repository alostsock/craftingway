import { observer } from "mobx-react-lite";

import PlayerConfig from "./PlayerConfig";
import RecipeConfig from "./RecipeConfig";
import CraftState from "./CraftState";

const App = observer(function App() {
  return (
    <div className="App">
      <h1>
        crafting<span>way</span>
      </h1>

      <PlayerConfig />

      <RecipeConfig />

      <CraftState />
    </div>
  );
});

export default App;
