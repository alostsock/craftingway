import { observer } from "mobx-react-lite";

import Progress from "./Progress";
import ActionList from "./ActionList";
import { RecipeState } from "../lib/recipe-state";
import { SimulatorState } from "../lib/simulator-state";
import BuffList from "./BuffList";

const CraftState = observer(function CraftState() {
  if (!RecipeState.recipe || !SimulatorState.craftState) return null;

  return (
    <section className="CraftState">
      <div className="bars">
        <Progress label="Progress" value="progress" target="progress_target" />
        <Progress label="Quality" value="quality" target="quality_target" />
        <Progress label="Durability" value="durability" target="durability_max" />
        <Progress label="CP" value="cp" target="cp_max" />
      </div>

      <BuffList />

      <ActionList />
    </section>
  );
});

export default CraftState;
