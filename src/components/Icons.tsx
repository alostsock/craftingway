import "./Icons.scss";

import clsx from "clsx";
import type { Action } from "crafty";
import { observer } from "mobx-react-lite";

import { ACTION_LOOKUP } from "../lib/actions";
import { actionIcons, statusIcons } from "../lib/assets";
import { PlayerState } from "../lib/player-state";
import { SimulatorState } from "../lib/simulator-state";

type ActionIconProps = {
  name: Action;
  step?: number;
  showCp?: boolean;
};

export const ActionIcon = observer(function ActionIcon({ name, step, showCp }: ActionIconProps) {
  const job = PlayerState.job;

  let { label, cp } = ACTION_LOOKUP[name];

  const nameWithJob = `${label}-${job}`;
  if (job && actionIcons.has(nameWithJob)) {
    label = nameWithJob;
  }

  if (showCp && SimulatorState.craftState?.next_combo_action === name) {
    // handle Standard/Advanced touch
    cp = 18;
  }

  const url = `/icon/action/${label}`;

  return (
    <div className="ActionIcon">
      <img src={encodeURI(`${url}.webp`)} title={label} alt={label} draggable={false} />

      {step && <div className="step">{step}</div>}
      {showCp && cp && <div className="cp">{cp}</div>}
    </div>
  );
});

type StatusIconProps = {
  name: string;
  stacks?: number;
  expiry?: number;
};

export const StatusIcon = observer(({ name, stacks, expiry }: StatusIconProps) => {
  const nameWithStacks = `${name}-${stacks}`;

  if (stacks && statusIcons.has(nameWithStacks)) {
    name = nameWithStacks;
  }

  const url = `/icon/status/${name}`;

  return (
    <div className={clsx("StatusIcon", stacks && "with-stacks", expiry && "with-expiry")}>
      <img src={encodeURI(`${url}.webp`)} title={name} alt={name} draggable={false} />

      {expiry && <span className="expiry">{expiry}</span>}
    </div>
  );
});
