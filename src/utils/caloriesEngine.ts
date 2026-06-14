/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile } from '../types';

export function calculateStrengthCalories(
  sets: number,
  reps: number,
  weightLiftedKg: number,
  profile: UserProfile
): number {
  // Calibration based on standard metabolic tracking for resistance training
  // Base cost per rep scaled by the weight lifted + baseline body mass cost per set
  const weightFactor = weightLiftedKg * 0.012; // 0.6 kcal per rep at 50kg
  const bodyFactor = profile.currentWeightKg * 0.12; // ~9 kcal per set for 77kg bodyweight
  
  const rawBurn = (sets * reps * weightFactor) + (sets * bodyFactor);
  
  // Minor adjustment factors
  const genderMultiplier = profile.gender === 'male' ? 1.05 : 0.95;
  const ageMultiplier = Math.max(0.7, (100 - profile.age) / 67); // Age 33 yields ~1.0
  
  return Math.round(rawBurn * genderMultiplier * ageMultiplier);
}

export function calculateCardioCalories(
  durationMinutes: number,
  exerciseName: string,
  profile: UserProfile
): number {
  // Let's retrieve a corresponding calorie factor (MET-derived multiplier for 77kg)
  let baseKcalPerMinute = 7.0; // standard default
  
  const nameLower = exerciseName.toLowerCase();
  if (nameLower.includes('elliptical')) {
    baseKcalPerMinute = 8.0; // 320 kcal/40mins at 77kg
  } else if (nameLower.includes('run')) {
    baseKcalPerMinute = 10.5; // 315 kcal/30mins at 77kg
  } else if (nameLower.includes('walk')) {
    baseKcalPerMinute = 4.5;  // 202.5 kcal/45mins at 77kg
  } else if (nameLower.includes('cycle') || nameLower.includes('bicycl')) {
    baseKcalPerMinute = 7.0;  // 245 kcal/35mins at 77kg
  } else if (nameLower.includes('skip') || nameLower.includes('rope')) {
    baseKcalPerMinute = 12.0; // 180 kcal/15mins at 77kg
  } else if (nameLower.includes('row')) {
    baseKcalPerMinute = 7.5;  // 150 kcal/20mins at 77kg
  } else if (nameLower.includes('swim')) {
    baseKcalPerMinute = 8.5;  // 255 kcal/30mins at 77kg
  }
  
  // Adapt automatically to body weight relative to baseline 77kg
  const weightRatio = profile.currentWeightKg / 77;
  
  return Math.round(durationMinutes * baseKcalPerMinute * weightRatio);
}
