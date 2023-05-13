import "./CopyButton.scss";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Emoji from "./Emoji";
import * as Tooltip from "@radix-ui/react-tooltip";

interface Props extends React.ComponentPropsWithoutRef<"button"> {
  copyText: string;
}

export default function CopyButton({ copyText, className, children, ...props }: Props) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText);
    setIsCopied(true);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setIsCopied(false), 1000);
    return () => clearTimeout(timeout);
  }, [isCopied]);

  return (
    <Tooltip.Root open={isCopied ? true : undefined}>
      <Tooltip.Trigger asChild>
        <button className={clsx("CopyButton", className)} onClick={handleCopy} {...props}>
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