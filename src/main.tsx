import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { configure } from "mobx";

import App from "./components/App";

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
