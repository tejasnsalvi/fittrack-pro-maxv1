/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, FoodLog, WorkoutLog, WaterLog, WeightLog, FoodItem, UserProfile } from '../types';
import { BUILT_IN_FOODS } from '../data/foods';
import { getISTDateString, getISTTimestampForDate } from '../utils/dateUtils';

const DEFAULT_PROFILE: UserProfile = {
  age: 33,
  gender: 'male',
  heightCm: 165,
  initialWeightKg: 77,
  currentWeightKg: 77,
  targetWeightKg: 70,
  caloriesGoal: 1800,
  proteinGoal: 130,
  waterGoalMl: 3000
};

const DEFAULT_WEIGHT_LOGS: WeightLog[] = [
  { date: getISTDateString(), weightKg: 77 }
];

// Context Definition
interface AppStateContextProps {
  state: AppState;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  addFoodLog: (foodId: string, name: string, category: string, qty: number, qtyType: any, calories: number, protein: number, timestamp?: string) => void;
  deleteFoodLog: (id: string) => void;
  addWorkoutLog: (log: Omit<WorkoutLog, 'id' | 'timestamp'> & { timestamp?: string }) => void;
  deleteWorkoutLog: (id: string) => void;
  addWaterLog: (amountMl: number, timestamp?: string) => void;
  deleteWaterLog: (id: string) => void;
  addStepsLog: (steps: number, durationMinutes?: number, timestamp?: string) => void;
  deleteStepsLog: (id: string) => void;
  logWeight: (weight: number, date?: string) => void;
  saveCustomFood: (food: Omit<FoodItem, 'id' | 'isCustom'>) => void;
  deleteCustomFood: (id: string) => void;
  toggleFavorite: (foodId: string) => void;
  addRecentFood: (foodId: string) => void;
  updateProfile: (profile: UserProfile) => void;
  toggleFastingLog: (dateStr: string) => void;
  importBackup: (backupStr: string) => { success: boolean; error?: string };
  exportBackup: () => string;
  clearAllData: () => void;
}

