import "./RotationEditor.scss";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { DndContext, useSensor, useSensors, closestCorners } from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import type { DragEndEvent } from "@dnd-kit/core";
import type { Action } from "crafty";

import MutableList from "./MutableList";
import PersistentList from "./PersistentList";
import SearchPanel from "./SearchPanel";
import RotationControls from "../RotationControls";
import ModeSelector from "../ModeSelector";
import Emoji from "../Emoji";

import {
  CustomPointerSensor,
  CustomKeyboardSensor,
  CustomTouchSensor,
} from "../../lib/custom-dnd-sensors";
import { SimulatorState } from "../../lib/simulator-state";
import Storage from "../../lib/storage";
import { generateId } from "../../lib/utils";
import { useReaction } from "../../lib/hooks";

const MODE_STORE = "rotationEditorMode";

type Mode = "manual" | "auto";

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
    useSensor(CustomKeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    useSensor(CustomTouchSensor)
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

  const onModeChange = (mode: Mode) => {
    Storage.store(MODE_STORE, JSON.stringify(mode));
  };

  const manualModeLabel = (
    <span className="mode-label">
      <Emoji emoji="⚒️" />
      Craft manually
    </span>
  );

  const autoModeLabel = (
    <span className="mode-label auto">
      <Emoji emoji="✨" />
      Find a rotation
    </span>
  );

  return (
    <div className="RotationEditor">
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <SortableContext items={itemIds} strategy={rectSortingStrategy}>
          <div className="rotation">
            <MutableList items={itemIds} onRemove={removeItem} />

            <RotationControls />
          </div>

          <ModeSelector
            defaultMode={Storage.retrieve<Mode>(MODE_STORE) || "manual"}
            modeOptions={[
              {
                mode: "manual",
                label: manualModeLabel,
                component: () => <PersistentList onAdd={addItem} />,
              },
              {
                mode: "auto",
                label: autoModeLabel,
                component: () => <SearchPanel />,
              },
            ]}
            onChange={onModeChange}
          />
        </SortableContext>
      </DndContext>
    </div>
  );
});

export default RotationEditor;
