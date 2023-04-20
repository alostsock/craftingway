import "./Progress.scss";

import type { CraftState } from "crafty";
import { observer } from "mobx-react-lite";

import { SimulatorState } from "../lib/simulator-state";
import { RecipeState } from "../lib/recipe-state";

type Props = {
  label: string;
  value: Extract<keyof CraftState, "progress" | "quality" | "durability" | "cp">;
  target: keyof CraftState;
};

const Progress = observer(function Progress({ label, value, target }: Props) {
  if (!SimulatorState.craftState || !RecipeState.recipe) return null;

  let valueNum = SimulatorState.craftState[value];

  if (value === "quality") {
    valueNum = Math.max(RecipeState.startingQuality, valueNum);
  }

  let targetNum = SimulatorState.craftState[target];

  if (value === "quality" && !RecipeState.recipe.can_hq) {
    targetNum = 0;
  }

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
  if (target === 0) return "0";
  // this is an unrelenting world where progress is (visibly) rounded down at 2 digits
  let p = Math.floor((value / target) * 100) / 100;
  // make sure p is bounded 0 <= p <= 1
  p = Math.max(0, Math.min(1, p));
  return `${p * 100}%`;
}
