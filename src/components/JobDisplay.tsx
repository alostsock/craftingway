import "./JobDisplay.scss";

import { Job, JOB_EMOJIS } from "../lib/jobs";
import Emoji from "./Emoji";

interface Props {
  job: Job;
}

export default function JobDisplay({ job }: Props) {
  return (
    <span className="JobDisplay nowrap">
      <Emoji emoji={JOB_EMOJIS[job]} />
      {job}
    </span>
  );
}
