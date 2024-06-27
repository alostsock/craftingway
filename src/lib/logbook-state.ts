import { autorun, makeAutoObservable } from "mobx";

import { RotationData } from "./rotation-data";
import Storage from "./storage";

type LogbookEntry = {
  slug: string;
  data: RotationData;
  hash: number;
};

const MAX_ENTRIES = 50;

const LOGBOOK_ENTRIES_STORE = "logbookEntries_v2";

class _LogbookState {
  entries: LogbookEntry[];

  constructor() {
    makeAutoObservable(this);

    this.entries = Storage.retrieve(LOGBOOK_ENTRIES_STORE) || [];

    autorun(() => Storage.store(LOGBOOK_ENTRIES_STORE, JSON.stringify(this.entries)));
  }

  refresh() {
    this.entries = Storage.retrieve(LOGBOOK_ENTRIES_STORE) || [];
  }

  // Adds a logbook entry to the front of the list, so that older items move to
  // the back of the list. If the entry already exists, it should be updated
  // to be at the front.
  addEntry(entry: LogbookEntry) {
    const existingIndex = this.entries.findIndex(({ hash }) => hash === entry.hash);

    if (existingIndex === 0) {
      return;
    }

    if (existingIndex > 0) {
      this.entries.splice(existingIndex, 1);
    }

    this.entries.unshift(entry);

    if (this.entries.length > MAX_ENTRIES) {
      this.entries.length = MAX_ENTRIES;
    }
  }
}

export const LogbookState = new _LogbookState();
