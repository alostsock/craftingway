import type { CraftState } from "crafty";
import { observer } from "mobx-react-lite";

import { SimulatorState } from "../lib/simulator-state";

type Props = {
  label: string;
  value: keyof CraftState;
  target: keyof CraftState;
};

const Progress = observer(function Progress({ label, value, target }: Props) {
  if (!SimulatorState.craftState) return null;

  const valueNum = SimulatorState.craftState[value];
  const targetNum = SimulatorState.craftState[target];

  if (typeof valueNum != "number" || typeof targetNum != "number") return null;

  const percentage = Math.floor((valueNum / targetNum) * 100) / 100;

  return (
    <div className="Progress">
      <label>
        <span className="name">{label}</span>
        <span>
          {valueNum} / {targetNum}
        </span>
      </label>

      <div className="progress">
        <div className="bar" style={{ width: `${percentage * 100}%` }} />
      </div>
    </div>
  );
});

export default Progress;
