import type { CraftState } from "crafty";
import { observer } from "mobx-react-lite";

import { SimulatorState } from "../lib/simulator-state";

type Props = {
  label: string;
  value: keyof CraftState;
  target: keyof CraftState;
};

const Progress = observer(function Progress({ label, value, target }: Props) {
  const id = `progress-${value}`;

  if (!SimulatorState.craftState) return null;

  const valueNum = SimulatorState.craftState[value];
  const targetNum = SimulatorState.craftState[target];

  if (typeof valueNum != "number" || typeof targetNum != "number") return null;

  const percentage = Math.floor(valueNum / targetNum);

  return (
    <div className="Progress">
      <label htmlFor={id}>
        {label}{" "}
        <span>
          {valueNum} / {targetNum}
        </span>
      </label>

      <progress id={id} value={valueNum} max={targetNum}>
        {percentage} %
      </progress>
    </div>
  );
});

export default Progress;
