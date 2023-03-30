import clsx from "clsx";
import { observer } from "mobx-react-lite";
import type { Action } from "crafty";

import Icon from "../Icon";
import { ACTIONS_BY_GROUP } from "../../lib/actions";
import { SimulatorState } from "../../lib/simulator-state";
import { PlayerState } from "../../lib/player-state";

type PersistentListProps = {
  onAdd: (action: Action) => void;
};

const PersistentList = observer(function PersistentList({ onAdd }: PersistentListProps) {
  const activeActions = new Set(SimulatorState.craftState?.available_moves);

  return (
    <div className="PersistentList">
      {Object.entries(ACTIONS_BY_GROUP).map(([group, actions]) => (
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
