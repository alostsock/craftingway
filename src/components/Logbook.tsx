import "./Logbook.scss";

import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import { LogbookState } from "../lib/logbook-state";
import RotationMiniDisplay from "./RotationMiniDisplay";

const Logbook = observer(function Logbook() {
  useEffect(() => runInAction(() => LogbookState.refresh()), []);

  return (
    <div className="Logbook">
      <section>
        <h1>Logbook</h1>
        <p>Recently viewed saved recipes will appear here.</p>
      </section>

      <section className="entries">
        {LogbookState.entries.map(({ hash, slug, data }) => (
          <RotationMiniDisplay key={hash} slug={slug} rotationData={data} />
        ))}
      </section>
    </div>
  );
});

export default Logbook;
