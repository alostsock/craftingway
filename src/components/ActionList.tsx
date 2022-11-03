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
  closestCorners,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";

import type { PointerEvent, KeyboardEvent } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import type { Action } from "crafty";

import Icon from "./Icon";
import Emoji from "./Emoji";
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
    useSensor(CustomPointerSensor),
    useSensor(CustomKeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    SimulatorState.actions = items.map(actionFromId);
  }, [items]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    const { action } = active.data.current as DragData;
    // icon was dragged in from the persistent list
    if (over && action) {
      const itemToAdd = idFromAction(action);
      setItems([...items, itemToAdd]);
      return;
    }
    // icon is being rearranged
    if (over && over.id !== active.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id.toString());
        const newIndex = items.indexOf(over.id.toString());

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const removeItem = (id: string) => {
    const index = items.indexOf(id);
    setItems([...items.slice(0, index), ...items.slice(index + 1)]);
  };

  return (
    <div className="ActionList">
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <MutableList id={id} items={items} onRemove={removeItem} />
          <PersistentList />
        </SortableContext>
      </DndContext>
    </div>
  );
});

export default ActionPlaylist;

const PersistentList = observer(function PersistentList() {
  const activeActions = new Set(SimulatorState.craftState?.available_moves);

  return (
    <div className="actions">
      {ACTIONS.map(({ name }) => (
        <DraggableIcon key={name} id={idFromAction(name)} disabled={!activeActions.has(name)} />
      ))}
    </div>
  );
});

type MutableListProps = {
  id: string;
  items: string[];
  onRemove: (id: string) => void;
};

const MutableList = observer(function MutableList({ id, items, onRemove }: MutableListProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div id={id} ref={setNodeRef} className="playlist">
      {items.map((id) => (
        <SortableIcon key={id} id={id} onRemove={onRemove} />
      ))}
    </div>
  );
});

type DraggableIconProps = {
  id: string;
  disabled?: boolean;
};

const DraggableIcon = observer(function DraggableIcon({ id, disabled }: DraggableIconProps) {
  const actionName = actionFromId(id);
  const actionLabel = ACTIONS.find((action) => action.name === actionName)?.label;

  if (!actionLabel) return null;

  const data: DragData = { action: actionName };

  const { setNodeRef, transform, attributes, listeners } = useDraggable({ id, data, disabled });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div ref={setNodeRef} id={id} style={style} {...attributes} {...listeners}>
      <Icon name={actionLabel} job={PlayerState.job} type="action" />
    </div>
  );
});

type SortableIconProps = {
  id: string;
  onRemove: (id: string) => void;
};

const SortableIcon = observer(function SortableIcon({ id, onRemove }: SortableIconProps) {
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
    <div
      ref={setNodeRef}
      id={id}
      className="SortableIcon"
      style={style}
      {...attributes}
      {...listeners}
    >
      <Icon name={actionLabel} job={PlayerState.job} type="action" />
      <button title={`Remove ${actionLabel}`} onClick={() => onRemove(id)} data-no-dnd>
        <Emoji emoji="❌" />
      </button>
    </div>
  );
});

class CustomPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: "onPointerDown" as const,
      handler: ({ nativeEvent: event }: PointerEvent) => {
        return shouldHandleEvent(event.target as HTMLElement);
      },
    },
  ];
}

class CustomKeyboardSensor extends KeyboardSensor {
  static activators = [
    {
      eventName: "onKeyDown" as const,
      handler: ({ nativeEvent: event }: KeyboardEvent) => {
        return shouldHandleEvent(event.target as HTMLElement);
      },
    },
  ];
}

function shouldHandleEvent(element: HTMLElement | null) {
  let current = element;

  while (current) {
    if (current.dataset.noDnd) {
      return false;
    }
    current = current.parentElement;
  }

  return true;
}
