import type { Player } from "crafty";

import { fuzzysearch } from "./fuzzysearch";
import { LocaleState } from "./locale-state";

type ConsumableStatValues = readonly [value: number, max: number, hq_value: number, hq_max: number];

export interface Consumable {
  item_level: number;
  name: string;
  craftsmanship: ConsumableStatValues | null;
  control: ConsumableStatValues | null;
  cp: ConsumableStatValues | null;
}

export interface ConsumableBonus {
  craftsmanship: number;
  control: number;
  cp: number;
}

type ConsumableVariantStatValues = [value: number, max: number];

export interface ConsumableVariant {
  name: string;
  craftsmanship: ConsumableVariantStatValues | null;
  control: ConsumableVariantStatValues | null;
  cp: ConsumableVariantStatValues | null;
  isHq: boolean;
}

function variantValues(
  values: ConsumableStatValues | null,
  isHq: boolean
): ConsumableVariantStatValues | null {
  if (!values) return null;
  return isHq ? [values[2], values[3]] : [values[0], values[1]];
}

function generateConsumableVariants(
  consumables: Consumable[],
  shouldSort: boolean
): ConsumableVariant[] {
  const consumableToVariants = (consumable: Consumable) =>
    [true, false].map((isHq) => ({
      name: isHq ? `${consumable.name} HQ` : consumable.name,
      craftsmanship: variantValues(consumable.craftsmanship, isHq),
      control: variantValues(consumable.control, isHq),
      cp: variantValues(consumable.cp, isHq),
      isHq,
    }));

  return shouldSort
    ? consumables.sort((a, b) => b.item_level - a.item_level).flatMap(consumableToVariants)
    : consumables.flatMap(consumableToVariants);
}

export function calculateConsumableBonus(
  player: Player,
  variant: ConsumableVariant | null
): ConsumableBonus {
  if (!variant) return { craftsmanship: 0, control: 0, cp: 0 };

  const bonus = (stat: number, values: ConsumableVariantStatValues | null) => {
    if (!values) return 0;
    return Math.min(Math.floor((stat * values[0]) / 100), values[1]);
  };

  return {
    craftsmanship: bonus(player.craftsmanship, variant.craftsmanship),
    control: bonus(player.control, variant.control),
    cp: bonus(player.cp, variant.cp),
  };
}

