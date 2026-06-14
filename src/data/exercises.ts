/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
