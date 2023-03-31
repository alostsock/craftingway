import "./Progress.scss";

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

  return (
    <div className="Progress">
      <label>
        <span className="name">{label}</span>
        <span>
          {valueNum} / {targetNum}
        </span>
      </label>

      <div className="progress">
        <div className="bar" style={{ width: percentage(valueNum, targetNum) }} />
      </div>
    </div>
  );
});

export default Progress;

function percentage(value: number, target: number): string {
  // this is an unrelenting world where progress is (visibly) rounded down at 2 digits
  let p = Math.floor((value / target) * 100) / 100;
  // make sure p is bounded 0 <= p <= 1
  p = Math.max(0, Math.min(1, p));
  return `${p * 100}%`;
}
