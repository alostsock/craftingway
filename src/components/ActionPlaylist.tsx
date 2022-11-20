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
import c from "clsx";

import type { PointerEvent, KeyboardEvent } from "react";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import type { Action } from "crafty";

import Icon from "./Icon";
import Emoji from "./Emoji";
import { ACTIONS } from "../lib/actions";
import { PlayerState } from "../lib/player-state";
import { SimulatorState } from "../lib/simulator-state";
import { generateId } from "../lib/utils";

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

  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    const { over, active } = event;
    // icon is being rearranged
    if (over && over.id !== active.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id.toString());
        const newIndex = items.indexOf(over.id.toString());

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addItem = (action: Action) => {
    const itemToAdd = idFromAction(action);
    setItems([...items, itemToAdd]);
  };

  const removeItem = (id: string) => {
    const index = items.indexOf(id);
    setItems([...items.slice(0, index), ...items.slice(index + 1)]);
  };

  return (
    <div className="ActionPlaylist">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <MutableList id={id} items={items} showAddOverlay={isDragging} onRemove={removeItem} />
          <PersistentList onAdd={addItem} />
        </SortableContext>
      </DndContext>
    </div>
  );
});

export default ActionPlaylist;

type PersistentListProps = {
  onAdd: (action: Action) => void;
};

const PersistentList = observer(function PersistentList({ onAdd }: PersistentListProps) {
  const activeActions = new Set(SimulatorState.craftState?.available_moves);

  return (
    <div className="PersistentList">
      {ACTIONS.map(({ name, label }) => (
        <button
          key={name}
          className="action"
          title={label}
          onClick={() => onAdd(name)}
          disabled={!activeActions.has(name)}
        >
          <Icon name={label} job={PlayerState.job} type="action" />
        </button>
      ))}
    </div>
  );
});

type MutableListProps = {
  id: string;
  items: string[];
  showAddOverlay: boolean;
  onRemove: (id: string) => void;
};

const MutableList = observer(function MutableList({
  id,
  items,
  showAddOverlay,
  onRemove,
}: MutableListProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div id={id} ref={setNodeRef} className={c("MutableList", showAddOverlay && "overlay")}>
      {items.map((id) => (
        <SortableIcon key={id} id={id} onRemove={onRemove} />
      ))}
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
