import React from "react";
import clsx from "clsx";
import { observer } from "mobx-react-lite";

interface Props extends React.ComponentPropsWithoutRef<"button"> {
  copyText: string;
}

const CopyButton = observer(function CopyButton({
  copyText,
  className,
  children,
  ...props
}: Props) {
  const handleCopy = () => {
    navigator.clipboard.writeText(copyText);
  };

  return (
    <button className={clsx("CopyButton", className)} onClick={handleCopy} {...props}>
      {children}
    </button>
  );
});

export default CopyButton;
