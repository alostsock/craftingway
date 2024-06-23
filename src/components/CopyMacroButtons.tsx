import "./CopyMacroButtons.scss";

import type { Action, CraftState } from "crafty";

import { SimulatorState } from "../lib/simulator-state";
import CopyButton from "./CopyButton";

interface Props {
  craftState: CraftState;
  actions: Action[];
  disabled?: boolean;
}

export default function CopyMacroButtons({ craftState, actions, disabled }: Props) {
  const macroTextParts = SimulatorState.createMacroParts(craftState, actions);

  if (macroTextParts.length === 0) return null;

  // Use Unix-style newlines if the OS appears to be Mac OS. Unsure if this
  // more generally applies to iOS/Linux (since most players should be using the
  // Windows client), so those are ignored for now.
  const newline = window.navigator.userAgent.includes("Mac") ? "\n" : "\r\n";

  if (macroTextParts.length === 1) {
    return (
      <div className="CopyMacroButtons">
        <CopyButton className="link" copyText={macroTextParts[0].join(newline)} disabled={disabled}>
          Copy macro
        </CopyButton>
      </div>
    );
  } else if (macroTextParts.length > 1) {
    return (
      <div className="CopyMacroButtons">
        <span>Copy macro:</span>

        {macroTextParts.map((macroTextLines, index) => (
          <CopyButton
            key={index}
            className="link"
            copyText={macroTextLines.join(newline)}
            disabled={disabled}
          >
            Part {index + 1}
          </CopyButton>
        ))}
      </div>
    );
  } else {
    return null;
  }
}
