import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  DndContext,
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
} from "@dnd-kit/sortable";

import type { PointerEvent, KeyboardEvent } from "react";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import type { Action } from "crafty";

import MutableList from "./MutableList";
import PersistentList from "./PersistentList";
import { SimulatorState } from "../../lib/simulator-state";
import { generateId } from "../../lib/utils";

function idFromAction(action: Action) {
  return `${action}-${generateId()}`;
}

export function actionFromId(id: string) {
  let [_, action] = id.match(/(\w+)-\d+/)!;
  return action as Action;
}

const RotationEditor = observer(function RotationEditor() {
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
    <div className="RotationEditor">
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <MutableList items={items} onRemove={removeItem} />
          <PersistentList onAdd={addItem} />
        </SortableContext>
      </DndContext>
    </div>
  );
});

export default RotationEditor;

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
