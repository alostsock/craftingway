import "./CopyButton.scss";

import * as Tooltip from "@radix-ui/react-tooltip";
import clsx from "clsx";
import React, { useEffect, useState } from "react";

import Emoji from "./Emoji";

interface Props extends React.ComponentPropsWithoutRef<"button"> {
  copyText: string | (() => Promise<string | undefined>);
}

export default function CopyButton({ copyText, className, disabled, children, ...props }: Props) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (typeof copyText === "string") {
      navigator.clipboard.writeText(copyText);
      setIsCopied(true);
    } else {
      copyText().then((text) => {
        if (text) {
          navigator.clipboard.writeText(text);
          setIsCopied(true);
        }
      });
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => setIsCopied(false), 1000);
    return () => clearTimeout(timeout);
  }, [isCopied]);

  return (
    <Tooltip.Root open={disabled ? false : isCopied ? true : undefined}>
      <Tooltip.Trigger asChild>
        <button
          className={clsx("CopyButton", className)}
          disabled={disabled}
          onClick={handleCopy}
          {...props}
        >
          {children}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content asChild>
        <div className="CopyButton content">
          <Emoji emoji="📋" />
          <span>{isCopied ? "Copied!" : "Copy"}</span>
        </div>
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
