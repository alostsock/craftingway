import "./TranslationNotice.scss";

import { t } from "@lingui/macro";
import { observer } from "mobx-react-lite";
import { useLocation } from "wouter";

import { LocaleState } from "../lib/locale-state";
import Emoji from "./Emoji";

const TranslationNotice = observer(function TranslationNotice() {
  const [location, _] = useLocation();

  if (location != "/" || LocaleState.locale === "eng") {
    return null;
  }

  return (
    <div className="TranslationNotice">
      <Emoji emoji="🚧" /> {t`Translation work is in progress!`}
    </div>
  );
});

export default TranslationNotice;
