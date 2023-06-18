import { useDraggable } from "@dnd-kit/core";
import * as Tooltip from "@radix-ui/react-tooltip";
import clsx from "clsx";
import type { Action } from "crafty";

import { ACTION_LOOKUP } from "../../lib/actions";
import { ActionIcon } from "../Icons";
import { TOOLTIP_TEXT } from "../TooltipText";

interface Props {
  id: string;
  name: Action;
  onClick: (action: Action) => void;
  disabled: boolean;
}

export default function DraggableIcon({ id, name, onClick, disabled }: Props) {
  const { setNodeRef, transform, attributes, listeners } = useDraggable({ id });
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button
          key={name}
          ref={(node) => {
            setNodeRef(node);
            if (node) {
              node.scrollIntoView = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
            }
          }}
          style={style}
          className={clsx({ disabled })}
          onClick={() => onClick(name)}
          {...attributes}
          {...listeners}
        >
          <ActionIcon name={name} showCp />
        </button>
      </Tooltip.Trigger>

      <Tooltip.Content asChild side="top" align="start">
        <div className="tooltip">
          <span className="action-label">{ACTION_LOOKUP[name].label}</span>
          {TOOLTIP_TEXT[name]}
        </div>
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
