import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  DndContext,
  useDraggable,
  useDroppable,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";
import type { Action } from "crafty";

import Icon from "./Icon";
import { ACTIONS } from "../lib/actions";
import { PlayerState } from "../lib/player-state";
import { SimulatorState } from "../lib/simulator-state";
import { generateId } from "../lib/generate-id";

type DragData = { action?: Action };

function idFromAction(action: Action) {
  return `${action}-${generateId()}`;
}

function actionFromId(id: string) {
  let [_, action] = id.match(/(\w+)-\d+/)!;
  return action as Action;
}

const ActionPlaylist = observer(function ActionPlaylist() {
  const id = "droppable-playlist";

  const [items, setItems] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    const { action } = active.data.current as DragData;

    if (over && action) {
      const itemToAdd = idFromAction(action);
      setItems([...items, itemToAdd]);
      return;
    }

    if (over && over.id !== active.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id.toString());
        const newIndex = items.indexOf(over.id.toString());

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  useEffect(() => {
    SimulatorState.actions = items.map(actionFromId);
  }, [items]);

  return (
    <div className="ActionPlaylist">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={horizontalListSortingStrategy}>
          <MutableList id={id} items={items} />
          <PersistentList />
        </SortableContext>
      </DndContext>
    </div>
  );
});

export default ActionPlaylist;

const PersistentList = () => {
  return (
    <div className="actions">
      {ACTIONS.map(({ name }) => (
        <DraggableIcon key={name} id={idFromAction(name)} />
      ))}
    </div>
  );
};

type MutableListProps = {
  id: string;
  items: string[];
};

const MutableList = observer(function MutableList({ id, items }: MutableListProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div id={id} ref={setNodeRef} className="playlist">
      {items.map((id) => (
        <SortableIcon key={id} id={id} />
      ))}
    </div>
  );
});

const DraggableIcon = observer(function DraggableIcon({ id }: { id: string }) {
  const actionName = actionFromId(id);
  const actionLabel = ACTIONS.find((action) => action.name === actionName)?.label;

  if (!actionLabel) return null;

  const data: DragData = { action: actionName };

  const { setNodeRef, transform, attributes, listeners } = useDraggable({ id, data });
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div ref={setNodeRef} id={id} style={style} {...attributes} {...listeners}>
      <Icon name={actionLabel} job={PlayerState.job} type="action" />
    </div>
  );
});

const SortableIcon = observer(function SortableIcon({ id }: { id: string }) {
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

  return (
    <div ref={setNodeRef} id={id} style={style} {...attributes} {...listeners}>
      <Icon name={actionLabel} job={PlayerState.job} type="action" />
    </div>
  );
});
