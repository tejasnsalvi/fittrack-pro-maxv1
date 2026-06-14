/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FoodItem } from '../types';

export const BUILT_IN_FOODS: FoodItem[] = [
  // Proteins & Egg-Vegetarian Elements
  { id: 'b_egg_whole', name: 'Egg (Whole, Large)', category: 'Proteins', qtyType: 'Count', calories: 75, protein: 6.3 },
  { id: 'b_egg_white', name: 'Egg White (Single)', category: 'Proteins', qtyType: 'Count', calories: 17, protein: 4 },
  { id: 'b_paneer_100g', name: 'Paneer (100g Standard Portion)', category: 'Dairy', qtyType: 'Portion' as any, calories: 265, protein: 18 },
  { id: 'b_soya_chunks_dry', name: 'Soya Chunks (Dry Raw)', category: 'Proteins', qtyType: 'Gram', calories: 345, protein: 52 }, // per 100g
  { id: 'b_soya_sabji', name: 'Soya Chunks Sabji (Spiced Curry)', category: 'Main Meals', qtyType: 'Bowl', calories: 160, protein: 16 }, 
  { id: 'b_whey_scoop', name: 'Whey Protein', category: 'Proteins', qtyType: 'Scoop', calories: 120, protein: 24 },
  { id: 'b_paneer_raw', name: 'Paneer (Raw Cottage Cheese)', category: 'Dairy', qtyType: 'Gram', calories: 265, protein: 18 }, // per 100g
  { id: 'b_tofu_raw', name: 'Tofu (Bean Curd)', category: 'Proteins', qtyType: 'Gram', calories: 144, protein: 14 }, // per 100g

  // Grains & Traditional Indian Breads
  { id: 'b_phulka_single', name: 'Phulka (Soft Roti, No Oil/Ghee)', category: 'Grains', qtyType: 'Count', calories: 65, protein: 2.2 },
  { id: 'b_roti_plain', name: 'Chapati / Roti (With Ghee)', category: 'Grains', qtyType: 'Count', calories: 85, protein: 3 },
  { id: 'b_white_rice_cooked', name: 'basmati White Rice (Cooked)', category: 'Grains', qtyType: 'Bowl', calories: 200, protein: 4 },
  { id: 'b_brown_rice_cooked', name: 'Brown Rice (Cooked)', category: 'Grains', qtyType: 'Bowl', calories: 215, protein: 5 },
  { id: 'b_aloo_paratha', name: 'Aloo Paratha (Griddle Cooked)', category: 'Grains', qtyType: 'Count', calories: 290, protein: 6 },
  { id: 'b_bread_white', name: 'White Bread Slice', category: 'Grains', qtyType: 'Count', calories: 75, protein: 2 },
  { id: 'b_bread_wheat', name: 'Whole Wheat Bread Slice', category: 'Grains', qtyType: 'Count', calories: 69, protein: 3 },
  { id: 'b_oats_cooked', name: 'Oats (Rolled, Plain)', category: 'Grains', qtyType: 'Bowl', calories: 150, protein: 6 },

  // Indian Breakfasts & Starters
  { id: 'b_poha_veg', name: 'Kanda Poha (Traditional)', category: 'Breakfast', qtyType: 'Bowl', calories: 180, protein: 4 },
  { id: 'b_poha_egg', name: 'Egg Poha (Poha + Scrambled Egg)', category: 'Breakfast', qtyType: 'Bowl', calories: 250, protein: 10 },
  { id: 'b_upma_suji', name: 'Suji Upma (Savory Semolina)', category: 'Breakfast', qtyType: 'Bowl', calories: 210, protein: 5 },
  { id: 'b_idli_plain', name: 'Idli (Steamed Rice-Lentil Cake)', category: 'Breakfast', qtyType: 'Piece', calories: 60, protein: 2 },
  { id: 'b_medu_vada', name: 'Medu Vada (Black Lentil Fritter)', category: 'Breakfast', qtyType: 'Piece', calories: 100, protein: 3 },
  { id: 'b_dal_vada', name: 'Dal Vada (Spiced Chana Fritter)', category: 'Snacks', qtyType: 'Piece', calories: 85, protein: 2.5 },
  { id: 'b_masala_dosa', name: 'Masala Dosa (With Potato)', category: 'Breakfast', qtyType: 'Count', calories: 350, protein: 7 },
  { id: 'b_paneer_bhurji', name: 'Paneer Bhurji', category: 'Breakfast', qtyType: 'Bowl', calories: 280, protein: 14 },
  { id: 'b_egg_bhurji', name: 'Egg Bhurji (2-Egg Scramble)', category: 'Breakfast', qtyType: 'Bowl', calories: 190, protein: 12 },
  { id: 'b_dhokla', name: 'Khaman Dhokla (Steamed Gram)', category: 'Snacks', qtyType: 'Piece', calories: 80, protein: 3 },
  { id: 'b_samosa_one', name: 'Punjabi Samosa (Deep Fried)', category: 'Snacks', qtyType: 'Piece', calories: 260, protein: 4 },

  // Lentils, Dals & Curries
  { id: 'b_moong_dal_cooked', name: 'Moong Dal (Yellow Split Yellow Dal)', category: 'Main Meals', qtyType: 'Bowl', calories: 135, protein: 8 },
  { id: 'b_dal_tadka', name: 'Dal Tadka (Arhar/Toor Dal)', category: 'Main Meals', qtyType: 'Bowl', calories: 150, protein: 7 },
  { id: 'b_bhindi_sabji', name: 'Bhindi Sabji (Okra/Ladyfinger)', category: 'Main Meals', qtyType: 'Bowl', calories: 110, protein: 2.5 },
  { id: 'b_spring_onion_sabji', name: 'Spring Onion & Besan Sabji', category: 'Main Meals', qtyType: 'Bowl', calories: 125, protein: 4.2 },
  { id: 'b_dal_makhani', name: 'Dal Makhani (Black Urad & Butter)', category: 'Main Meals', qtyType: 'Bowl', calories: 260, protein: 9 },
  { id: 'b_chole_masala', name: 'Chole (Chickpea Masala)', category: 'Main Meals', qtyType: 'Bowl', calories: 240, protein: 8 },
  { id: 'b_rajma_masala', name: 'Rajma (Spicy Red Kidney Beans)', category: 'Main Meals', qtyType: 'Bowl', calories: 210, protein: 7 },
  { id: 'b_moong_dal_chilla', name: 'Moong Dal Chilla (Lentil Pancake)', category: 'Breakfast', qtyType: 'Count', calories: 125, protein: 6 },
  { id: 'b_paneer_butter', name: 'Paneer Butter Masala', category: 'Main Meals', qtyType: 'Bowl', calories: 360, protein: 12 },
  { id: 'b_mix_veg_sabzi', name: 'Mixed Vegetable Dry Sabji', category: 'Main Meals', qtyType: 'Bowl', calories: 110, protein: 3 },

  // Dairy, Chaas & Fats
  { id: 'b_chaas_salted', name: 'Chaas (Buttermilk Extra Light)', category: 'Dairy', qtyType: 'Glass' as any, calories: 45, protein: 2 },
  { id: 'b_milk_whole', name: 'Milk (Full Cream, 250ml)', category: 'Dairy', qtyType: 'Glass' as any, calories: 150, protein: 8 },
  { id: 'b_milk_skimmed', name: 'Milk (Skimmed Fat-free, 250ml)', category: 'Dairy', qtyType: 'Glass' as any, calories: 90, protein: 8 },
  { id: 'b_curd_plain', name: 'Curd / Dahi (Plain Whole Milk)', category: 'Dairy', qtyType: 'Bowl', calories: 100, protein: 5 },
  { id: 'b_ghee_spoon', name: 'Ghee (Pure Clarified Butter)', category: 'Dairy', qtyType: 'Spoon' as any, calories: 90, protein: 0 }, // per 10g
  { id: 'b_butter_spoon', name: 'Yellow Butter Portion', category: 'Dairy', qtyType: 'Gram', calories: 72, protein: 0.1 }, // per 10g

  // Fruits, Vegetables & Nuts
  { id: 'b_banana', name: 'Banana', category: 'Fruits', qtyType: 'Count', calories: 105, protein: 1.3 },
  { id: 'b_apple', name: 'Apple', category: 'Fruits', qtyType: 'Count', calories: 95, protein: 0.5 },
  { id: 'b_almonds', name: 'Almonds (10 items)', category: 'Snacks', qtyType: 'Count', calories: 70, protein: 2.5 },
  { id: 'b_walnuts', name: 'Walnuts (5 items)', category: 'Snacks', qtyType: 'Count', calories: 130, protein: 3 }
];

export const FOOD_CATEGORIES = [
  'All',
  'Proteins',
  'Grains',
  'Dairy',
  'Main Meals',
  'Breakfast',
  'Snacks',
  'Fruits'
];
