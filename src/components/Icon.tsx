import c from "clsx";

import { actionIcons, statusIcons } from "../lib/assets";

type Props = {
  name: string;
  type: "action" | "status";
  job?: string;
  stacks?: number;
  expiry?: number;
};

// component is possibly a bit bloated (split it into ActionIcon/StatusIcon?)
const Icon = ({ name, type, job, stacks, expiry }: Props) => {
  const noImage = <span>NO IMAGE</span>;

  if (type === "action") {
    const nameWithJob = `${name}-${job}`;

    if (job && actionIcons.has(nameWithJob)) {
      name = nameWithJob;
    }

    if (!actionIcons.has(name)) {
      return noImage;
    }
  }

  if (type === "status") {
    const nameWithStacks = `${name}-${stacks}`;

    if (stacks && statusIcons.has(nameWithStacks)) {
      name = nameWithStacks;
    }

    if (!statusIcons.has(name)) {
      return noImage;
    }
  }

  const url = `icon/${type}/${name}`;

  return (
    <div className={c("Icon", type, stacks && "with-stacks", expiry && "with-expiry")}>
      <picture>
        <source srcSet={encodeURI(`${url}.webp`)} type="image/webp" />
        <img src={encodeURI(`${url}.png`)} alt={name} draggable={false} />
      </picture>
      {type === "status" && expiry && <span className="expiry">{expiry}</span>}
    </div>
  );
};

export default Icon;
