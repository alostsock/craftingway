import "./ModeSelector.scss";

import React, { useState } from "react";

import { generateId } from "../lib/utils";
import EmptyComponent from "./EmptyComponent";

type ModeOption<Mode extends string> = {
  mode: Mode;
  label: string | React.ReactNode;
  component: React.ComponentType;
};

type Props<Mode extends string> = {
  name: string;
  prompt?: string;
  defaultMode: Mode;
  modeOptions: ModeOption<Mode>[];
  onChange?: (mode: Mode) => void;
  reverse?: boolean;
};

export default function ModeSelector<Mode extends string>({
  name,
  prompt,
  defaultMode,
  modeOptions,
  onChange,
  reverse = false,
}: Props<Mode>) {
  const [selectedMode, setMode] = useState<Mode>(defaultMode);

  const handleModeChange = (mode: Mode) => {
    setMode(mode);
    onChange?.(mode);
  };

  const ModeComponent =
    modeOptions.find((option) => option.mode === selectedMode)?.component ?? EmptyComponent;

  return (
    <div className="ModeSelector">
      <fieldset>
        {/* <legend> on its own doesn't respect display: flex for some reason */}
        {prompt && !reverse && (
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

        {prompt && reverse && (
          <span className="legend">
            <legend>{prompt}</legend>
          </span>
        )}
      </fieldset>

      <ModeComponent />
    </div>
  );
}
