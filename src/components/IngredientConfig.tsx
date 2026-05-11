import "./IngredientConfig.scss";

import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";

import { LocaleState } from "../lib/locale-state";
import { RecipeState } from "../lib/recipe-state";
import CopyButton from "./CopyButton";
import NumberInput from "./NumberInput";

// UI considerations, as of patch 6.3
// - there can be as many as 6 HQ'able ingredients, "Twinsilk Coat of Casting"
//   is an example
// - the HQ'able ingredients with the longest names are
//   "Gold Saucer Consolation Prize Component"
//   "Decorative Tavern Furnishing Materials"
//   "Signature Buuz Cookware Materials"

const IngredientConfig = observer(function IngredientConfig() {
  if (
    !RecipeState.recipe ||
    !RecipeState.recipe.can_hq ||
    RecipeState.recipe.ingredients.filter((i) => i.can_hq).length === 0
  ) {
    return null;
  }

  const handleChange = action((ingredientName: string, quantity: number) => {
    if (quantity > 0) {
      RecipeState.hq_ingredients = {
        ...RecipeState.hq_ingredients,
        [ingredientName]: quantity,
      };
    } else {
      const { [ingredientName]: _, ...ingredients } = RecipeState.hq_ingredients;
      RecipeState.hq_ingredients = ingredients;
    }
  });

  const setAllHq = () => {
    const ingredients: Record<string, number> = {};
    RecipeState.recipe?.ingredients?.forEach(ingredient => {
      if (ingredient.can_hq) {
        ingredients[ingredient.name] = ingredient.amount
      }
    })
    RecipeState.hq_ingredients = ingredients;
  }

  return (
    <div className="IngredientConfig">
      <div className="prompt">HQ ingredients: <button className="link" onClick={setAllHq}>Select all</button></div>

      <div className="ingredients">
        {RecipeState.recipe.ingredients
          .slice()
          .sort((a, b) => b.item_level - a.item_level)
          .filter((i) => i.can_hq)
          .map(({ name, amount }) => (
            <QuantityInput
              key={name}
              label={LocaleState.translateItemName(name)}
              quantity={RecipeState.hq_ingredients[name] ?? 0}
              total={amount}
              onChange={(quantity) => handleChange(name, quantity)}
            />
          ))}
      </div>
    </div>
  );
});

export default IngredientConfig;

interface QuantityInputProps {
  label: string;
  quantity: number;
  total: number;
  onChange: (quantity: number) => void;
}

function QuantityInput({ label, quantity, total, onChange }: QuantityInputProps) {
  const id = `number-input-${label}`;

  return (
    <React.Fragment>
      <label htmlFor={id}>
        <CopyButton className="text" copyText={label} tabIndex={-1}>
          {label}
        </CopyButton>
      </label>
      <NumberInput id={id} numberValue={quantity} min={0} max={total} onNumberChange={onChange} />
      <span>/</span>
      <span className="total">{total}</span>
    </React.Fragment>
  );
}
