import "./Icons.scss";

import clsx from "clsx";
import { observer } from "mobx-react-lite";

import { actionIcons, statusIcons } from "../lib/assets";
import { PlayerState } from "../lib/player-state";

const noImage = <span>NO IMAGE</span>;

type ActionIconProps = {
  name: string;
  step?: number;
};

export const ActionIcon = observer(function ActionIcon({ name, step }: ActionIconProps) {
  const job = PlayerState.job;

  const nameWithJob = `${name}-${job}`;

  if (job && actionIcons.has(nameWithJob)) {
    name = nameWithJob;
  }

  if (!actionIcons.has(name)) {
    return noImage;
  }

  const url = `icon/action/${name}`;

  return (
    <div className="ActionIcon">
      <picture title={name}>
        <source srcSet={encodeURI(`${url}.webp`)} type="image/webp" />
        <img src={encodeURI(`${url}.png`)} alt={name} draggable={false} />
      </picture>

      {step && <div className="step">{step}</div>}
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

  if (!statusIcons.has(name)) {
    return noImage;
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
