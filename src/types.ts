/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type QtyType = 'Count' | 'Gram' | 'ml' | 'Piece' | 'Cup' | 'Bowl' | 'Scoop';

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  qtyType: QtyType;
  calories: number;
  protein: number;
  isCustom?: boolean;
  isFavorite?: boolean;
}

export type MuscleGroup = 'Chest' | 'Back' | 'Shoulders' | 'Biceps' | 'Triceps' | 'Legs' | 'Abs';

export interface StrengthExercise {
  exerciseName: string;
  muscleGroup: MuscleGroup;
  weight: number; // in kg
  sets: number;
  reps: number;
  caloriesBurned: number;
}

export interface CardioExercise {
  exerciseName: string;
  duration: number; // in minutes
  caloriesBurned: number;
}

export interface FoodLog {
  id: string;
  timestamp: string; // ISO String
  foodId: string;
  name: string;
  category: string;
  qty: number;
  qtyType: QtyType;
  calories: number;
  protein: number;
}

export interface WorkoutLog {
  id: string;
  timestamp: string; // ISO String
  type: 'strength' | 'cardio';
  exerciseName: string;
  muscleGroup?: MuscleGroup; // Strength only
  weight?: number; // Strength only, in kg
  sets?: number; // Strength only
  reps?: number; // Strength only
  duration?: number; // Cardio only, in minutes
  caloriesBurned: number;
}

export interface WaterLog {
  id: string;
  timestamp: string; // ISO String
  amountMl: number;
}

export interface WeightLog {
  date: string; // YYYY-MM-DD
  weightKg: number;
}

export interface StepsLog {
  id: string;
  timestamp: string; // ISO String
  steps: number;
  durationMinutes?: number;
  caloriesBurned: number;
}

export interface UserProfile {
  age: number;
  gender: 'male' | 'female';
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  caloriesGoal: number;
  proteinGoal: number;
  waterGoalMl: number;
}

export interface AppState {
  foodLogs: FoodLog[];
  workoutLogs: WorkoutLog[];
  waterLogs: WaterLog[];
  weightLogs: WeightLog[];
  stepsLogs?: StepsLog[];
  customFoods: FoodItem[];
  profile: UserProfile;
  favorites: string[]; // foodIds
  recentFoods: string[]; // foodIds
}
