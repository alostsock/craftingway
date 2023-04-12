import "./App.scss";

import { observer } from "mobx-react-lite";
import { Provider as TooltipProvider } from "@radix-ui/react-tooltip";

import Header from "./Header";
import PlayerConfig from "./PlayerConfig";
import RecipeConfig from "./RecipeConfig";
import CraftStateDisplay from "./CraftStateDisplay";
import Footer from "./Footer";

const App = observer(function App() {
  return (
    <div className="App">
      <TooltipProvider delayDuration={400} skipDelayDuration={300}>
        <Header />

        <PlayerConfig />

        <RecipeConfig />

        <CraftStateDisplay />

        <Footer />
      </TooltipProvider>
    </div>
  );
});

export default App;
