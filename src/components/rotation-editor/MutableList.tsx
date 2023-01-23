import { observer } from "mobx-react-lite";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import c from "clsx";

import { actionFromId } from "./RotationEditor";
import Icon from "../Icon";
import Emoji from "../Emoji";
import { ACTIONS } from "../../lib/actions";
import { SimulatorState } from "../../lib/simulator-state";
import { PlayerState } from "../../lib/player-state";

type MutableListProps = {
  items: string[];
  onRemove: (id: string) => void;
};

const MutableList = observer(function MutableList({ items, onRemove }: MutableListProps) {
  const id = "droppable-mutable-list";

  const { setNodeRef } = useDroppable({ id });

  return (
    <div id={id} ref={setNodeRef} className="MutableList">
      {items.map((id, index) => (
        <SortableIcon key={id} id={id} step={index + 1} onRemove={onRemove} />
      ))}
    </div>
  );
});

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
      className={c("SortableIcon", { disabled })}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Icon name={actionLabel} job={PlayerState.job} type="action" />

      <div className="step" data-no-dnd>
        {step}
      </div>

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

export default MutableList;
