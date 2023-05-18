import "./main.scss";

import React from "react";
import ReactDOM from "react-dom/client";
import { configure } from "mobx";

import App from "./components/App";

configure({
  enforceActions: "observed",
  computedRequiresReaction: true,
  // This causes some false positives to appear, but can be useful for debugging
  // observableRequiresReaction: true,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
