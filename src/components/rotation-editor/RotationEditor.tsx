import "./RotationEditor.scss";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { DndContext, useSensor, useSensors, closestCorners, DragOverlay } from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import type { DragStartEvent, DragMoveEvent, DragEndEvent } from "@dnd-kit/core";
import type { Action } from "crafty";

import MutableList from "./MutableList";
import PersistentList from "./PersistentList";
import { actionFromId, idFromAction } from "./converters";
import { ActionIcon } from "../Icons";
import RotationControls from "../RotationControls";
import SearchPanel from "../SearchPanel";
import ModeSelector from "../ModeSelector";
import Emoji from "../Emoji";

import {
  CustomPointerSensor,
  CustomKeyboardSensor,
  CustomTouchSensor,
} from "../../lib/custom-dnd-sensors";
import { SimulatorState } from "../../lib/simulator-state";
import Storage from "../../lib/storage";
import { useReaction } from "../../lib/hooks";

const MODE_STORE = "rotationEditorMode";

type Mode = "manual" | "auto";

const RotationEditor = observer(function RotationEditor() {
  const [itemIds, setItemIds] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(CustomPointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(CustomKeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    useSensor(CustomTouchSensor, { activationConstraint: { distance: 10 } })
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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { over, active } = event;

    // Note that this will temporarily desync itemIds with
    // SimulatorState.actions until the drag end event is triggered.
    if (over && over.id !== active.id) {
      const oldIndex = itemIds.indexOf(active.id.toString());
      const newIndex = itemIds.indexOf(over.id.toString());

      if (oldIndex === -1) {
        setItemIds(arrayMove([...itemIds, active.id.toString()], itemIds.length, newIndex));
        return;
      }

      setItemIds(arrayMove(itemIds, oldIndex, newIndex));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { over, active } = event;

    if (over && over.id !== active.id) {
      const oldIndex = itemIds.indexOf(active.id.toString());
      const newIndex = itemIds.indexOf(over.id.toString());
      save(arrayMove(itemIds, oldIndex, newIndex));
    } else {
      save(itemIds);
    }
  };

  const [rotationEditorMode, setRotationEditorMode] = useState<Mode>(
    Storage.retrieve<Mode>(MODE_STORE) || "auto"
  );

  const onModeChange = (mode: Mode) => {
    Storage.store(MODE_STORE, JSON.stringify(mode));
    setRotationEditorMode(mode);
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        autoScroll={{ layoutShiftCompensation: false }}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={rectSortingStrategy}>
          <div className="rotation">
            <MutableList items={itemIds} activeItemId={activeId} onRemove={removeItem} />

            <RotationControls />
          </div>

          <ModeSelector
            defaultMode={rotationEditorMode}
            modeOptions={[
              {
                mode: "auto",
                label: autoModeLabel,
                component: () => <SearchPanel />,
              },
              {
                mode: "manual",
                label: manualModeLabel,
                component: () => <PersistentList onAdd={addItem} />,
              },
            ]}
            onChange={onModeChange}
          />
          <DragOverlay>
            {activeId ? <ActionIcon name={actionFromId(activeId)} /> : null}
          </DragOverlay>
        </SortableContext>
      </DndContext>
    </div>
  );
});

export default RotationEditor;
