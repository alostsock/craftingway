import { observer } from "mobx-react-lite";
import type { Action } from "crafty";

import DraggableIcon from "./DraggableIcon";
import { idFromAction } from "./converters";
import { traitedActions } from "../../lib/actions";
import { SimulatorState } from "../../lib/simulator-state";
import { PlayerState } from "../../lib/player-state";
import { groupBy } from "../../lib/utils";

type PersistentListProps = {
  onAdd: (action: Action) => void;
};

const PersistentList = observer(function PersistentList({ onAdd }: PersistentListProps) {
  const activeActions = new Set(SimulatorState.craftState?.available_moves);

  const groupedActions = groupBy(traitedActions(PlayerState.config.job_level), "group");

  return (
    <div className="PersistentList">
      {Object.entries(groupedActions).map(([group, actions]) => (
        <div key={group} className="group">
          <div className="name">{group}</div>

          <div className="actions">
            {actions.map(({ name, label }) => (
              <DraggableIcon
                key={name}
                id={idFromAction(name)}
                name={name}
                label={label}
                onClick={() => onAdd(name)}
                disabled={!activeActions.has(name)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

export default PersistentList;
