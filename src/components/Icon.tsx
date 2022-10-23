import c from "clsx";

import { actionIcons, statusIcons } from "../lib/assets";

type Props = {
  name: string;
  type: "action" | "status";
  job?: string;
  stacks?: number;
};

const Icon = ({ name, type, job, stacks }: Props) => {
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
    <picture className={c("Icon", type, stacks && "stacked")}>
      <source srcSet={encodeURI(`${url}.webp`)} type="image/webp" />
      <img src={encodeURI(`${url}.png`)} alt={name} />
    </picture>
  );
};

export default Icon;
