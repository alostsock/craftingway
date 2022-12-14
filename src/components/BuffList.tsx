import { observer } from "mobx-react-lite";

import Icon from "./Icon";
import { SimulatorState } from "../lib/simulator-state";
import { BUFFS } from "../lib/buffs";

const BuffList = observer(function BuffList() {
  if (!SimulatorState.craftState) return null;

  const hasActiveBuffs = Object.values(SimulatorState.craftState.buffs).some(Boolean);

  return (
    <div className="BuffList">
      {!hasActiveBuffs && <div className="no-buffs">No buffs active</div>}

      {Object.entries(SimulatorState.craftState.buffs).map(([buffName, stacksOrExpiry]) => {
        if (!stacksOrExpiry) return null;

        const buffData = BUFFS.find((buffData) => buffData.name === buffName);

        if (!buffData) return null;

        const { name, label, stackable, expires } = buffData;

        return (
          <Icon
            key={name}
            name={label}
            type="status"
            stacks={stackable ? stacksOrExpiry : undefined}
            expiry={expires ? stacksOrExpiry : undefined}
          />
        );
      })}
    </div>
  );
});

export default BuffList;
