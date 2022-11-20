import { observer } from "mobx-react-lite";

import PlayerConfig from "./PlayerConfig";
import RecipeConfig from "./RecipeConfig";
import CraftStateDisplay from "./CraftStateDisplay";

const App = observer(function App() {
  return (
    <div className="App">
      <h1>
        crafting<span>way</span>
      </h1>

      <PlayerConfig />

      <RecipeConfig />

      <CraftStateDisplay />
    </div>
  );
});

export default App;
