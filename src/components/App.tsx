import "./App.scss";

import { Provider as TooltipProvider } from "@radix-ui/react-tooltip";
import { observer } from "mobx-react-lite";
import { Redirect, Route, Switch } from "wouter";

import CraftStateDisplay from "./CraftStateDisplay";
import Footer from "./Footer";
import Header from "./Header";
import PlayerConfig from "./PlayerConfig";
import RecipeConfig from "./RecipeConfig";
import RotationDisplay from "./RotationDisplay";

const App = observer(function App() {
  return (
    <div className="App">
      <TooltipProvider delayDuration={400} skipDelayDuration={300}>
        <Header />

        <Switch>
          <Route path="/">
            <PlayerConfig />
            <RecipeConfig />
            <CraftStateDisplay />
          </Route>

          <Route path="/rotation/:slug">{({ slug }) => <RotationDisplay slug={slug} />}</Route>

          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>

        <Footer />
      </TooltipProvider>
    </div>
  );
});

export default App;
