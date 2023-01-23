import React, { useState } from "react";
import { generateId } from "../lib/utils";

type ModeOption<Mode extends string> = {
  mode: Mode;
  label: string;
  component: React.ComponentType;
};

type Props<Mode extends string> = {
  prompt?: string;
  defaultMode: Mode;
  modeOptions: ModeOption<Mode>[];
  onChange?: (mode: Mode) => void;
};

export default function ModeSelector<Mode extends string>({
  prompt,
  defaultMode,
  modeOptions,
  onChange,
}: Props<Mode>) {
  const [selectedMode, setMode] = useState<Mode>(defaultMode);

  const handleModeChange = (mode: Mode) => {
    setMode(mode);
    if (onChange) {
      onChange(mode);
    }
  };

  const ModeComponent =
    modeOptions.find((option) => option.mode === selectedMode)?.component ?? EmptyComponent;

  return (
    <div className="ModeSelector">
      <fieldset>
        {/* <legend> on its own doesn't respect display: flex for some reason */}
        {prompt && (
          <span className="legend">
            <legend>{prompt}</legend>
          </span>
        )}

        {modeOptions.map(({ mode, label }) => {
          const id = `mode-selector-input-${generateId()}`;

          return (
            <React.Fragment key={mode}>
              <input
                id={id}
                className="visually-hidden"
                type="radio"
                checked={selectedMode === mode}
                value={mode}
                onChange={() => handleModeChange(mode)}
                autoComplete="off"
              />
              <label htmlFor={id} tabIndex={-1}>
                {label}
              </label>
            </React.Fragment>
          );
        })}
      </fieldset>

      <ModeComponent />
    </div>
  );
}

function EmptyComponent() {
  return null;
}
