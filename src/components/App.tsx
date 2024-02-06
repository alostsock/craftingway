import "./App.scss";
import "../lib/locale-state";

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { Provider as TooltipProvider } from "@radix-ui/react-tooltip";
import { observer } from "mobx-react-lite";
import { Redirect, Route, Switch } from "wouter";

import CraftStateDisplay from "./CraftStateDisplay";
import DocumentTitle from "./DocumentTitle";
import Footer from "./Footer";
import Header from "./Header";
import Logbook from "./Logbook";
import Logo from "./Logo";
import PlayerConfig from "./PlayerConfig";
import RecipeConfig from "./RecipeConfig";
import RotationDisplay from "./RotationDisplay";
import TranslationNotice from "./TranslationNotice";

const App = observer(function App() {
  return (
    <div className="App">
      <I18nProvider i18n={i18n}>
        <TooltipProvider delayDuration={400} skipDelayDuration={300}>
          <Header />

          <TranslationNotice />

          <Switch>
            <Route path="/">
              <DocumentTitle />
              <Logo />
              <PlayerConfig />
              <RecipeConfig />
              <CraftStateDisplay />
            </Route>

            <Route path="/rotation/:slug">{({ slug }) => <RotationDisplay slug={slug} />}</Route>

            <Route path="/logbook/:page?">{({ page }) => <Logbook page={page} />}</Route>

            <Route>
              <Redirect to="/" />
            </Route>
          </Switch>

          <Footer />
        </TooltipProvider>
      </I18nProvider>
    </div>
  );
});

export default App;
