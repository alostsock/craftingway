import clsx from "clsx";
import { useDraggable } from "@dnd-kit/core";
import type { Action } from "crafty";

import { ActionIcon } from "../Icons";

interface Props {
  id: string;
  name: Action;
  label: string;
  onClick: (action: Action) => void;
  disabled: boolean;
}

export default function DraggableIcon({ id, name, label, onClick, disabled }: Props) {
  const { setNodeRef, transform, attributes, listeners } = useDraggable({ id });
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <button
      key={name}
      ref={(node) => {
        setNodeRef(node);
        if (node) {
          node.scrollIntoView = () => {};
        }
      }}
      title={label}
      style={style}
      className={clsx({ disabled })}
      onClick={() => onClick(name)}
      {...attributes}
      {...listeners}
    >
      <ActionIcon name={label} />
    </button>
  );
}
