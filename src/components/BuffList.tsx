import "./BuffList.scss";

import { observer } from "mobx-react-lite";
import * as Tooltip from "@radix-ui/react-tooltip";

import { StatusIcon } from "./Icons";
import { SimulatorState } from "../lib/simulator-state";
import { Buff, BUFF_LOOKUP } from "../lib/buffs";

const BuffList = observer(function BuffList() {
  if (!SimulatorState.craftState) return null;

  const hasActiveBuffs = Object.values(SimulatorState.craftState.buffs).some(Boolean);

  return (
    <div className="BuffList">
      {!hasActiveBuffs && <div className="no-buffs">No buffs active</div>}

      {Object.entries(SimulatorState.craftState.buffs).map(([buffName, stacksOrExpiry]) => {
        if (!stacksOrExpiry) return null;

        const buffData = BUFF_LOOKUP[buffName as Buff];

        const { name, label, tooltip, stackable, expires } = buffData;

        return (
          <Tooltip.Root key={name}>
            <Tooltip.Trigger asChild>
              <span>
                <StatusIcon
                  name={label}
                  stacks={stackable ? stacksOrExpiry : undefined}
                  expiry={expires ? stacksOrExpiry : undefined}
                />
              </span>
            </Tooltip.Trigger>

            <Tooltip.Content asChild side="top" align="start">
              <div className="tooltip">
                <span className="buff-label">{label}</span>
                {tooltip}
              </div>
            </Tooltip.Content>
          </Tooltip.Root>
        );
      })}
    </div>
  );
});

export default BuffList;
