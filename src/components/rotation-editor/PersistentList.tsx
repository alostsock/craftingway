import clsx from "clsx";
import { observer } from "mobx-react-lite";
import type { Action } from "crafty";

import Icon from "../Icon";
import { traitedActions } from "../../lib/actions";
import { SimulatorState } from "../../lib/simulator-state";
import { PlayerState } from "../../lib/player-state";
import { groupBy } from "../../lib/utils";

type PersistentListProps = {
  onAdd: (action: Action) => void;
};

const PersistentList = observer(function PersistentList({ onAdd }: PersistentListProps) {
  const activeActions = new Set(SimulatorState.craftState?.available_moves);

  const groupedActions = groupBy(traitedActions(PlayerState.stats.job_level), "group");

  return (
    <div className="PersistentList">
      {Object.entries(groupedActions).map(([group, actions]) => (
        <div key={group} className="group">
          <div className="name">{group}</div>

          <div className="actions">
            {actions.map(({ name, label }) => (
              <button
                key={name}
                title={label}
                onClick={() => onAdd(name)}
                className={clsx({ disabled: !activeActions.has(name) })}
              >
                <Icon name={label} job={PlayerState.job} type="action" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

export default PersistentList;
