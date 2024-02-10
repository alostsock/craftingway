import "./JobDisplay.scss";

import clsx from "clsx";

import { Job, JOB_EMOJIS } from "../lib/jobs";
import Emoji from "./Emoji";

interface Props {
  job: Job;
  isSpecialist?: boolean;
}

export default function JobDisplay({ job, isSpecialist = false }: Props) {
  return (
    <span className={clsx("JobDisplay", "nowrap", isSpecialist && "specialist")}>
      <Emoji emoji={JOB_EMOJIS[job]} />
      {job}
    </span>
  );
}
