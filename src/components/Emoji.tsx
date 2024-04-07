import "./Emoji.scss";

import twemoji from "@twemoji/api";
import { memo } from "react";

type Props = { emoji: string };

const Emoji = memo(function Emoji({ emoji }: Props) {
  return (
    <span
      className="Emoji"
      aria-hidden="true"
      dangerouslySetInnerHTML={{
        __html: twemoji.parse(emoji, { folder: "svg", ext: ".svg" }),
      }}
    />
  );
});

export default Emoji;
