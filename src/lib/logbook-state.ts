import { autorun, makeAutoObservable } from "mobx";

import Storage from "./storage";

const LOGBOOK_ITEMS_STORE = "logbookItems";

class _LogbookState {
  entries = [];

  constructor() {
    makeAutoObservable(this);

    this.entries = Storage.retrieve(LOGBOOK_ITEMS_STORE) || [];

    autorun(() => Storage.store(LOGBOOK_ITEMS_STORE, JSON.stringify(this.entries)));
  }
}

export const LogbookState = new _LogbookState();
