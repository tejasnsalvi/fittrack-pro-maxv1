/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Macros {
  fat: number;
  carbs: number;
  fiber: number;
}

/**
 * Calculates fats, carbs, and fiber for a food based on standard databases or heuristic estimation.
 */
export function getFoodMacros(foodId: string, name: string, calories: number, protein: number, qty: number = 1): Macros {
  const q = qty || 1;
  const foodKey = foodId ? foodId.toLowerCase() : '';

  // 1. Precise Match on Built-in Food IDs
  if (foodKey.includes('egg_whole')) {
    return { fat: Math.round(5 * q * 10) / 10, carbs: Math.round(0.6 * q * 10) / 10, fiber: 0 };
  }
  if (foodKey.includes('egg_white')) {
    return { fat: 0, carbs: Math.round(0.2 * q * 10) / 10, fiber: 0 };
  }
  if (foodKey.includes('paneer_100g') || foodKey.includes('paneer_raw') || foodKey.includes('paneer_bhurji') || foodKey.includes('paneer_butter')) {
    // Paneer has roughly equal protein/fats and very low carbs unless in loaded curries
    const isRichCurry = foodKey.includes('butter');
    const estimatedFat = isRichCurry ? 26 : 20;
    const estimatedCarbs = isRichCurry ? 12 : 3;
    return { fat: Math.round(estimatedFat * q * 10) / 10, carbs: Math.round(estimatedCarbs * q * 10) / 10, fiber: isRichCurry ? 1 : 0 };
  }
  if (foodKey.includes('soya_chunks_dry')) {
    // Dry raw soya per 100g: 52g Prot, 33g Carbs, 0.5g Fat, 13g Fiber
    return { fat: Math.round(0.5 * q * 10) / 10, carbs: Math.round(33 * q * 10) / 10, fiber: Math.round(13 * q * 10) / 10 };
  }
  if (foodKey.includes('soya_sabji')) {
    return { fat: Math.round(6 * q * 10) / 10, carbs: Math.round(12 * q * 10) / 10, fiber: Math.round(4 * q * 10) / 10 };
  }
  if (foodKey.includes('whey_scoop')) {
    return { fat: Math.round(1.5 * q * 10) / 10, carbs: Math.round(3 * q * 10) / 10, fiber: 0 };
  }
  if (foodKey.includes('tofu_raw')) {
    return { fat: Math.round(8 * q * 10) / 10, carbs: Math.round(3 * q * 10) / 10, fiber: Math.round(2 * q * 10) / 10 };
  }

  // Grains / Breads
  if (foodKey.includes('phulka_single')) {
    return { fat: Math.round(0.4 * q * 10) / 10, carbs: Math.round(13 * q * 10) / 10, fiber: Math.round(1.8 * q * 10) / 10 };
  }
  if (foodKey.includes('roti_plain')) {
    return { fat: Math.round(2.5 * q * 10) / 10, carbs: Math.round(15 * q * 10) / 10, fiber: Math.round(2 * q * 10) / 10 };
  }
  if (foodKey.includes('white_rice_cooked')) {
    return { fat: Math.round(0.4 * q * 10) / 10, carbs: Math.round(44 * q * 10) / 10, fiber: Math.round(1 * q * 10) / 10 };
  }
  if (foodKey.includes('brown_rice_cooked')) {
    return { fat: Math.round(1.6 * q * 10) / 10, carbs: Math.round(45 * q * 10) / 10, fiber: Math.round(3.5 * q * 10) / 10 };
  }
  if (foodKey.includes('aloo_paratha')) {
    return { fat: Math.round(11 * q * 10) / 10, carbs: Math.round(36 * q * 10) / 10, fiber: Math.round(4.2 * q * 10) / 10 };
  }
  if (foodKey.includes('bread_white')) {
    return { fat: Math.round(0.9 * q * 10) / 10, carbs: Math.round(14 * q * 10) / 10, fiber: Math.round(0.8 * q * 10) / 10 };
  }
  if (foodKey.includes('bread_wheat')) {
    return { fat: Math.round(1.1 * q * 10) / 10, carbs: Math.round(12 * q * 10) / 10, fiber: Math.round(2 * q * 10) / 10 };
  }
  if (foodKey.includes('oats_cooked')) {
    return { fat: Math.round(2.8 * q * 10) / 10, carbs: Math.round(25 * q * 10) / 10, fiber: Math.round(4 * q * 10) / 10 };
  }

  // Breakfast / Snacks
  if (foodKey.includes('poha_veg')) {
    return { fat: Math.round(4 * q * 10) / 10, carbs: Math.round(33 * q * 10) / 10, fiber: Math.round(2.5 * q * 10) / 10 };
  }
  if (foodKey.includes('poha_egg')) {
    return { fat: Math.round(9 * q * 10) / 10, carbs: Math.round(34 * q * 10) / 10, fiber: Math.round(2.5 * q * 10) / 10 };
  }
  if (foodKey.includes('upma_suji')) {
    return { fat: Math.round(4.5 * q * 10) / 10, carbs: Math.round(35 * q * 10) / 10, fiber: Math.round(2 * q * 10) / 10 };
  }
  if (foodKey.includes('idli_plain')) {
    return { fat: Math.round(0.2 * q * 10) / 10, carbs: Math.round(12 * q * 10) / 10, fiber: Math.round(0.8 * q * 10) / 10 };
  }
  if (foodKey.includes('medu_vada') || foodKey.includes('dal_vada')) {
    const isDal = foodKey.includes('dal');
    return { 
      fat: Math.round((isDal ? 5 : 7) * q * 10) / 10, 
      carbs: Math.round((isDal ? 7 : 8) * q * 10) / 10, 
      fiber: Math.round(1.5 * q * 10) / 10 
    };
  }
  if (foodKey.includes('masala_dosa')) {
    return { fat: Math.round(12 * q * 10) / 10, carbs: Math.round(54 * q * 10) / 10, fiber: Math.round(3 * q * 10) / 10 };
  }
  if (foodKey.includes('egg_bhurji')) {
    return { fat: Math.round(13 * q * 10) / 10, carbs: Math.round(3.8 * q * 10) / 10, fiber: 0.5 };
  }
  if (foodKey.includes('dhokla')) {
    return { fat: Math.round(2.8 * q * 10) / 10, carbs: Math.round(11 * q * 10) / 10, fiber: Math.round(1.2 * q * 10) / 10 };
  }
  if (foodKey.includes('samosa_one')) {
    return { fat: Math.round(15 * q * 10) / 10, carbs: Math.round(28 * q * 10) / 10, fiber: Math.round(2 * q * 10) / 10 };
  }

  // Dals / Curries
  if (foodKey.includes('moong_dal') || foodKey.includes('dal_tadka') || foodKey.includes('chilla')) {
    return { fat: Math.round(3 * q * 10) / 10, carbs: Math.round(20 * q * 10) / 10, fiber: Math.round(4.5 * q * 10) / 10 };
  }
  if (foodKey.includes('bhindi_sabji') || foodKey.includes('veg_sabji') || foodKey.includes('spring_onion')) {
    return { fat: Math.round(5 * q * 10) / 10, carbs: Math.round(10 * q * 10) / 10, fiber: Math.round(3 * q * 10) / 10 };
  }
  if (foodKey.includes('dal_makhani') || foodKey.includes('chole_masala') || foodKey.includes('rajma_masala')) {
    const isMakhani = foodKey.includes('makhani');
    return { 
      fat: Math.round((isMakhani ? 14 : 7) * q * 10) / 10, 
      carbs: Math.round((isMakhani ? 22 : 32) * q * 10) / 10, 
      fiber: Math.round(7 * q * 10) / 10 
    };
  }

  // Dairy
  if (foodKey.includes('chaas_salted')) {
    return { fat: Math.round(1.2 * q * 10) / 10, carbs: Math.round(4 * q * 10) / 10, fiber: 0 };
  }
  if (foodKey.includes('milk_whole')) {
    return { fat: Math.round(8 * q * 10) / 10, carbs: Math.round(11.5 * q * 10) / 10, fiber: 0 };
  }
  if (foodKey.includes('milk_skimmed')) {
    return { fat: Math.round(0.2 * q * 10) / 10, carbs: Math.round(12 * q * 10) / 10, fiber: 0 };
  }
  if (foodKey.includes('curd_plain')) {
    return { fat: Math.round(4 * q * 10) / 10, carbs: Math.round(5.5 * q * 10) / 10, fiber: 0 };
  }
  if (foodKey.includes('ghee')) {
    return { fat: Math.round(10 * q * 10) / 10, carbs: 0, fiber: 0 };
  }
  if (foodKey.includes('butter_spoon')) {
    return { fat: Math.round(8.1 * q * 10) / 10, carbs: Math.round(0.1 * q * 10) / 10, fiber: 0 };
  }

  // Fruits / Nuts
  if (foodKey.includes('banana')) {
    return { fat: Math.round(0.3 * q * 10) / 10, carbs: Math.round(27 * q * 10) / 10, fiber: Math.round(3 * q * 10) / 10 };
  }
  if (foodKey.includes('apple')) {
    return { fat: Math.round(0.2 * q * 10) / 10, carbs: Math.round(25 * q * 10) / 10, fiber: Math.round(4.4 * q * 10) / 10 };
  }
  if (foodKey.includes('almonds')) {
    return { fat: Math.round(6 * q * 10) / 10, carbs: Math.round(2.5 * q * 10) / 10, fiber: Math.round(1.5 * q * 10) / 10 };
  }
  if (foodKey.includes('walnuts')) {
    return { fat: Math.round(13.1 * q * 10) / 10, carbs: Math.round(2.7 * q * 10) / 10, fiber: Math.round(1.4 * q * 10) / 10 };
  }

  // 2. Category / Key-based generic fallbacks for anything else
  const lowerName = name.toLowerCase();
  
  // High-fat triggers
  if (lowerName.includes('ghee') || lowerName.includes('oil') || lowerName.includes('butter') || lowerName.includes('lard') || lowerName.includes('mayo')) {
    return { fat: Math.max(0, Math.round((calories / 9.3) * 10) / 10), carbs: 0, fiber: 0 };
  }

  // Pure protein-shake or supplement estimate
  if (lowerName.includes('whey') || lowerName.includes('isolate') || lowerName.includes('protein shake') || lowerName.includes('bcaa')) {
    const remainingKcal = Math.max(0, calories - (protein * 4));
    return { 
      fat: Math.max(0, Math.round((remainingKcal * 0.3 / 9) * 10) / 10), 
      carbs: Math.max(0, Math.round((remainingKcal * 0.7 / 4) * 10) / 10), 
      fiber: 0 
    };
  }

  // Default heuristic estimation using standard energy coefficients
  const proteinKcal = protein * 4;
  const remainingKcal = Math.max(0, calories - proteinKcal);

  let fatRatio = 0.30; // 30% of non-protein calories from fat
  let carbRatio = 0.70; // 70% from carbs
  let fiberEstimate = 0;

  if (lowerName.includes('chicken') || lowerName.includes('fish') || lowerName.includes('egg') || lowerName.includes('mutton') || lowerName.includes('meat') || lowerName.includes('kabab') || lowerName.includes('kebab')) {
    fatRatio = 0.65;
    carbRatio = 0.35;
  } else if (lowerName.includes('salad') || lowerName.includes('vegetable') || lowerName.includes('veggie') || lowerName.includes('spinach') || lowerName.includes('bhindi') || lowerName.includes('broccoli')) {
    fatRatio = 0.15;
    carbRatio = 0.85;
    fiberEstimate = Math.max(1, Math.round(calories * 0.03 * 10) / 10);
  } else if (lowerName.includes('rice') || lowerName.includes('bread') || lowerName.includes('oats') || lowerName.includes('roti') || lowerName.includes('chapati') || lowerName.includes('pasta') || lowerName.includes('sugar') || lowerName.includes('honey') || lowerName.includes('sweet') || lowerName.includes('desert')) {
    fatRatio = 0.08;
    carbRatio = 0.92;
    fiberEstimate = lowerName.includes('whole') || lowerName.includes('brown') || lowerName.includes('oat') ? Math.max(1.5, Math.round(calories * 0.015 * 10) / 10) : Math.max(0, Math.round(calories * 0.005 * 10) / 10);
  } else if (lowerName.includes('nut') || lowerName.includes('seed') || lowerName.includes('almond') || lowerName.includes('peanut') || lowerName.includes('cashew') || lowerName.includes('pista')) {
    fatRatio = 0.75;
    carbRatio = 0.25;
    fiberEstimate = Math.max(1, Math.round(calories * 0.012 * 10) / 10);
  }

  const estimatedFat = Math.max(0, Math.round((remainingKcal * fatRatio / 9) * 10) / 10);
  const estimatedCarbs = Math.max(0, Math.round((remainingKcal * carbRatio / 4) * 10) / 10);

  return {
    fat: estimatedFat,
    carbs: estimatedCarbs,
    fiber: Math.round(fiberEstimate * 10) / 10
  };
}
