import { useState } from "react";
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
import type { DragEndEvent } from "@dnd-kit/core";
import type { Action } from "crafty";

import MutableList from "./MutableList";
import PersistentList from "./PersistentList";
import SearchPanel from "./SearchPanel";
import ModeSelector from "../ModeSelector";
import { SimulatorState } from "../../lib/simulator-state";
import { generateId } from "../../lib/utils";
import { useReaction } from "../../lib/hooks";

function idFromAction(action: Action) {
  return `${action}-${generateId()}`;
}

export function actionFromId(id: string) {
  let [_, action] = id.match(/(\w+)-\d+/)!;
  return action as Action;
}

const RotationEditor = observer(function RotationEditor() {
  const [itemIds, setItemIds] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(CustomPointerSensor),
    useSensor(CustomKeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useReaction(
    () => SimulatorState.actions,
    (actions) => setItemIds(actions.map(idFromAction))
  );

  const save = (ids: string[]) => {
    SimulatorState.actions = ids.map(actionFromId);
  };

  const addItem = (action: Action) => {
    const itemToAdd = idFromAction(action);
    save([...itemIds, itemToAdd]);
  };

  const removeItem = (id: string) => {
    const i = itemIds.indexOf(id);
    save([...itemIds.slice(0, i), ...itemIds.slice(i + 1)]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    // icon is being rearranged
    if (over && over.id !== active.id) {
      const oldIndex = itemIds.indexOf(active.id.toString());
      const newIndex = itemIds.indexOf(over.id.toString());
      save(arrayMove(itemIds, oldIndex, newIndex));
    }
  };

  return (
    <div className="RotationEditor">
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <SortableContext items={itemIds} strategy={rectSortingStrategy}>
          <MutableList items={itemIds} onRemove={removeItem} />

          <ModeSelector
            defaultMode="manual"
            modeOptions={[
              {
                mode: "manual",
                label: "Manual",
                component: () => <PersistentList onAdd={addItem} />,
              },
              {
                mode: "auto",
                label: "Auto",
                component: () => <SearchPanel />,
              },
            ]}
          />
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
