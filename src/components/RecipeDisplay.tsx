import "./RecipeDisplay.scss";

import CopyButton from "./CopyButton";
import { stars } from "../lib/utils";
import type { RecipeData } from "../lib/recipe-state";
import { JOB_EMOJIS, Job } from "../lib/jobs";
import Emoji from "./Emoji";

interface Props {
  recipe: RecipeData;
  job?: Job;
}

export default function RecipeDisplay({ recipe, job }: Props) {
  return (
    <div className="RecipeDisplay">
      <h1 className="name">
        <CopyButton className="text" copyText={recipe.name}>
          {recipe.name}
        </CopyButton>
      </h1>
      {job && (
        <div className="info">
          <Emoji emoji={JOB_EMOJIS[job]} /> {job}
        </div>
      )}
      <div className="info">
        Lv.{recipe.job_level} {stars(recipe.stars)}
      </div>
      <div className="info rlvl">Recipe Lv.{recipe.recipe_level}</div>
      {recipe.equip_level > 0 && <div className="info elvl">Equip Lv.{recipe.equip_level}</div>}
      {recipe.item_level > 0 && <div className="info ilvl">Item Lv.{recipe.item_level}</div>}
    </div>
  );
}
