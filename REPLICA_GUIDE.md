# Complete App Replication & Account Transfer Guide

This document is your master blueprint for transferring this health, nutrition, and workout tracking application to another Google account or recreating a 100% pixel-perfect, feature-complete replica using Gemini.

---

## 🚀 Option A: The 100% Perfect Transfer (Highly Recommended, Takes 1 Minute)

To move this exact application workspace to a different Google account within Google AI Studio, you do not need to rebuild any code or configuration from scratch. The platform provides a native mechanism to export and import entire project containers.

### Step 1: Export from this Account
1. Open this project in **Google AI Studio**.
2. Locate the navigation bar/menu at the top or left.
3. Click the **Project Settings** or **Settings / Export** option.
4. Select **"Download as ZIP"** to download the complete source code, or click **"Export to GitHub"** to save it to your GitHub profile.

### Step 2: Import into your Pro Account
1. Log out of this Google Account, and log into your **Target/Pro Google Account**.
2. Go to **Google AI Studio Build** ([ai.studio/build](https://ai.studio/build)).
3. On the dashboard, click **"Import Project"** / **"Import from ZIP"** (or connect to your GitHub repository if you exported there).
4. Upload the downloaded ZIP file.
5. **Done!** The platform will spin up the exact same container, packages, styles, and code in 30 seconds with 100% fidelity.

---

## 🎨 Option B: Rebuilding From Scratch (Replication Master Prompt)

If you are starting inside a blank project workspace in another model interface and want to instruct Gemini Pro to reconstruct this exact app pixel-for-pixel, copy and paste the master instructions below. It includes **all** custom food profiles and exercise databases.

### 📋 COPY & PASTE THIS MASTER INSTRUCTION PROMPT TO GEMINI PRO:

```markdown
You are a world-class React, TypeScript, and Tailwind specialist. I want to build a highly-polished personal fitness, diet, and calorie tracking web application. The design MUST be distinct, sleek, premium, and utilize a dark "Cosmic/Charcoal Slate" theme. It is optimized for an Indian male user (Age 33, 165cm, 77kg).

Here is the exact architecture, files list, and design guidelines you must follow to create a 100% identical replica.

### 1. Key Application Specifications & Capabilities
- **Responsive Fluid Bento Layout**: The primary dashboard uses a beautiful, structured grid containing modular cards: Calorie Hub (Net calories = consumed - burned), Steps Tracker (with micro logs), Water Intake, and Weight Logs.
- **Custom-Tailored Indian Foods & Exercises**: Built-in tables include exact macronutrients for traditional Indian food items and a catalog of strength/cardio presets.
- **Dynamic Energy & MET Multiplier Code**:
  - Calories burned are calculated dynamically based on user profile parameters (Height: 165, Weight: 77, Age: 33, Gender: Male).
  - Walk Steps conversion: Calories = Steps * 0.00055 * weightKg
  - Walk Duration converter: Calories = Minutes * 0.05775 * weightKg. 1 minute of standard walking is set to 120 equivalent steps.
- **Durable Local State Persistence**: Every state, history item, Custom Food profile, log, and weight record is persisted with instant client-side localStorage sync on the date key.

### 2. Complete Project Directory Structure
Instruct the environment to lay out files identically:
- `/package.json` — Vite configuration, lucide-react (all icons), motion (for elegant slide/fade tab transitions), and recharts (for weight charts).
- `/src/types.ts` — Fully-typed state schema containing:
  - UserProfile (age, gender, heightCm, startWeightKg, currentWeightKg, targetWeightKg, caloriesGoal, waterGoalMl)
  - FoodLog, WorkoutLog, WaterLog, WeightLog, StepsLog, FoodItem
- `/src/data/foods.ts` — Full preset database of diets (replicated below).
- `/src/data/exercises.ts` -- Full preset database of lifts/cardiotypes (replicated below).
- `/src/hooks/useAppState.tsx` — Main Context hook coordinating active date navigation, custom food additions, deletion triggers, and daily calculations.
- `/src/components/DashboardScreen.tsx` — Gorgeous bento grid carrying Calorie Hub, Steps tracker, instant water tracker, weights, and daily set summaries.
- `/src/components/QuickAddModal.tsx` — Dual-mode logging interface (Allows choosing Walk Steps or Walking Time which auto-converts using profile calculations).

### 3. Tailwind Theme Configuration
Import 'Inter' and 'JetBrains Mono' font pairings into the global environment. In `/src/index.css`, paste:
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}
```

---

## 🗄️ Full Food Database (`/src/data/foods.ts`)
```typescript
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
  { id: 'b_chole_masala', name: 'Chole (Chickpea Masal)', category: 'Main Meals', qtyType: 'Bowl', calories: 240, protein: 8 },
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
```

---

## 🏋️ Full Workouts Preset (`/src/data/exercises.ts`)
```typescript
import { MuscleGroup } from '../types';

export interface BuiltInStrengthExercise {
  name: string;
  muscleGroup: MuscleGroup;
  defaultWeight: number;
  defaultSets: number;
  defaultReps: number;
}

export interface BuiltInCardioExercise {
  name: string;
  defaultDuration: number; // minutes
  metValue: number; // Metabolic Equivalent of Task for calorie formulas
}

export const BUILT_IN_STRENGTH: BuiltInStrengthExercise[] = [
  { name: 'Pec Deck Fly', muscleGroup: 'Chest', defaultWeight: 50, defaultSets: 5, defaultReps: 10 },
  { name: 'Flat Bench Press', muscleGroup: 'Chest', defaultWeight: 60, defaultSets: 4, defaultReps: 10 },
  { name: 'Incline Dumbbell Press', muscleGroup: 'Chest', defaultWeight: 20, defaultSets: 4, defaultReps: 10 },
  
  { name: 'Lat Pulldown', muscleGroup: 'Back', defaultWeight: 45, defaultSets: 5, defaultReps: 10 },
  { name: 'Seated Cable Row', muscleGroup: 'Back', defaultWeight: 40, defaultSets: 4, defaultReps: 12 },
  { name: 'Pull-Ups', muscleGroup: 'Back', defaultWeight: 0, defaultSets: 3, defaultReps: 8 },
  
  { name: 'Shoulder Press (Dumbbell)', muscleGroup: 'Shoulders', defaultWeight: 15, defaultSets: 3, defaultReps: 10 },
  { name: 'Lateral Raise', muscleGroup: 'Shoulders', defaultWeight: 7.5, defaultSets: 4, defaultReps: 12 },
  { name: 'Overhead Press (Barbell)', muscleGroup: 'Shoulders', defaultWeight: 30, defaultSets: 4, defaultReps: 8 },
  
  { name: 'Bicep Curl (Dumbbell)', muscleGroup: 'Biceps', defaultWeight: 12.5, defaultSets: 5, defaultReps: 10 },
  { name: 'Hammer Curl', muscleGroup: 'Biceps', defaultWeight: 12.5, defaultSets: 4, defaultReps: 10 },
  { name: 'Preacher Curl', muscleGroup: 'Biceps', defaultWeight: 25, defaultSets: 4, defaultReps: 10 },
  
  { name: 'Tricep Pushdown', muscleGroup: 'Triceps', defaultWeight: 50, defaultSets: 5, defaultReps: 10 },
  { name: 'Skull Crushers', muscleGroup: 'Triceps', defaultWeight: 20, defaultSets: 4, defaultReps: 10 },
  { name: 'Overhead Tricep Extension', muscleGroup: 'Triceps', defaultWeight: 15, defaultSets: 4, defaultReps: 12 },
  
  { name: 'Leg Press', muscleGroup: 'Legs', defaultWeight: 120, defaultSets: 5, defaultReps: 10 },
  { name: 'Barbell Squats', muscleGroup: 'Legs', defaultWeight: 80, defaultSets: 4, defaultReps: 8 },
  { name: 'Lying Leg Curl', muscleGroup: 'Legs', defaultWeight: 35, defaultSets: 4, defaultReps: 12 },
  { name: 'Calf Raise', muscleGroup: 'Legs', defaultWeight: 50, defaultSets: 4, defaultReps: 15 },
  
  { name: 'Hanging Leg Raise', muscleGroup: 'Abs', defaultWeight: 0, defaultSets: 3, defaultReps: 15 },
  { name: 'Ab Wheel Rollout', muscleGroup: 'Abs', defaultWeight: 0, defaultSets: 3, defaultReps: 12 },
  { name: 'Standard Crunches', muscleGroup: 'Abs', defaultWeight: 0, defaultSets: 4, defaultReps: 20 }
];

export const BUILT_IN_CARDIO: BuiltInCardioExercise[] = [
  { name: 'Elliptical Trainer', defaultDuration: 40, metValue: 8.0 },
  { name: 'Running (Moderate Pace)', defaultDuration: 30, metValue: 9.8 },
  { name: 'Walking (Brisk, Outdoors)', defaultDuration: 45, metValue: 4.0 },
  { name: 'Stationary Cycling', defaultDuration: 35, metValue: 7.0 },
  { name: 'Skipping Rope', defaultDuration: 15, metValue: 11.0 },
  { name: 'Rowing Machine', defaultDuration: 20, metValue: 7.0 },
  { name: 'Swimming (Freestyle)', defaultDuration: 30, metValue: 8.3 }
];

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Legs',
  'Abs'
];
```
