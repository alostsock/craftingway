import clsx from "clsx";
import { useSelect, UseSelectStateChange } from "downshift";
import { observer } from "mobx-react-lite";
import React from "react";

interface Props<Item> {
  className?: string;
  label: string;
  placeholder: string;
  items: Item[];
  itemToString: (item: Item | null) => string;
  onChange: (item: Item | undefined) => void;
  children: (item: Item) => React.ReactNode;
}

const Select = observer(function Select<Item>({
  className,
  label,
  placeholder,
  items,
  itemToString,
  onChange,
  children,
}: Props<Item>) {
  const select = useSelect({
    items,
    itemToString,
    onSelectedItemChange: ({ selectedItem }) => onChange(selectedItem ?? undefined),
  });

  return (
    <div className={clsx("Select field", className)}>
      <label {...select.getLabelProps()}>{label}</label>
      <div className="select">
        <button
          className={clsx({ placeholder: !select.selectedItem })}
          {...select.getToggleButtonProps()}
        >
          {select.selectedItem ? itemToString(select.selectedItem) : placeholder}
        </button>

        <ul {...select.getMenuProps()}>
          {select.isOpen &&
            items.map((item, index) => (
              <li key={index} {...select.getItemProps({ item, index })}>
                {children(item)}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
});

export default Select;
