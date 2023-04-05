import { observer } from "mobx-react-lite";
import { useDroppable } from "@dnd-kit/core";

import SortableIcon from "./SortableIcon";

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

export default MutableList;
