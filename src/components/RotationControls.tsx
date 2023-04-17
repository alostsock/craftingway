import "./RotationControls.scss";

import { action } from "mobx";
import { observer } from "mobx-react-lite";

import { SimulatorState } from "../lib/simulator-state";

const RotationControls = observer(function RotationControls() {
  const reset = action(() => {
    SimulatorState.actions = [];
  });

  const copyToClipboard = (lines: string[]) => {
    navigator.clipboard.writeText(lines.join("\r\n"));
  };

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
        <button
          className="link"
          onClick={() => copyToClipboard(SimulatorState.macroTextParts[0])}
          disabled={isSearching}
        >
          Copy macro
        </button>
      )}

      {SimulatorState.macroTextParts.length > 1 && (
        <div className="copy-macro-buttons">
          <span>Copy macro:</span>

          {SimulatorState.macroTextParts.map((macroTextLines, index) => (
            <button
              key={index}
              className="link"
              onClick={() => copyToClipboard(macroTextLines)}
              disabled={isSearching}
            >
              Part {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

export default RotationControls;
