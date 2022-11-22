import { observer } from "mobx-react-lite";

import ActionPlaylist from "./ActionPlaylist";
import BuffList from "./BuffList";
import Progress from "./Progress";
import { RecipeState } from "../lib/recipe-state";
import { SimulatorState } from "../lib/simulator-state";

const CraftStateDisplay = observer(function CraftStateDisplay() {
  if (!RecipeState.recipe || !SimulatorState.craftState) return null;

  const Status = observer(() => {
    switch (SimulatorState.completionReason) {
      case null:
        return <h3>Crafting…</h3>;
      case "Finished":
        return <h3 className="success">Synthesis complete.</h3>;
      case "DurabilityFailure":
        return <h3 className="failure">No durability remains.</h3>;
      case "NoMovesFailure":
        return <h3 className="failure">No good moves are available.</h3>;
      case "MaxStepsFailure":
        return <h3 className="failure">The step limit has been reached.</h3>;
    }
  });

  return (
    <section className="CraftStateDisplay">
      <Status />

      <div className="bars">
        <Progress label="Progress" value="progress" target="progress_target" />
        <Progress label="Quality" value="quality" target="quality_target" />
        <Progress label="Durability" value="durability" target="durability_max" />
        <Progress label="CP" value="cp" target="cp_max" />
      </div>

      <BuffList />

      <ActionPlaylist />
    </section>
  );
});

export default CraftStateDisplay;
