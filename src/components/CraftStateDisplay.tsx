import "./CraftStateDisplay.scss";

import { observer } from "mobx-react-lite";

import CraftStepDisplay from "./CraftStepDisplay";
import RotationEditor from "./rotation-editor/RotationEditor";
import BuffList from "./BuffList";
import Progress from "./Progress";
import { RecipeState } from "../lib/recipe-state";
import { SimulatorState } from "../lib/simulator-state";

const CraftStateDisplay = observer(function CraftStateDisplay() {
  if (!RecipeState.recipe || !SimulatorState.craftState) return null;

  return (
    <section className="CraftStateDisplay">
      <CraftStepDisplay
        step={SimulatorState.craftState.step}
        completionReason={SimulatorState.completionReason}
      />

      <div className="bars">
        <Progress
          label="Progress"
          value={SimulatorState.craftState.progress}
          target={SimulatorState.craftState.progress_target}
        />
        <Progress
          label="Quality"
          initialValue={RecipeState.startingQuality}
          value={Math.max(RecipeState.startingQuality, SimulatorState.craftState.quality)}
          target={RecipeState.recipe.can_hq ? SimulatorState.craftState.quality_target : 0}
        />
        <Progress
          label="Durability"
          value={SimulatorState.craftState.durability}
          target={SimulatorState.craftState.durability_max}
        />
        <Progress
          label="CP"
          value={SimulatorState.craftState.cp}
          target={SimulatorState.craftState.cp_max}
        />
      </div>

      <BuffList />

      <RotationEditor />
    </section>
  );
});

export default CraftStateDisplay;
