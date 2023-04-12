import "./Icons.scss";

import clsx from "clsx";
import { observer } from "mobx-react-lite";
import type { Action } from "crafty";

import { actionIcons, statusIcons } from "../lib/assets";
import { ACTION_LOOKUP } from "../lib/actions";
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

  const url = `icon/action/${label}`;

  return (
    <div className="ActionIcon">
      <picture title={label}>
        <source srcSet={encodeURI(`${url}.webp`)} type="image/webp" />
        <img src={encodeURI(`${url}.png`)} alt={label} draggable={false} />
      </picture>

      {step && <div className="step">{step}</div>}
      {showCp && <div className="cp">{cp}</div>}
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

  const url = `icon/status/${name}`;

  return (
    <div className={clsx("StatusIcon", stacks && "with-stacks", expiry && "with-expiry")}>
      <picture title={name}>
        <source srcSet={encodeURI(`${url}.webp`)} type="image/webp" />
        <img src={encodeURI(`${url}.png`)} alt={name} draggable={false} />
      </picture>

      {expiry && <span className="expiry">{expiry}</span>}
    </div>
  );
});
