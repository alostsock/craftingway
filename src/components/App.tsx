import { observer } from "mobx-react-lite";

import PlayerConfig from "./PlayerConfig";
import RecipeConfig from "./RecipeConfig";

const App = observer(function App() {
  return (
    <div className="App">
      <h1>
        crafting<span>way</span>
      </h1>

      <PlayerConfig />
      <RecipeConfig />
    </div>
  );
});

export default App;
