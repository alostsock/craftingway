import { useSelect } from "downshift";
import { observer } from "mobx-react-lite";

import { Locale, LocaleState } from "../lib/locale-state";
import Emoji from "./Emoji";

export const LocaleSelect = observer(function LocaleSelect() {
  type Item = { locale: Locale; label: string };
  const items: Item[] = [
    { locale: "en", label: "English" },
    { locale: "jp", label: "日本語" },
    { locale: "fr", label: "Français" },
    { locale: "de", label: "Deutsch" },
  ];

  const select = useSelect({
    items,
    itemToString: (item) => item?.label ?? "",
    defaultSelectedItem: items.find(({ locale }) => locale === LocaleState.locale) ?? items[0],
    onSelectedItemChange({ selectedItem }) {
      selectedItem && LocaleState.setLocale(selectedItem.locale);
    },
  });

  return (
    <div className="LocaleSelect dropdown-list">
      <button className="ghost" {...select.getToggleButtonProps()}>
        <Emoji emoji="🌐" /> {select.selectedItem?.locale.toUpperCase() ?? ""}
      </button>
      <ul {...select.getMenuProps()}>
        {select.isOpen &&
          items.map((item, index) => (
            <li key={item.locale} {...select.getItemProps({ item, index })}>
              {item.label}
            </li>
          ))}
      </ul>
    </div>
  );
});
