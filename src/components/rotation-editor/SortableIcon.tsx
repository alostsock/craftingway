import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useSortable } from "@dnd-kit/sortable";

import { actionFromId } from "./RotationEditor";
import Icon from "../Icon";
import Emoji from "../Emoji";
import { ACTIONS } from "../../lib/actions";
import { SimulatorState } from "../../lib/simulator-state";
import { PlayerState } from "../../lib/player-state";

type SortableIconProps = {
  id: string;
  step: number;
  onRemove: (id: string) => void;
};

const SortableIcon = observer(function SortableIcon({ id, step, onRemove }: SortableIconProps) {
  const actionName = actionFromId(id);
  const actionLabel = ACTIONS.find((action) => action.name === actionName)?.label;

  if (!actionLabel) return null;

  const { setNodeRef, transform, transition, attributes, listeners } = useSortable({ id });
  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        transition,
      }
    : undefined;

  const disabled = SimulatorState.craftState != null && step >= SimulatorState.craftState.step;

  return (
    <div
      ref={setNodeRef}
      id={id}
      className={clsx("SortableIcon", { disabled })}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Icon name={actionLabel} job={PlayerState.job} type="action" step={step} />

      <button
        className="remove"
        title={`Remove ${actionLabel}`}
        onClick={() => onRemove(id)}
        data-no-dnd
      >
        <Emoji emoji="❌" />
      </button>
    </div>
  );
});

export default SortableIcon;
