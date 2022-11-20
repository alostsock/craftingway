import { observer } from "mobx-react-lite";

import ActionPlaylist from "./ActionPlaylist";
import BuffList from "./BuffList";
import Progress from "./Progress";
import { RecipeState } from "../lib/recipe-state";
import { SimulatorState } from "../lib/simulator-state";

const CraftStateDisplay = observer(function CraftStateDisplay() {
  if (!RecipeState.recipe || !SimulatorState.craftState) return null;

  return (
    <section className="CraftStateDisplay">
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