const MEALS: Consumable[] = [
  {
    item_level: 4,
    name: "Frumenty",
    craftsmanship: null,
    control: null,
    cp: [10, 10, 13, 12],
  },
  {
    item_level: 9,
    name: "Salt Cod",
    craftsmanship: null,
    control: [8, 4, 10, 5],
    cp: null,
  },
  {
    item_level: 10,
    name: "Mint Lassi",
    craftsmanship: [12, 8, 15, 10],
    control: null,
    cp: null,
  },
  {
    item_level: 17,
    name: "Raw Oyster",
    craftsmanship: null,
    control: [8, 8, 10, 10],
    cp: null,
  },
  {
    item_level: 17,
    name: "Stone Soup",
    craftsmanship: null,
    control: null,
    cp: [10, 17, 13, 21],
  },
  {
    item_level: 18,
    name: "Mashed Popotoes",
    craftsmanship: [12, 12, 15, 15],
    control: null,
    cp: null,
  },
  {
    item_level: 26,
    name: "Pea Soup",
    craftsmanship: null,
    control: null,
    cp: [10, 21, 13, 26],
  },
  {
    item_level: 27,
    name: "Boiled Bream",
    craftsmanship: null,
    control: [8, 12, 10, 15],
    cp: null,
  },
  {
    item_level: 27,
    name: "Cheese Risotto",
    craftsmanship: [12, 16, 15, 20],
    control: null,
    cp: null,
  },
  {
    item_level: 29,
    name: "Baked Sole",
    craftsmanship: null,
    control: [8, 14, 10, 17],
    cp: null,
  },
  {
    item_level: 32,
    name: "Tuna Miq'abob",
    craftsmanship: null,
    control: [8, 16, 10, 20],
    cp: null,
  },
  {
    item_level: 34,
    name: "Cawl Cennin",
    craftsmanship: null,
    control: null,
    cp: [10, 24, 13, 30],
  },
  {
    item_level: 36,
    name: "Cheese Souffle",
    craftsmanship: [12, 20, 15, 25],
    control: null,
    cp: null,
  },
  {
    item_level: 42,
    name: "Salt Cod Puffs",
    craftsmanship: null,
    control: [8, 18, 10, 23],
    cp: null,
  },
  {
    item_level: 43,
    name: "Fish Soup",
    craftsmanship: null,
    control: null,
    cp: [10, 26, 13, 33],
  },
  {
    item_level: 46,
    name: "Rolanberry Lassi",
    craftsmanship: [12, 24, 15, 30],
    control: null,
    cp: null,
  },
  {
    item_level: 50,
    name: "Dagger Soup",
    craftsmanship: null,
    control: [8, 22, 10, 27],
    cp: null,
  },
  {
    item_level: 55,
    name: "Pan-fried Mahi-mahi",
    craftsmanship: null,
    control: [8, 25, 10, 31],
    cp: null,
  },
  {
    item_level: 55,
    name: "Bouillabaisse",
    craftsmanship: null,
    control: null,
    cp: [10, 34, 13, 43],
  },
  {
    item_level: 55,
    name: "Rolanberry Cheesecake",
    craftsmanship: [12, 32, 15, 40],
    control: null,
    cp: null,
  },
  {
    item_level: 70,
    name: "Chilled Popoto Soup",
    craftsmanship: [10, 38, 12, 47],
    control: null,
    cp: [4, 14, 5, 17],
  },
  {
    item_level: 90,
    name: "Shark Fin Soup",
    craftsmanship: [10, 49, 12, 61],
    control: null,
    cp: [4, 14, 5, 18],
  },
  {
    item_level: 110,
    name: "Better Crowned Pie",
    craftsmanship: null,
    control: [8, 38, 10, 48],
    cp: null,
  },
  {
    item_level: 125,
    name: "Baked Onion Soup",
    craftsmanship: [4, 22, 5, 28],
    control: null,
    cp: [10, 38, 13, 48],
  },
  {
    item_level: 133,
    name: "Beet Soup",
    craftsmanship: [4, 23, 5, 29],
    control: [10, 54, 12, 68],
    cp: null,
  },
  {
    item_level: 139,
    name: "Emerald Soup",
    craftsmanship: [10, 60, 12, 75],
    control: null,
    cp: [4, 15, 5, 19],
  },
  {
    item_level: 150,
    name: "Clam Chowder",
    craftsmanship: null,
    control: [10, 58, 12, 73],
    cp: [4, 15, 5, 19],
  },
  {
    item_level: 160,
    name: "Seafood Stew",
    craftsmanship: null,
    control: [4, 25, 5, 31],
    cp: [12, 40, 15, 50],
  },
  {
    item_level: 180,
    name: "Oyster Confit",
    craftsmanship: [4, 30, 5, 37],
    control: [10, 70, 12, 88],
    cp: null,
  },
  {
    item_level: 220,
    name: "Heavensegg Soup",
    craftsmanship: [5, 42, 6, 53],
    control: [7, 62, 9, 77],
    cp: [3, 8, 4, 10],
  },
  {
    item_level: 273,
    name: "Miso Soup with Tofu",
    craftsmanship: [10, 104, 12, 130],
    control: [4, 39, 5, 49],
    cp: null,
  },
  {
    item_level: 279,
    name: "Tempura Platter",
    craftsmanship: [4, 42, 5, 53],
    control: null,
    cp: [12, 43, 15, 54],
  },
  {
    item_level: 279,
    name: "Warrior's Stew",
    craftsmanship: [4, 42, 5, 53],
    control: [10, 99, 12, 124],
    cp: null,
  },
  {
    item_level: 290,
    name: "Steamed Grouper",
    craftsmanship: [10, 109, 12, 136],
    control: null,
    cp: [4, 16, 5, 20],
  },
  {
    item_level: 320,
    name: "Matcha",
    craftsmanship: null,
    control: [4, 49, 5, 61],
    cp: [12, 45, 15, 56],
  },
  {
    item_level: 406,
    name: "Blood Tomato Salad",
    craftsmanship: [7, 122, 9, 153],
    control: null,
    cp: [8, 22, 10, 27],
  },
  {
    item_level: 412,
    name: "Popotoes au Gratin",
    craftsmanship: [4, 53, 5, 66],
    control: [7, 118, 9, 147],
    cp: null,
  },
  {
    item_level: 418,
    name: "Blood Bouillabaisse",
    craftsmanship: null,
    control: [4, 51, 5, 64],
    cp: [21, 53, 26, 66],
  },
  {
    item_level: 460,
    name: "Mejillones al Ajillo",
    craftsmanship: [5, 84, 6, 105],
    control: null,
    cp: [21, 56, 26, 70],
  },
  {
    item_level: 490,
    name: "Chili Crab",
    craftsmanship: null,
    control: [5, 56, 6, 70],
    cp: [21, 57, 26, 72],
  },
  {
    item_level: 527,
    name: "Happiness Juice",
    craftsmanship: [7, 146, 9, 183],
    control: null,
    cp: [8, 26, 10, 32],
  },
  {
    item_level: 540,
    name: "Giant Haddock Dip",
    craftsmanship: [4, 62, 5, 77],
    control: [7, 132, 9, 165],
    cp: null,
  },
  {
    item_level: 554,
    name: "Tsai tou Vounou",
    craftsmanship: null,
    control: [4, 61, 5, 76],
    cp: [21, 62, 26, 78],
  },
  {
    item_level: 590,
    name: "Calamari Ripieni",
    craftsmanship: [4, 96, 5, 120],
    control: null,
    cp: [21, 66, 26, 82],
  },
  {
    item_level: 620,
    name: "Jhinga Biryani",
    craftsmanship: null,
    control: [4, 72, 5, 90],
    cp: [21, 69, 26, 86],
  },
  {
    item_level: 657,
    name: "Gateau au Chocolat",
    craftsmanship: [7, 192, 9, 240],
    control: null,
    cp: [8, 30, 10, 38],
  },
  {
    item_level: 670,
    name: "Salmon Jerky",
    craftsmanship: [4, 78, 5, 98],
    control: [7, 172, 9, 215],
    cp: null,
  },
  {
    item_level: 684,
    name: "Rroneek Steak",
    craftsmanship: null,
    control: [4, 77, 5, 97],
    cp: [21, 73, 26, 92],
  },
  {
    item_level: 720,
    name: "Ceviche",
    craftsmanship: [4, 120, 5, 150],
    control: null,
    cp: [21, 76, 26, 96],
  },
];

