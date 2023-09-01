import "./Logbook.scss";

import { observer } from "mobx-react-lite";

const Logbook = observer(function Logbook() {
  return (
    <div className="Logbook">
      <section>
        <h1>Logbook</h1>
        <p>Recently viewed and completed recipes will appear here.</p>
      </section>
    </div>
  );
});

export default Logbook;
