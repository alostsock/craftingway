import { i18n, Messages } from "@lingui/core";
import { makeAutoObservable } from "mobx";

import { messages as englishMessages } from "../locales/en";

export type Locale = "en" | "jp" | "fr" | "de";
type NonEnglishLocale = Exclude<Locale, "en">;

interface TranslatedContent {
  messages: Messages;
  items: Record<string, string>;
}

type TranslationState = TranslatedContent | "loading" | null;

const TRANSLATION_STATES: Record<NonEnglishLocale, TranslationState> = {
  jp: null,
  fr: null,
  de: null,
};

class _LocaleState {
  private _locale: Locale = "en";
  private queuedLocale: Locale | null = null;

  constructor() {
    makeAutoObservable(this);

    i18n.load("en", englishMessages);
    i18n.activate("en");
  }

  get locale() {
    return this._locale;
  }

  // A setter is needed since this is set asynchronously
  private set locale(locale: Locale) {
    this._locale = locale;
  }

  private async loadTranslations(locale: NonEnglishLocale): Promise<TranslatedContent | undefined> {
    const state = TRANSLATION_STATES[locale];

    if (state == null) {
      TRANSLATION_STATES[locale] = "loading";
      const [{ messages }, items] = await Promise.all([
        import(`../locales/${locale}.ts`),
        fetch(`/items_${locale}.json`).then((r) => r.json()),
      ]);
      const content = { messages, items };
      TRANSLATION_STATES[locale] = content;

      return content;
    } else if (state == "loading") {
      return;
    } else {
      return state;
    }
  }

  async setLocale(locale: Locale) {
    if (locale === "en") {
      this.locale = locale;
      i18n.activate(locale);
      return;
    }

    // When a locale is set, translation files are requested; if requests are
    // pending for a `queuedLocale` and the `locale` changes, we should ignore
    // the activation of the old locale.

    this.queuedLocale = locale;

    const translatedContent = await this.loadTranslations(locale);

    if (translatedContent && this.queuedLocale == locale) {
      i18n.load(locale, translatedContent.messages);
      i18n.activate(locale);
      this.locale = locale;
      this.queuedLocale = null;
    }
  }

  translateItemName(englishItemName: string) {
    if (this.locale === "en") {
      return englishItemName;
    }

    const content = TRANSLATION_STATES[this.locale];
    if (content && content !== "loading") {
      return content.items[englishItemName] ?? englishItemName;
    } else {
      return englishItemName;
    }
  }
}

export const LocaleState = new _LocaleState();