const POTIONS: Consumable[] = [
  {
    item_level: 665,
    name: "Competent Craftsman's Tisane",
    craftsmanship: [2, 50, 3, 63],
    control: null,
    cp: null,
  },
  {
    item_level: 670,
    name: "Commanding Craftsman's Tisane",
    craftsmanship: null,
    control: [2, 50, 3, 63],
    cp: null,
  },
  {
    item_level: 675,
    name: "Cunning Craftsman's Tisane",
    craftsmanship: null,
    control: null,
    cp: [5, 21, 6, 27],
  },
  {
    item_level: 527,
    name: "Competent Craftsman's Draught",
    craftsmanship: [2, 40, 3, 50],
    control: null,
    cp: null,
  },
  {
    item_level: 540,
    name: "Commanding Craftsman's Draught",
    craftsmanship: null,
    control: [2, 40, 3, 50],
    cp: null,
  },
  {
    item_level: 554,
    name: "Cunning Craftsman's Draught",
    craftsmanship: null,
    control: null,
    cp: [5, 17, 6, 21],
  },
  {
    item_level: 406,
    name: "Competent Craftsman's Syrup",
    craftsmanship: [2, 33, 3, 41],
    control: null,
    cp: null,
  },
  {
    item_level: 412,
    name: "Commanding Craftsman's Syrup",
    craftsmanship: null,
    control: [2, 34, 3, 42],
    cp: null,
  },
  {
    item_level: 412,
    name: "Cunning Craftsman's Syrup",
    craftsmanship: null,
    control: null,
    cp: [5, 13, 6, 16],
  },
  {
    item_level: 273,
    name: "Competent Craftsman's Tea",
    craftsmanship: [2, 20, 3, 25],
    control: null,
    cp: null,
  },
  {
    item_level: 276,
    name: "Commanding Craftsman's Tea",
    craftsmanship: null,
    control: [2, 20, 3, 25],
    cp: null,
  },
  {
    item_level: 282,
    name: "Cunning Craftsman's Tea",
    craftsmanship: null,
    control: null,
    cp: [4, 10, 5, 13],
  },
];

export const FOOD_VARIANTS: readonly ConsumableVariant[] = generateConsumableVariants(MEALS, true);
export const POTION_VARIANTS: readonly ConsumableVariant[] = generateConsumableVariants(
  POTIONS,
  false
);

export function searchConsumables(
  consumables: readonly ConsumableVariant[],
  query: string
): ConsumableVariant[] {
  query = query.toLowerCase();

  if (!query) {
    return consumables.slice();
  }

  const matches = [];
  for (const consumable of consumables) {
    const name = LocaleState.translateItemName(consumable.name, true);
    const score = fuzzysearch(query, name.toLowerCase());
    if (!score) continue;
    matches.push({ consumable, score });
  }

  return matches.sort((a, b) => b.score - a.score).map((result) => result.consumable);
}
