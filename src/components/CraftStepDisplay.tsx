import "./CraftStepDisplay.scss";

import clsx from "clsx";
import type { CompletionReason } from "crafty";

interface Props {
  step: number;
  completionReason: CompletionReason | null;
}

type Status = { type: string | undefined; text: string };

const statuses = new Map<CompletionReason | null, Status>([
  [null, { type: undefined, text: "Crafting…" }],
  ["Finished", { type: "success", text: "Synthesis is complete." }],
  ["DurabilityFailure", { type: "failure", text: "No durability remains." }],
  ["InvalidActionFailure", { type: "failure", text: "A bad move was made (probably)." }],
  ["MaxStepsFailure", { type: "failure", text: "The step limit was reached." }],
]);

export default function CraftStepDisplay({ step, completionReason }: Props) {
  const status = statuses.get(completionReason);

  return (
    <h2 className="CraftStepDisplay">
      <span className="step">Step {step}</span>
      <span className={clsx("status", status?.type)}>{status?.text}</span>
    </h2>
  );
}
