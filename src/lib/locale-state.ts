import { i18n, Messages } from "@lingui/core";
import { autorun, makeAutoObservable } from "mobx";

import { messages as englishMessages } from "../locales/eng";
import Storage from "./storage";

export type Locale = "eng" | "jpn" | "fra" | "deu";
type NonEnglishLocale = Exclude<Locale, "eng">;

interface TranslatedContent {
  messages: Messages;
  items: Record<string, string>;
  actions: Record<string, string>;
}

type TranslationState = TranslatedContent | "loading" | null;

const TRANSLATION_STATES: Record<NonEnglishLocale, TranslationState> = {
  jpn: null,
  fra: null,
  deu: null,
};

const LOCALE_STORE = "userLocale";

class _LocaleState {
  private _locale: Locale = "eng";
  private queuedLocale: Locale | null = null;

  constructor() {
    makeAutoObservable(this);

    i18n.load("eng", englishMessages);

    this.setLocale(Storage.retrieve(LOCALE_STORE) || determineUserLocale());

    autorun(() => Storage.store(LOCALE_STORE, JSON.stringify(this.locale)));
  }

  get locale() {
    return this._locale;
  }

  // A setter is needed since this is set asynchronously
  private set locale(locale: Locale) {
    i18n.activate(locale);
    this._locale = locale;
  }

  private async loadTranslations(locale: NonEnglishLocale): Promise<TranslatedContent | undefined> {
    const state = TRANSLATION_STATES[locale];

    if (state == null) {
      TRANSLATION_STATES[locale] = "loading";
      const [{ messages }, items, actions] = await Promise.all([
        import(`../locales/${locale}.ts`),
        fetch(`/translations/items_${locale}.json`).then((r) => r.json()),
        fetch(`/translations/actions_${locale}.json`).then((r) => r.json()),
      ]);
      const content = { messages, items, actions };
      TRANSLATION_STATES[locale] = content;

      return content;
    } else if (state == "loading") {
      return;
    } else {
      return state;
    }
  }

  async setLocale(locale: Locale) {
    if (locale === "eng") {
      this.locale = locale;
      return;
    }

    // When a locale is set, translation files are requested; if requests are
    // pending for a `queuedLocale` and the `locale` changes, we should ignore
    // the activation of the old locale.

    this.queuedLocale = locale;

    const translatedContent = await this.loadTranslations(locale);

    if (translatedContent && this.queuedLocale == locale) {
      i18n.load(locale, translatedContent.messages);
      this.locale = locale;
      this.queuedLocale = null;
    }
  }

  translateItemName(englishItemName: string, checkHq = false): string {
    if (this.locale === "eng") {
      return englishItemName;
    }

    const content = TRANSLATION_STATES[this.locale];
    if (!content || content === "loading") {
      return englishItemName;
    }

    if (checkHq && englishItemName.endsWith(" HQ")) {
      const nqItemName = englishItemName.substring(0, englishItemName.length - 3);
      return `${content.items[nqItemName] ?? englishItemName} HQ`;
    }

    return content.items[englishItemName] ?? englishItemName;
  }

  translateActionName(englishActionName: string): string {
    if (this.locale === "eng") {
      return englishActionName;
    }

    const content = TRANSLATION_STATES[this.locale];
    if (!content || content === "loading") {
      return englishActionName;
    }

    return content.actions[englishActionName] ?? englishActionName;
  }
}

export const LocaleState = new _LocaleState();

function determineUserLocale(): Locale {
  const shortCodeMatch = navigator.language.match(/^([\w]{2})-?.*$/);
  if (!shortCodeMatch) {
    return "eng";
  }
  const shortCode = shortCodeMatch[1];
  const localeLookup: Record<string, Locale> = {
    en: "eng",
    de: "deu",
    fr: "fra",
    ja: "jpn",
  };
  return localeLookup[shortCode] ?? "eng";
}
