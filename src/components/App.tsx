import "./App.scss";

import { observer } from "mobx-react-lite";
import { Provider as TooltipProvider } from "@radix-ui/react-tooltip";
import { Route, Switch } from "wouter";

import Header from "./Header";
import PlayerConfig from "./PlayerConfig";
import RecipeConfig from "./RecipeConfig";
import CraftStateDisplay from "./CraftStateDisplay";
import Footer from "./Footer";
import RotationDisplay from "./RotationDisplay";

const App = observer(function App() {
  return (
    <div className="App">
      <TooltipProvider delayDuration={400} skipDelayDuration={300}>
        <Header />

        <Switch>
          <Route path="/rotation/:slug">{({ slug }) => <RotationDisplay slug={slug} />}</Route>

          <Route>
            <PlayerConfig />
            <RecipeConfig />
            <CraftStateDisplay />
          </Route>
        </Switch>

        <Footer />
      </TooltipProvider>
    </div>
  );
});

export default App;
