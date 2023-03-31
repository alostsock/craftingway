import "./Emoji.scss";

import { memo } from "react";
import twemoji from "twemoji";

type Props = { emoji: string };

const Emoji = memo(({ emoji }: Props) => {
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