const AppStateContext = createContext<AppStateContextProps | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(() => getISTDateString());

  const getTimestampForDate = (dateStr: string) => {
    return getISTTimestampForDate(dateStr);
  };

  const [state, setState] = useState<AppState>(() => {
    // Lazy initialisation from localStorage
    try {
      const foodLogs = localStorage.getItem('foodLogs');
      const workoutLogs = localStorage.getItem('workoutLogs');
      const waterLogs = localStorage.getItem('waterLogs');
      const weightLogs = localStorage.getItem('weightLogs');
      const stepsLogs = localStorage.getItem('stepsLogs');
      const customFoods = localStorage.getItem('customFoods');
      const profile = localStorage.getItem('profile');
      const favorites = localStorage.getItem('favorites');
      const recentFoods = localStorage.getItem('recentFoods');
      const fastingLogs = localStorage.getItem('fastingLogs');

      // Determine today's date
      const todayStr = getISTDateString();

      const loadedProfile: UserProfile = profile ? JSON.parse(profile) : DEFAULT_PROFILE;
      if (loadedProfile.initialWeightKg === undefined) {
        loadedProfile.initialWeightKg = loadedProfile.currentWeightKg || 77;
      }
      const loadedWeightLogs: WeightLog[] = weightLogs ? JSON.parse(weightLogs) : [
        { date: todayStr, weightKg: loadedProfile.currentWeightKg }
      ];

      return {
        foodLogs: foodLogs ? JSON.parse(foodLogs) : [],
        workoutLogs: workoutLogs ? JSON.parse(workoutLogs) : [],
        waterLogs: waterLogs ? JSON.parse(waterLogs) : [],
        weightLogs: loadedWeightLogs,
        stepsLogs: stepsLogs ? JSON.parse(stepsLogs) : [],
        customFoods: customFoods ? JSON.parse(customFoods) : [],
        profile: loadedProfile,
        favorites: favorites ? JSON.parse(favorites) : [],
        recentFoods: recentFoods ? JSON.parse(recentFoods) : [],
        fastingLogs: fastingLogs ? JSON.parse(fastingLogs) : []
      };
    } catch (e) {
      console.error('Failed to load storage state: ', e);
      return {
        foodLogs: [],
        workoutLogs: [],
        waterLogs: [],
        weightLogs: DEFAULT_WEIGHT_LOGS,
        stepsLogs: [],
        customFoods: [],
        profile: DEFAULT_PROFILE,
        favorites: [],
        recentFoods: [],
        fastingLogs: []
      };
    }
  });

  // Sync state back to individual localStorage elements
  useEffect(() => {
    try {
      localStorage.setItem('foodLogs', JSON.stringify(state.foodLogs));
      localStorage.setItem('workoutLogs', JSON.stringify(state.workoutLogs));
      localStorage.setItem('waterLogs', JSON.stringify(state.waterLogs));
      localStorage.setItem('weightLogs', JSON.stringify(state.weightLogs));
      localStorage.setItem('stepsLogs', JSON.stringify(state.stepsLogs || []));
      localStorage.setItem('customFoods', JSON.stringify(state.customFoods));
      localStorage.setItem('profile', JSON.stringify(state.profile));
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
      localStorage.setItem('recentFoods', JSON.stringify(state.recentFoods));
      localStorage.setItem('fastingLogs', JSON.stringify(state.fastingLogs || []));
    } catch (e) {
      console.error('Failed to write changes to storage: ', e);
    }
  }, [state]);

  const addFoodLog = (foodId: string, name: string, category: string, qty: number, qtyType: any, calories: number, protein: number, timestamp?: string) => {
    const newLog: FoodLog = {
      id: `fl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: timestamp || getTimestampForDate(selectedDate),
      foodId,
      name,
      category,
      qty,
      qtyType,
      calories: Math.round(calories),
      protein: Number(protein.toFixed(1))
    };
    setState(prev => ({
      ...prev,
      foodLogs: [newLog, ...prev.foodLogs]
    }));
    addRecentFood(foodId);
  };

  const deleteFoodLog = (id: string) => {
    setState(prev => ({
      ...prev,
      foodLogs: prev.foodLogs.filter(log => log.id !== id)
    }));
  };

  const addWorkoutLog = (log: Omit<WorkoutLog, 'id' | 'timestamp'> & { timestamp?: string }) => {
    const newLogId = `wl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newLogTimestamp = log.timestamp || getTimestampForDate(selectedDate);
    const newLog: WorkoutLog = {
      id: newLogId,
      timestamp: newLogTimestamp,
      exerciseName: log.exerciseName,
      type: log.type,
      muscleGroup: log.muscleGroup,
      sets: log.sets,
      reps: log.reps,
      weight: log.weight,
      duration: log.duration,
      caloriesBurned: log.caloriesBurned
    };

    setState(prev => {
      const updatedWorkouts = [newLog, ...prev.workoutLogs];
      
      // Auto estimate steps if this is a cardio workout
      let updatedSteps = prev.stepsLogs || [];
      if (log.type === 'cardio' && log.duration && log.duration > 0) {
        const age = prev.profile?.age ?? 33;
        const gender = prev.profile?.gender ?? 'male';
        const heightCm = prev.profile?.heightCm ?? 165;
        const currentWeight = prev.profile?.currentWeightKg ?? 76;

        const nameLower = log.exerciseName.toLowerCase();
        let baseStepsPerMin = 100;

        if (nameLower.includes('elliptical')) {
          baseStepsPerMin = 130;
        } else if (nameLower.includes('run') || nameLower.includes('jog')) {
          baseStepsPerMin = 160;
        } else if (nameLower.includes('walk') || nameLower.includes('hike')) {
          baseStepsPerMin = 120;
        } else if (nameLower.includes('skip') || nameLower.includes('rope')) {
          baseStepsPerMin = 150;
        } else if (nameLower.includes('cycl') || nameLower.includes('bicycl') || nameLower.includes('spin')) {
          baseStepsPerMin = 90;
        } else if (nameLower.includes('row')) {
          baseStepsPerMin = 80;
        } else if (nameLower.includes('swim')) {
          baseStepsPerMin = 75;
        }

        const heightMultiplier = 165 / heightCm;
        const ageMultiplier = Math.max(0.75, 1 - (age - 33) * 0.004);
        const genderMultiplier = gender === 'female' ? 1.05 : 1.00;
        const weightMultiplier = Math.max(0.85, Math.min(1.15, currentWeight / 76));

        const autoSteps = Math.round(log.duration * baseStepsPerMin * heightMultiplier * ageMultiplier * genderMultiplier * weightMultiplier);
        
        if (autoSteps > 0) {
          const autoStepLog = {
            id: `step_wl_${newLogId}`,
            timestamp: newLogTimestamp,
            steps: autoSteps,
            durationMinutes: log.duration,
            caloriesBurned: 0 // Keep 0 to avoid double counting, since cardio logs already record caloriesBurned
          };
          updatedSteps = [autoStepLog, ...updatedSteps];
        }
      }

      return {
        ...prev,
        workoutLogs: updatedWorkouts,
        stepsLogs: updatedSteps
      };
    });
  };

  const deleteWorkoutLog = (id: string) => {
    setState(prev => ({
      ...prev,
      workoutLogs: prev.workoutLogs.filter(log => log.id !== id),
      stepsLogs: (prev.stepsLogs || []).filter(log => log.id !== `step_wl_${id}`)
    }));
  };

  const addWaterLog = (amountMl: number, timestamp?: string) => {
    const newLog: WaterLog = {
      id: `wat_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: timestamp || getTimestampForDate(selectedDate),
      amountMl
    };
    setState(prev => ({
      ...prev,
      waterLogs: [newLog, ...prev.waterLogs]
    }));
  };

  const deleteWaterLog = (id: string) => {
    setState(prev => ({
      ...prev,
      waterLogs: prev.waterLogs.filter(log => log.id !== id)
    }));
  };

  const addStepsLog = (steps: number, durationMinutes?: number, timestamp?: string) => {
    const currentWeight = state.profile?.currentWeightKg || 77;
    let computedCalories = 0;
    let actualSteps = steps;

    if (steps > 0) {
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

  const deleteStepsLog = (id: string) => {
    setState(prev => ({
      ...prev,
      stepsLogs: (prev.stepsLogs || []).filter(log => log.id !== id)
    }));
  };

  const logWeight = (weight: number, date?: string) => {
    const targetDate = date || selectedDate;
    const roundedWeight = Number(weight.toFixed(1));

    setState(prev => {
      // Overwrite if entry matches, otherwise insert
      const filtered = prev.weightLogs.filter(w => w.date !== targetDate);
      const updatedLogs = [...filtered, { date: targetDate, weightKg: roundedWeight }].sort((a,b) => a.date.localeCompare(b.date));
      
      // If logging the weight of "today", sync it with current profile weight
      const todayStr = getISTDateString();
      const isToday = targetDate === todayStr;

      return {
        ...prev,
        weightLogs: updatedLogs,
        profile: isToday ? { ...prev.profile, currentWeightKg: roundedWeight } : prev.profile
      };
    });
  };

  const saveCustomFood = (food: Omit<FoodItem, 'id' | 'isCustom'>) => {
    const newItem: FoodItem = {
      ...food,
      id: `cf_${Date.now()}`,
      isCustom: true
    };
    setState(prev => ({
      ...prev,
      customFoods: [newItem, ...prev.customFoods]
    }));
  };

  const deleteCustomFood = (id: string) => {
    setState(prev => ({
      ...prev,
      customFoods: prev.customFoods.filter(f => f.id !== id),
      // Clean target favorites or recents
      favorites: prev.favorites.filter(fid => fid !== id),
      recentFoods: prev.recentFoods.filter(fid => fid !== id)
    }));
  };

  const toggleFavorite = (foodId: string) => {
    setState(prev => {
      const isFav = prev.favorites.includes(foodId);
      const updatedFavs = isFav 
        ? prev.favorites.filter(id => id !== foodId)
        : [...prev.favorites, foodId];
      return {
        ...prev,
        favorites: updatedFavs
      };
    });
  };

  const addRecentFood = (foodId: string) => {
    setState(prev => {
      // Keep unique items, max 10 recents
      const filtered = prev.recentFoods.filter(id => id !== foodId);
      const updatedRecents = [foodId, ...filtered].slice(0, 10);
      return {
        ...prev,
        recentFoods: updatedRecents
      };
    });
  };

  const updateProfile = (profile: UserProfile) => {
    // If the weight changes, update or create today's weight log
    const todayStr = getISTDateString();
    setState(prev => {
      const filteredWeights = prev.weightLogs.filter(w => w.date !== todayStr);
      const updatedWeights = [...filteredWeights, { date: todayStr, weightKg: profile.currentWeightKg }]
        .sort((a,b) => a.date.localeCompare(b.date));

      return {
        ...prev,
        profile,
        weightLogs: updatedWeights
      };
    });
  };

  const toggleFastingLog = (dateStr: string) => {
    setState(prev => {
      const currentLogs = prev.fastingLogs || [];
      const isFasting = currentLogs.includes(dateStr);
      const updatedLogs = isFasting 
        ? currentLogs.filter(d => d !== dateStr)
        : [...currentLogs, dateStr];
      return {
        ...prev,
        fastingLogs: updatedLogs
      };
    });
  };

  const exportBackup = (): string => {
    return JSON.stringify(state, null, 2);
  };

  const importBackup = (backupStr: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(backupStr);
      
      // Basic verification checks
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Invalid backup structure.' };
      }
      
      if (!parsed.profile || typeof parsed.profile.age !== 'number' || typeof parsed.profile.caloriesGoal !== 'number') {
        return { success: false, error: 'Backup is missing profile data.' };
      }
      
      if (!Array.isArray(parsed.foodLogs) || !Array.isArray(parsed.workoutLogs) || !Array.isArray(parsed.waterLogs) || !Array.isArray(parsed.weightLogs)) {
        return { success: false, error: 'Backup is missing logs arrays.' };
      }

      setState(parsed);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Error parsing JSON.' };
    }
  };

  const clearAllData = () => {
    localStorage.clear();
    const todayStr = getISTDateString();
    setState({
      foodLogs: [],
      workoutLogs: [],
      waterLogs: [],
      weightLogs: [{ date: todayStr, weightKg: 77 }],
      stepsLogs: [],
      customFoods: [],
      profile: DEFAULT_PROFILE,
      favorites: [],
      recentFoods: [],
      fastingLogs: []
    });
  };

  return (
    <AppStateContext.Provider
      value={{
        state,
        selectedDate,
        setSelectedDate,
        addFoodLog,
        deleteFoodLog,
        addWorkoutLog,
        deleteWorkoutLog,
        addWaterLog,
        deleteWaterLog,
        addStepsLog,
        deleteStepsLog,
        logWeight,
        saveCustomFood,
        deleteCustomFood,
        toggleFavorite,
        addRecentFood,
        updateProfile,
        toggleFastingLog,
        exportBackup,
        importBackup,
        clearAllData
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used inside an AppStateProvider');
  }
  return context;
};
