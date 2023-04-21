import "./IngredientConfig.scss";

import { observer } from "mobx-react-lite";

import { RecipeState } from "../lib/recipe-state";
import React, { useEffect, useState } from "react";
import NumberInput from "./NumberInput";
import { runInAction } from "mobx";

// UI considerations, as of patch 6.3
// - there can be as many as 6 HQ'able ingredients, "Twinsilk Coat of Casting"
//   is an example
// - the HQ'able ingredients with the longest names are
//   "Gold Saucer Consolation Prize Component"
//   "Decorative Tavern Furnishing Materials"
//   "Signature Buuz Cookware Materials"

const IngredientConfig = observer(function IngredientConfig() {
  // a mapping of item name to the number of item levels it contributes,
  // based on the amount selected
  const [qualityMapping, setQualityMapping] = useState<Record<string, number>>({});

  if (
    !RecipeState.recipe ||
    !RecipeState.recipe.can_hq ||
    RecipeState.recipe.ingredients.filter((i) => i.can_hq).length === 0
  ) {
    return null;
  }

  const totalMaterialQuality =
    RecipeState.recipe.quality * (RecipeState.recipe.material_quality / 100);

  const totalItemLevel = RecipeState.recipe.ingredients
    .filter((i) => i.can_hq)
    .reduce((sum, { amount, item_level }) => sum + amount * item_level, 0);

  const handleChange = (name: string, itemLevels: number) => {
    const quality = totalMaterialQuality * (itemLevels / totalItemLevel);
    // don't floor the quality here; do it at the end when summing everything up
    setQualityMapping((mapping) => ({ ...mapping, [name]: quality }));
  };

  useEffect(() => {
    const materialQuality = Object.values(qualityMapping).reduce((prev, curr) => prev + curr, 0);
    runInAction(() => (RecipeState.startingQuality = Math.floor(materialQuality)));
  }, [qualityMapping]);

  return (
    <div className="IngredientConfig">
      <div className="prompt">Quality materials:</div>

      <div className="ingredients">
        {RecipeState.recipe.ingredients
          .slice()
          .sort((a, b) => b.item_level - a.item_level)
          .filter((i) => i.can_hq)
          .map(({ name, amount, item_level }) => (
            <QuantityInput
              key={name}
              label={name}
              total={amount}
              onChange={(quantity) => handleChange(name, item_level * quantity)}
            />
          ))}
      </div>
    </div>
  );
});

export default IngredientConfig;

interface QuantityInputProps {
  label: string;
  total: number;
  onChange: (quantity: number) => void;
}

function QuantityInput({ label, total, onChange }: QuantityInputProps) {
  const [quantity, setQuantity] = useState(0);

  const handleChange = (n: number) => {
    setQuantity(n);
    onChange(n);
  };

  const id = `number-input-${label}`;

  return (
    <React.Fragment>
      <label htmlFor={id}>{label}</label>
      <NumberInput
        id={id}
        numberValue={quantity}
        min={0}
        max={total}
        onNumberChange={handleChange}
      />
      <span>/</span>
      <span className="total">{total}</span>
    </React.Fragment>
  );
}
