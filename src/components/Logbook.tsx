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
        {LogbookState.entries.map(({ key, data }) => (
          <pre key={key}>
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        ))}
      </section>
    </div>
  );
});

export default Logbook;
