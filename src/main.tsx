import "./main.scss";

import React from "react";
import ReactDOM from "react-dom/client";
import { configure } from "mobx";

import App from "./components/App";
import { setupURL } from "./lib/url";

configure({
  enforceActions: "observed",
  computedRequiresReaction: true,
  observableRequiresReaction: true,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

setupURL();
