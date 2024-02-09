import "./HelpPopoverButton.scss";

import * as Popover from "@radix-ui/react-popover";

interface Props {
  children: React.ReactNode;
}

export default function HelpPopoverButton({ children }: Props) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="HelpPopoverButton ghost" title="Help">
          <div>?</div>
        </button>
      </Popover.Trigger>
      <Popover.Content asChild side="top" align="start">
        <div className="tooltip">{children}</div>
      </Popover.Content>
    </Popover.Root>
  );
}
