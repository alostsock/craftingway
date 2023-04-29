import "./RotationControls.scss";

import { action } from "mobx";
import { observer } from "mobx-react-lite";

import CopyButton from "./CopyButton";
import { SimulatorState } from "../lib/simulator-state";

const RotationControls = observer(function RotationControls() {
  const reset = action(() => {
    SimulatorState.actions = [];
  });

  if (SimulatorState.actions.length === 0) {
    return <div className="RotationControls" />;
  }

  const isSearching = SimulatorState.isSearching;

  return (
    <div className="RotationControls">
      <button className="link reset" onClick={reset} disabled={isSearching}>
        Reset
      </button>

      {SimulatorState.macroTextParts.length === 1 && (
        <CopyButton
          className="link"
          copyText={SimulatorState.macroTextParts[0].join("\r\n")}
          disabled={isSearching}
        >
          Copy macro
        </CopyButton>
      )}

      {SimulatorState.macroTextParts.length > 1 && (
        <div className="copy-macro-buttons">
          <span>Copy macro:</span>

          {SimulatorState.macroTextParts.map((macroTextLines, index) => (
            <CopyButton
              key={index}
              className="link"
              copyText={macroTextLines.join("\r\n")}
              disabled={isSearching}
            >
              Part {index + 1}
            </CopyButton>
          ))}
        </div>
      )}
    </div>
  );
});

export default RotationControls;
