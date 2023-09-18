import "./StatDisplay.scss";

import { Player } from "crafty";
import React from "react";

import { calculateConsumableBonus, ConsumableVariant } from "../lib/consumables";
import { Job, JOB_EMOJIS } from "../lib/jobs";
import Emoji from "./Emoji";

interface Props {
  job: Job;
  player: Player;
  food: ConsumableVariant | null;
  potion: ConsumableVariant | null;
}

export default function StatDisplay({ job, player, food, potion }: Props) {
  const foodBonus = calculateConsumableBonus(player, food);
  const potionBonus = calculateConsumableBonus(player, potion);

  const Stat = ({ name }: { name: "craftsmanship" | "control" | "cp" }) => {
    const foodValue = foodBonus[name];
    const potionValue = potionBonus[name];

    return (
      <React.Fragment>
        {player[name] + foodValue + potionValue}
        {foodValue > 0 ? <span className="food">*</span> : null}
        {potionValue > 0 ? <span className="potion">*</span> : null}
      </React.Fragment>
    );
  };

  const Sep = () => <span className="separator">/</span>;

  return (
    <span className="StatDisplay">
      <Emoji emoji={JOB_EMOJIS[job]} /> <span className="level">Lv.{player.job_level}</span>{" "}
      <span className="nowrap">
        <Stat name="craftsmanship" />
        <Sep />
        <Stat name="control" />
        <Sep />
        <Stat name="cp" />
      </span>
    </span>
  );
}
