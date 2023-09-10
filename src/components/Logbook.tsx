import "./Logbook.scss";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { LogbookState } from "../lib/logbook-state";

const Logbook = observer(function Logbook() {
  useEffect(() => {
    LogbookState.refresh();
  }, []);

  return (
    <div className="Logbook">
      <section>
        <h1>Logbook</h1>
        <p>Recently viewed and completed recipes will appear here.</p>
      </section>

      <section>
        {LogbookState.entries.map(({ hash, slug, data }) => (
          <div key={hash}>
            <p>{slug}</p>
            <p>{hash}</p>
          </div>
        ))}
      </section>
    </div>
  );
});

export default Logbook;
