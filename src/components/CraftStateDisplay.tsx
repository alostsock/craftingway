import "./CraftStateDisplay.scss";

import clsx from "clsx";
import { observer } from "mobx-react-lite";
import type { CompletionReason } from "crafty";

import RotationEditor from "./rotation-editor/RotationEditor";
import BuffList from "./BuffList";
import Progress from "./Progress";
import { RecipeState } from "../lib/recipe-state";
import { SimulatorState } from "../lib/simulator-state";

type Status = { type: string | undefined; text: string };

const statuses = new Map<CompletionReason | null, Status>([
  [null, { type: undefined, text: "Crafting…" }],
  ["Finished", { type: "success", text: "Synthesis is complete." }],
  ["DurabilityFailure", { type: "failure", text: "No durability remains." }],
  ["InvalidActionFailure", { type: "failure", text: "A bad move was made (probably)." }],
  ["MaxStepsFailure", { type: "failure", text: "The step limit was reached." }],
]);

const CraftStateDisplay = observer(function CraftStateDisplay() {
  if (!RecipeState.recipe || !SimulatorState.craftState) return null;

  const status = statuses.get(SimulatorState.completionReason);
  const step = SimulatorState.craftState.step;

  return (
    <section className="CraftStateDisplay">
      <h2>
        <span className="step">Step {step}</span>
        <span className={clsx("status", status?.type)}>{status?.text}</span>
      </h2>

      <div className="bars">
        <Progress label="Progress" value="progress" target="progress_target" />
        <Progress label="Quality" value="quality" target="quality_target" />
        <Progress label="Durability" value="durability" target="durability_max" />
        <Progress label="CP" value="cp" target="cp_max" />
      </div>

      <BuffList />

      <RotationEditor />
    </section>
  );
});

export default CraftStateDisplay;
