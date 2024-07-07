import "./BuffList.scss";

import * as Tooltip from "@radix-ui/react-tooltip";
import { observer } from "mobx-react-lite";

import { Buff, BUFF_LOOKUP } from "../lib/buffs";
import { SimulatorState } from "../lib/simulator-state";
import { StatusIcon } from "./Icons";

const BuffList = observer(function BuffList() {
  const craftState = SimulatorState.craftState;
  if (!craftState) return null;

  const buffs = {
    ...craftState.buffs,
    trained_perfection: craftState.trained_perfection_active === true ? 1 : 0,
  };

  const hasActiveBuffs = Object.values(buffs).some(Boolean);

  return (
    <div className="BuffList">
      {!hasActiveBuffs && <div className="no-buffs">No buffs active</div>}

      {Object.entries(buffs).map(([buffName, stacksOrExpiry]) => {
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
