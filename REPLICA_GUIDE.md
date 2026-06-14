# Complete App Replication & Account Transfer Guide

This document is your master blueprint for transferring this health, nutrition, and workout tracking application to another Google account or recreating a 100% pixel-perfect, feature-complete replica using Gemini.

---

## 🚀 Option A: The 100% Perfect Transfer (Highly Recommended, Takes 1 Minute)

To move this exact application workspace to a different Google account within Google AI Studio, you do not need to rebuild it line-by-line. The platform provides a native mechanism to export and import entire project containers.

### Step 1: Export from this Account
1. Open this project in **Google AI Studio**.
2. Locate the navigation bar/menu at the top or left.
3. Click the **Project Settings** or **Export** option.
4. Select **"Download as ZIP"** to download the complete source code, or click **"Export to GitHub"** to save it to your GitHub profile.

### Step 2: Import into your Pro Account
1. Log out of this Google Account, and log into your **Target/Pro Google Account**.
2. Go to **Google AI Studio Build** ([ai.studio/build](https://ai.studio/build)).
3. On the dashboard, click **"Import Project"** / **"Import from ZIP"** (or connect to your GitHub repository if you exported there).
4. Upload the downloaded ZIP file.
5. **Done!** The platform will spin up the exact same container, packages, styles, and code in 30 seconds with 100% fidelity.

---

## 🎨 Option B: Rebuilding From Scratch (Replication Master Prompt)

If you are starting inside a blank project workspace in another model interface and want to instruct Gemini Pro to reconstruct this exact app pixel-for-pixel, copy and paste the master instructions below.

### 📋 COPY & PASTE THIS MASTER INSTRUCTION PROMPT TO GEMINI PRO:

```markdown
You are a world-class React, TypeScript, and Tailwind specialist. I want to build a highly-polished personal fitness, diet, and calorie tracking web application. The design MUST be distinct, sleek, premium, and utilize a dark "Cosmic/Charcoal Slate" theme. It is optimized for an Indian male user (Age 33, 165cm, 77kg).

Here is the exact architecture, files list, and design guidelines you must follow to create a 100% identical replica.

### 1. Key Application Specifications & Capabilities
- **Responsive Fluid Bento Layout**: The primary dashboard uses a beautiful, structured grid containing modular cards: Calorie Hub (Net calories = consumed - burned), Steps Tracker (with micro logs), Water Intake, and Weight Logs.
- **Custom-Tailored Indian Foods & Exercises**: Built-in tables include exact macronutrients for traditional Indian food items (Phulka - no oil ghee, Chapati, Basmati cooked rice, Kanda Poha, Egg Poha, Suji Upma, Moong Dal yellow dal, Dal Tadka, Paneer 100g standard, Soya Chunks dry and cooked curry, Bhindi Sabji, Spring Onion and Besan Sabji, Chaas buttermilk, Medu Vada, Dal Vada, Idli, etc.).
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
- `/src/data/foods.ts` — The pre-built Indian diet foods directory containing calorie/protein definitions for traditional vegetarian and egg dishes.
- `/src/data/exercises.ts` -- Standard workout database listing muscle groups (Chest, Back, Legs, Shoulders, Arms, Core, Cardio) and exercise entries with pre-computed MET scores.
- `/src/hooks/useAppState.tsx` — The main React Context hook coordinating global state, active date navigation (increment/decrement/calendar), custom food additions, deletion triggers, and daily calculations.
- `/src/components/DashboardScreen.tsx` — The gorgeous, high-contrast, multi-card home grid. Centered in this view:
  - Calorie Hub Card: Combines consumed and burned metrics showing Net balance.
  - Steps Tracker: Shows daily steps vs 10k goal, plus button to trigger steps sheet.
  - Today's Steps Logs: Interactive item list enabling quick deletions.
  - Water Intake & Weight Logs.
- `/src/components/QuickAddModal.tsx` — A bottom sheet overlay containing forms for adding Water, Weight, or Steps (switching between total steps count or walk minutes and showing real-time estimated metabolic impact based on the 77kg weight profile).
- `/src/components/FoodScreen.tsx` — Tab where users can add meals, browse preset Indian dishes, search, save favorites, and create custom dishes.
- `/src/components/WorkoutScreen.tsx` — Exercise log showing tracked lifting sets, muscle groups active, and total burned calories.
- `/src/components/WeightScreen.tsx` — Graph visualization of historical body weight, BMI math, and progress tracking.
- `/src/components/HistoryScreen.tsx` — Chronological log aggregator rendering historic snapshots grouped by date with deletion buttons.

### 3. Tailwind Theme Configuration
Import 'Inter' and 'JetBrains Mono' font pairings into the global environment. In `/src/index.css`, paste:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}
```

Implement the codebase chunk-by-chunk according to these parameters. Make sure no static placeholder values are hardcoded – all calculations must derive dynamically from the user profile data.
```
---

## 🛠️ Complete Source Code Map & Manifest

You can use these key structures as a blueprint reference for recreating components:

### 1. The Core Types System (`/src/types.ts`)
```typescript
export interface FoodItem {
  id: string;
  name: string;
  category: string;
  qtyType: 'Count' | 'Gram' | 'Bowl' | 'Cup' | 'Piece' | 'ml' | 'Grab' | 'Glass' | 'Scoop' | 'Portion';
  calories: number;
  protein: number;
  isCustom?: boolean;
}

export interface FoodLog {
  id: string;
  timestamp: string; // ISO format
  foodId: string;
  name: string;
  calories: number;
  protein: number;
  quantity: number;
  qtyType: string;
}

export interface WorkoutLog {
  id: string;
  timestamp: string;
  exerciseId: string;
  name: string;
  category: string; // Muscle group
  durationMinutes: number;
  sets?: number;
  reps?: number;
  weightLoaded?: number;
  caloriesBurned: number;
}

export interface WaterLog {
  id: string;
  timestamp: string;
  amountMl: number;
}

export interface WeightLog {
  date: string; // YYYY-MM-DD
  weightKg: number;
}

export interface StepsLog {
  id: string;
  timestamp: string;
  steps: number;
  durationMinutes?: number;
  caloriesBurned: number;
}

export interface UserProfile {
  age: number;
  gender: 'male' | 'female';
  heightCm: number;
  startWeightKg: number;
  currentWeightKg: number;
  targetWeightKg: number;
  caloriesGoal: number;
  waterGoalMl: number;
}
```

### 2. Steps Metric Calculations (`/src/hooks/useAppState.tsx`)
```typescript
const addStepsLog = (steps: number, durationMinutes?: number, timestamp?: string) => {
  const currentWeight = state.profile?.currentWeightKg || 77;
  let computedCalories = 0;
  let actualSteps = steps;

  if (steps > 0) {
    // Standard fast formulas
    computedCalories = Math.round(steps * 0.00055 * currentWeight);
  } else if (durationMinutes && durationMinutes > 0) {
    actualSteps = Math.round(durationMinutes * 120);
    computedCalories = Math.round(durationMinutes * 0.05775 * currentWeight);
  }

  const newLog = {
    id: `step_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    timestamp: timestamp || getTimestampForDate(selectedDate),
    steps: actualSteps,
    durationMinutes,
    caloriesBurned: computedCalories
  };

  setState(prev => ({
    ...prev,
    stepsLogs: [newLog, ...(prev.stepsLogs || [])]
  }));
};
```

---

*This document was synthesized in your workspace repository root. Keep it safe to make your account shifts, clones, or backups 100% painless!*
