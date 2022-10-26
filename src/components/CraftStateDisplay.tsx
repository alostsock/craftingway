import { observer } from "mobx-react-lite";

import Progress from "./Progress";
import ActionPlaylist from "./ActionPlaylist";
import { RecipeState } from "../lib/recipe-state";
import { SimulatorState } from "../lib/simulator-state";

const CraftStateDisplay = observer(function CraftStateDisplay() {
  if (!RecipeState.recipe || !SimulatorState.craftState) return null;

  return (
    <section className="CraftStateDisplay">
      <h2>{RecipeState.recipe.name}</h2>

      <div className="bars">
        <Progress label="Progress" value="progress" target="progress_target" />
        <Progress label="Quality" value="quality" target="quality_target" />
        <Progress label="Durability" value="durability" target="durability_max" />
        <Progress label="CP" value="cp" target="cp_max" />
      </div>

      <ActionPlaylist />
    </section>
  );
});

export default CraftStateDisplay;
