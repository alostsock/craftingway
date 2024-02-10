import "./ModeSelector.scss";

import React, { useState } from "react";

import { generateId } from "../lib/utils";

type ModeOption<Mode extends string> = {
  mode: Mode;
  label: string | React.ReactNode;
  component?: React.ReactNode;
};

type Props<Mode extends string> = {
  name: string;
  prompt: string;
  defaultMode: Mode;
  modeOptions: ModeOption<Mode>[];
  onChange?: (mode: Mode) => void;
  showPrompt?: boolean;
  reverse?: boolean;
};

export default function ModeSelector<Mode extends string>({
  name,
  prompt,
  defaultMode,
  modeOptions,
  onChange,
  showPrompt = false,
  reverse = false,
}: Props<Mode>) {
  const [selectedMode, setMode] = useState<Mode>(defaultMode);

  const handleModeChange = (mode: Mode) => {
    setMode(mode);
    onChange?.(mode);
  };

  const modeComponent =
    modeOptions.find((option) => option.mode === selectedMode)?.component ?? null;

  return (
    <div className="ModeSelector">
      <fieldset>
        {/* <legend> on its own doesn't respect display: flex for some reason */}
        {prompt && showPrompt && !reverse && (
          <span className="legend">
            <legend>{prompt}</legend>
          </span>
        )}

        {modeOptions.map(({ mode, label }) => {
          const id = `mode-selector-input-${generateId()}`;

          return (
            <React.Fragment key={mode}>
              <label htmlFor={id} tabIndex={-1}>
                {label}
              </label>
              <input
                id={id}
                className="visually-hidden"
                type="radio"
                name={name}
                checked={selectedMode === mode}
                value={mode}
                onChange={() => handleModeChange(mode)}
                autoComplete="off"
              />
            </React.Fragment>
          );
        })}

        {prompt && showPrompt && reverse && (
          <span className="legend">
            <legend>{prompt}</legend>
          </span>
        )}
      </fieldset>

      {modeComponent}
    </div>
  );
}
