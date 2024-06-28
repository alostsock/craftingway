import { useDroppable } from "@dnd-kit/core";
import { observer } from "mobx-react-lite";

import { SimulatorState } from "../../lib/simulator-state";
import SortableIcon from "./SortableIcon";

type MutableListProps = {
  items: string[];
  activeItemId: string | null;
  onRemove: (id: string) => void;
};

const MutableList = observer(function MutableList({
  items,
  activeItemId,
  onRemove,
}: MutableListProps) {
  const id = "droppable-mutable-list";

  const { setNodeRef } = useDroppable({ id });

  return (
    <div id={id} ref={setNodeRef} className="MutableList">
      {items.map((id, index) => (
        <SortableIcon
          key={id}
          id={id}
          step={index + 1}
          onRemove={onRemove}
          active={id === activeItemId}
          disabled={index > SimulatorState.lastValidActionIndex}
        />
      ))}
    </div>
  );
});

export default MutableList;
