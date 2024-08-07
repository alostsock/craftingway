import "./RecipeDisplay.scss";

import { observer } from "mobx-react-lite";
import { useLocation } from "wouter";

import { Job } from "../lib/jobs";
import { LocaleState } from "../lib/locale-state";
import type { RecipeData } from "../lib/recipe-state";
import { stars } from "../lib/utils";
import CopyButton from "./CopyButton";
import JobDisplay from "./JobDisplay";

interface Props {
  recipe: RecipeData;
  job?: Job;
}

const RecipeDisplay = observer(function RecipeDisplay({ recipe, job }: Props) {
  const [_, setLocation] = useLocation();

  // used on the home page to scroll to a recipe when loading
  // it from a saved rotation
  const checkScroll = (el: HTMLDivElement | null) => {
    const params = new URLSearchParams(window.location.search);
    if (el && params.get("recipe") != null) {
      el.scrollIntoView();
      setLocation("/", { replace: true });
    }
  };

  return (
    <div ref={checkScroll} className="RecipeDisplay">
      <h1 id="recipe-display" className="name">
        <CopyButton className="text" copyText={LocaleState.translateItemName(recipe.name)}>
          {LocaleState.translateItemName(recipe.name)}
        </CopyButton>
      </h1>
      {job && <JobDisplay job={job} />}
      <div>
        Lv.{recipe.job_level} {stars(recipe.stars)}
      </div>
      <div className="rlvl">Recipe Lv.{recipe.recipe_level}</div>
      {recipe.equip_level > 0 && <div className="elvl">Equip Lv.{recipe.equip_level}</div>}
      {recipe.item_level > 0 && <div className="ilvl">Item Lv.{recipe.item_level}</div>}
    </div>
  );
});

export default RecipeDisplay;
