import type { Action } from "crafty";
import React from "react";

const Progress = ({ children }: { children: React.ReactNode }) => (
  <span>
    Efficiency: <span className="progress">{children}</span>
  </span>
);

const Quality = ({ children }: { children: React.ReactNode }) => (
  <span>
    Efficiency: <span className="quality">{children}</span>
  </span>
);

// https://na.finalfantasyxiv.com/crafting_gathering_guide/carpenter/

export const TOOLTIP_TEXT: Record<Action, React.ReactNode> = {
  BasicSynthesis: (
    <React.Fragment>
      <span>Increases progress.</span>
      <Progress>100%</Progress>
    </React.Fragment>
  ),
  BasicSynthesisTraited: (
    <React.Fragment>
      <span>Increases progress.</span>
      <Progress>120%</Progress>
    </React.Fragment>
  ),
  BasicTouch: (
    <React.Fragment>
      <span>Increases quality.</span>
      <Quality>100%</Quality>
    </React.Fragment>
  ),
  MastersMend: (
    <React.Fragment>
      <span>Restores item durability by 30.</span>
    </React.Fragment>
  ),
  Observe: (
    <React.Fragment>
      <span>Do nothing for one step.</span>
    </React.Fragment>
  ),
  WasteNot: (
    <React.Fragment>
      <span>Reduces loss of durability by 50% for the next four steps.</span>
    </React.Fragment>
  ),
  Veneration: (
    <React.Fragment>
      <span>Increases efficiency of Synthesis actions by 50% for the next four steps.</span>
    </React.Fragment>
  ),
  StandardTouch: (
    <React.Fragment>
      <span>Increases quality.</span>
      <Quality>125%</Quality>
      <span>Combo Action: Basic Touch</span>
      <span>Combo Bonus: CP cost reduced to 18</span>
    </React.Fragment>
  ),
  GreatStrides: (
    <React.Fragment>
      <span>
        Increases the efficiency of next Touch action by 100%. Effect active for three steps.
      </span>
    </React.Fragment>
  ),
  Innovation: (
    <React.Fragment>
      <span>Increases efficiency of Touch actions by 50% for the next four steps.</span>
    </React.Fragment>
  ),
  WasteNotII: (
    <React.Fragment>
      <span>Reduces loss of durability by 50% for the next eight steps.</span>
    </React.Fragment>
  ),
  ByregotsBlessing: (
    <React.Fragment>
      <span>Increases quality. Inner Quiet effect ends upon use.</span>
      <Quality>100% plus 20% for each Inner Quiet stack, up to a maximum of 300%</Quality>
      <span>Requires at least one stack of Inner Quiet.</span>
    </React.Fragment>
  ),
  MuscleMemory: (
    <React.Fragment>
      <span>Increases progress.</span>
      <Progress>300%</Progress>
      <span>Additional Effect: Efficiency of your next Synthesis action is increased by 100%</span>
      <span>Available only on the first step.</span>
      <span>Additional effect is active for five steps.</span>
    </React.Fragment>
  ),
  CarefulSynthesis: (
    <React.Fragment>
      <span>Increases progress.</span>
      <Progress>150%</Progress>
    </React.Fragment>
  ),
  CarefulSynthesisTraited: (
    <React.Fragment>
      <span>Increases progress.</span>
      <Progress>180%</Progress>
    </React.Fragment>
  ),
  Manipulation: (
    <React.Fragment>
      <span>Restores 5 points of durability after each step for the next eight steps.</span>
    </React.Fragment>
  ),
  PrudentTouch: (
    <React.Fragment>
      <span>Increases quality at the cost of 5 durability.</span>
      <Quality>100%</Quality>
      <span>Unavailable when Waste Not or Waste Not II is active.</span>
    </React.Fragment>
  ),
  FocusedSynthesis: (
    <React.Fragment>
      <span>Increases progress.</span>
      <Progress>200%</Progress>
      <span>Combo Action: Observe</span>
    </React.Fragment>
  ),
  FocusedTouch: (
    <React.Fragment>
      <span>Increases quality.</span>
      <Quality>150%</Quality>
      <span>Combo Action: Observe</span>
    </React.Fragment>
  ),
  Reflect: (
    <React.Fragment>
      <span>Increases quality.</span>
      <Quality>100%</Quality>
      <span>Additional Effect: Grants an extra Inner Quiet stack</span>
      <span>Available only on the first step.</span>
    </React.Fragment>
  ),
  PreparatoryTouch: (
    <React.Fragment>
      <span>Increases quality at the cost of 20 durability.</span>
      <span>Additional Effect: Grants an extra Inner Quiet stack</span>
      <Quality>200%</Quality>
    </React.Fragment>
  ),
  Groundwork: (
    <React.Fragment>
      <span>Increases progress at the cost of 20 durability.</span>
      <span>
        When durability is below 20, efficiency is halved (use Careful Synthesis instead).
      </span>
      <Progress>300%</Progress>
    </React.Fragment>
  ),
  GroundworkTraited: (
    <React.Fragment>
      <span>Increases progress at the cost of 20 durability.</span>
      <span>
        When durability is below 20, efficiency is halved (use Careful Synthesis instead).
      </span>
      <Progress>360%</Progress>
    </React.Fragment>
  ),
  DelicateSynthesis: (
    <React.Fragment>
      <span>Increases both progress and quality.</span>
      <span>
        Efficiency: <span className="progress-quality">100%</span>
      </span>
    </React.Fragment>
  ),
  TrainedEye: (
    <React.Fragment>
      <span>Increases quality to maximum.</span>
      <span> Available only on the first step.</span>
      <span>Recipe level must be at least 10 levels below job level.</span>
    </React.Fragment>
  ),
  AdvancedTouch: (
    <React.Fragment>
      <span>Increases quality.</span>
      <Quality>150%</Quality>
      <span>Combo Action: Standard Touch</span>
      <span>Combo Bonus: CP cost reduced to 18</span>
    </React.Fragment>
  ),
  PrudentSynthesis: (
    <React.Fragment>
      <span>Increases progress at the cost of 5 durability.</span>
      <Progress>180%</Progress>
      <span>Unavailable when Waste Not or Waste Not II is active.</span>
    </React.Fragment>
  ),
  TrainedFinesse: (
    <React.Fragment>
      <span>Increases quality at no cost to durability.</span>
      <Quality>100%</Quality>
      <span>Available only when Inner Quiet stack size is 10.</span>
    </React.Fragment>
  ),
};
