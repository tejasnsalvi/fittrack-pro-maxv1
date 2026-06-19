/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAppState } from '../hooks/useAppState';
import BottomSheet from './BottomSheet';
import { Plus, Flame, Droplet, Apple, Scale, X, Check, ArrowRight, Dumbbell, Footprints, Activity, Share2 } from 'lucide-react';

interface QuickAddProps {
  onNavigateToTab: (tab: 'home' | 'food' | 'workout' | 'weight' | 'profile' | 'history') => void;
}

export default function QuickAddModal({ onNavigateToTab }: QuickAddProps) {
  const { state, addWaterLog, logWeight, addStepsLog, selectedDate } = useAppState();
  const { profile, foodLogs, workoutLogs, waterLogs, stepsLogs = [], fastingLogs = [] } = state;

  const [isOpen, setIsOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<'options' | 'water' | 'weight' | 'steps'>('options');

  // Mini Form Weight State
  const [quickWeight, setQuickWeight] = useState<string>(profile.currentWeightKg.toString());
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Steps state
  const [stepsInput, setStepsInput] = useState<string>('5000');
  const [durationInput, setDurationInput] = useState<string>('30');
  const [stepsMode, setStepsMode] = useState<'steps' | 'duration'>('steps');

  const handleCopyToClipboard = () => {
    // Format selectedDate comparison
    const isSelectedDate = (timestampStr: string) => {
      return timestampStr.split('T')[0] === selectedDate;
    };

    const todayFood = foodLogs.filter(log => isSelectedDate(log.timestamp));
    const todayWorkout = workoutLogs.filter(log => isSelectedDate(log.timestamp));
    const todayWater = waterLogs.filter(log => isSelectedDate(log.timestamp));
    const todaySteps = stepsLogs.filter(log => isSelectedDate(log.timestamp));
    const isFastingToday = fastingLogs.includes(selectedDate);

    // Compute stats
    const consumedCalories = todayFood.reduce((sum, log) => sum + log.calories, 0);
    const consumedProtein = todayFood.reduce((sum, log) => sum + log.protein, 0);
    const burnedActiveWorkout = todayWorkout.reduce((sum, log) => sum + log.caloriesBurned, 0);

    // Steps Stats
    const stepsToday = todaySteps.reduce((sum, log) => sum + log.steps, 0);
    const stepsCaloriesBurned = todaySteps.reduce((sum, log) => sum + log.caloriesBurned, 0);

    const burnedTotalCalories = burnedActiveWorkout + stepsCaloriesBurned;
    const netCalories = consumedCalories - burnedTotalCalories;

    const getOrdinalStr = (dNum: number) => {
      if (dNum > 3 && dNum < 21) return 'th';
      switch (dNum % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
      }
    };
    
    // Create local Date safely from YYYY-MM-DD
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const monthNameShort = dateObj.toLocaleDateString('en-US', { month: 'short' });
    const formattedDateCompact = `${d} ${monthNameShort} ${y}`;

    // Workout list
    const strengthWorkouts = todayWorkout.filter(w => w.type === 'strength');
    const cardioWorkouts = todayWorkout.filter(w => w.type === 'cardio');
    
    const workoutParts: string[] = [];
    if (strengthWorkouts.length > 0) {
      strengthWorkouts.forEach(w => {
        workoutParts.push(`💪 ${w.exerciseName}: ${w.sets}x${w.reps} @ ${w.weight}kg`);
      });
    }
    if (cardioWorkouts.length > 0) {
      cardioWorkouts.forEach(w => {
        workoutParts.push(`🏃‍♂️ ${w.exerciseName}: ${w.duration} min`);
      });
    }
    const workoutDetailsStr = workoutParts.length > 0 
      ? workoutParts.join('\n') 
      : '•  _No training recorded_';

    // Hydration calculations
    const waterTodayMl = todayWater.reduce((sum, log) => sum + log.amountMl, 0);
    const waterTodayLitres = (waterTodayMl / 1000).toFixed(1);

    const foodDetailsStr = todayFood.length > 0
      ? todayFood.map(f => `• ${f.name} (${f.qty} ${f.qtyType}): ${f.calories} kcal | ${f.protein.toFixed(1)}g Protein`).join('\n')
      : '• _No food items logged_';

    const message = `📱 *Tejas' Daily Fitness Log* | ${formattedDateCompact}

⏳ Intermittent Fasting: ${isFastingToday ? '✅ Completed' : '❌ Not logged'}

⚖️ *Current Weight:* ${profile.currentWeightKg} kg

🏋️‍♂️ *Training*
${workoutDetailsStr}

🏃‍♂️ *Activity, Diet & Hydration*
👣 Steps: ${stepsToday.toLocaleString()} | 💧 Water: ${waterTodayLitres}L

📊 *Calories & Macros*
🍽️ In: ${consumedCalories.toLocaleString()} kcal | 🔥 Out: ${burnedTotalCalories.toLocaleString()} kcal
🧬 Pro: ${consumedProtein.toFixed(1)}g | 📉 Net: ${netCalories >= 0 ? '+' : ''}${netCalories} kcal
${foodDetailsStr}

📝 *Note:* Hey AI I want you to know these food items logged along with macros may have some discrepancies feel free to assess on our own`;

    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        handleClose();
      }, 1500);
    }).catch(err => {
      console.error('Failed to copy to clipboard', err);
    });
  };

  // Custom Event Listener to trigger specific quick add forms
  useEffect(() => {
    const handleOpenQuickAdd = (e: Event) => {
      const customEvent = e as CustomEvent<{ type: 'food' | 'workout' | 'water' | 'weight' | 'steps' }>;
      const type = customEvent.detail?.type;
      if (type) {
        if (type === 'food') {
          onNavigateToTab('food');
        } else if (type === 'workout') {
          onNavigateToTab('workout');
        } else {
          setActiveForm(type);
          setIsOpen(true);
        }
      }
    };
    window.addEventListener('open-quick-add', handleOpenQuickAdd);
    return () => window.removeEventListener('open-quick-add', handleOpenQuickAdd);
  }, [onNavigateToTab]);

  const handleClose = () => {
    setIsOpen(false);
    // Delay resetting back to options tab so the transition doesn't flicker
    setTimeout(() => {
      setActiveForm('options');
      setIsSaved(false);
      setStepsInput('5000');
      setDurationInput('30');
      setStepsMode('steps');
    }, 200);
  };

  const handleSelectOption = (choice: 'food' | 'workout' | 'water' | 'weight' | 'steps') => {
    if (choice === 'food') {
      onNavigateToTab('food');
      handleClose();
    } else if (choice === 'workout') {
      onNavigateToTab('workout');
      handleClose();
    } else if (choice === 'water') {
      setActiveForm('water');
    } else if (choice === 'weight') {
      setQuickWeight(profile.currentWeightKg.toString());
      setActiveForm('weight');
    } else if (choice === 'steps') {
      setActiveForm('steps');
    }
  };

  const handleQuickWater = (amt: number) => {
    addWaterLog(amt);
    setIsSaved(true);
    setTimeout(() => {
      handleClose();
    }, 600);
  };

  const handleQuickWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(quickWeight);
    if (!parsed || parsed <= 0) return;

    logWeight(parsed);
    setIsSaved(true);
    setTimeout(() => {
      handleClose();
    }, 600);
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        id="floating-quickadd-fab"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#4ADE80] hover:bg-emerald-400 text-[#0F1117] rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 z-30 cursor-pointer active:scale-95"
        aria-label="Quick Add Activity"
      >
        <Plus size={28} className="transform transition-transform active:rotate-90" />
      </button>

      {/* Bottom Sheet Modal */}
      <BottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        title={
          activeForm === 'options' 
            ? 'Quick Add Activity' 
            : activeForm === 'water' 
              ? 'Log Water Intake' 
              : activeForm === 'steps'
                ? 'Log Walking / Steps'
                : 'Log Daily Weight'
        }
      >
        {isSaved ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-3 animate-fadeIn" id="quick-save-success">
            <div className="w-12 h-12 rounded-full bg-[#4ADE80]/15 text-[#4ADE80] flex items-center justify-center">
              <Check size={24} />
            </div>
            <p className="text-sm font-bold text-white">Activity Logged Successfully!</p>
          </div>
        ) : activeForm === 'options' ? (
          <div className="grid grid-cols-2 gap-4 pb-2" id="quickadd-options-grid">
            <button
              id="qa-option-food"
              onClick={() => handleSelectOption('food')}
              className="bg-[#0F1117] p-5 rounded-2xl border border-white/5 hover:border-[#4ADE80]/30 transition text-left flex flex-col justify-between h-[105px] group cursor-pointer"
            >
              <div className="p-2 w-max rounded-xl bg-[#4ADE80]/10 text-[#4ADE80]">
                <Apple size={18} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-white text-xs font-bold">Log Food</span>
                <ArrowRight size={12} className="text-[#A1A1AA] group-hover:translate-x-1 transition" />
              </div>
            </button>

            <button
              id="qa-option-workout"
              onClick={() => handleSelectOption('workout')}
              className="bg-[#0F1117] p-5 rounded-2xl border border-white/5 hover:border-red-400/30 transition text-left flex flex-col justify-between h-[105px] group cursor-pointer"
            >
              <div className="p-2 w-max rounded-xl bg-red-400/10 text-red-400">
                <Dumbbell size={18} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-white text-xs font-bold">Log Workout</span>
                <ArrowRight size={12} className="text-[#A1A1AA] group-hover:translate-x-1 transition" />
              </div>
            </button>

            <button
              id="qa-option-steps"
              onClick={() => handleSelectOption('steps')}
              className="bg-[#0F1117] p-5 rounded-2xl border border-white/5 hover:border-emerald-400/30 transition text-left flex flex-col justify-between h-[105px] group cursor-pointer"
            >
              <div className="p-2 w-max rounded-xl bg-emerald-500/10 text-emerald-400">
                <Footprints size={18} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-white text-xs font-bold">Log Steps</span>
                <Plus size={14} className="text-[#A1A1AA]" />
              </div>
            </button>

            <button
              id="qa-option-water"
              onClick={() => handleSelectOption('water')}
              className="bg-[#0F1117] p-5 rounded-2xl border border-white/5 hover:border-blue-400/30 transition text-left flex flex-col justify-between h-[105px] group cursor-pointer"
            >
              <div className="p-2 w-max rounded-xl bg-blue-400/10 text-blue-400">
                <Droplet size={18} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-white text-xs font-bold">Log Water</span>
                <Plus size={14} className="text-[#A1A1AA]" />
              </div>
            </button>

            <button
              id="qa-option-weight"
              onClick={() => handleSelectOption('weight')}
              className="bg-[#0F1117] p-5 rounded-2xl border border-white/5 hover:border-violet-400/30 transition text-left flex flex-col justify-between h-[105px] group cursor-pointer"
            >
              <div className="p-2 w-max rounded-xl bg-violet-400/10 text-violet-400">
                <Scale size={18} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-white text-xs font-bold">Log Weight</span>
                <span className="text-[10px] text-[#A1A1AA] font-mono">{profile.currentWeightKg}kg</span>
              </div>
            </button>

            <button
              id="qa-option-copy-report"
              onClick={handleCopyToClipboard}
              className={`bg-[#0F1117] p-5 rounded-2xl border border-white/5 transition text-left flex flex-col justify-between h-[105px] group cursor-pointer ${
                copied ? 'border-[#4ADE80]/50 bg-[#4ADE80]/5' : 'hover:border-[#4ADE80]/30'
              }`}
            >
              <div className={`p-2 w-max rounded-xl transition-all duration-300 ${
                copied ? 'bg-[#4ADE80]/20 text-[#4ADE80] scale-105' : 'bg-[#4ADE80]/10 text-[#4ADE80]'
              }`}>
                {copied ? <Check size={18} /> : <Share2 size={18} />}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className={copied ? "text-[#4ADE80] text-xs font-bold" : "text-white text-xs font-bold"}>
                  {copied ? 'Copied! ✅' : 'WhatsApp'}
                </span>
                {!copied && <Plus size={14} className="text-[#A1A1AA]" />}
              </div>
            </button>
          </div>
        ) : activeForm === 'water' ? (
          <div className="space-y-4 pb-2" id="quickadd-water-form">
            <p className="text-[#A1A1AA] text-xs">Choose a dynamic cup size to log water instantly:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                id="qa-water-250"
                onClick={() => handleQuickWater(250)}
                className="bg-[#0F1117] hover:bg-blue-500/15 border border-white/5 p-4 rounded-xl text-center text-xs text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:border-blue-400/30 transition"
              >
                💧 Small (250ml)
              </button>
              <button
                id="qa-water-500"
                onClick={() => handleQuickWater(500)}
                className="bg-[#0F1117] hover:bg-blue-500/15 border border-white/5 p-4 rounded-xl text-center text-xs text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:border-blue-400/30 transition"
              >
                💧 Regular (500ml)
              </button>
              <button
                id="qa-water-750"
                onClick={() => handleQuickWater(750)}
                className="bg-[#0F1117] hover:bg-blue-500/15 border border-white/5 p-4 rounded-xl text-center text-xs text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:border-blue-400/30 transition"
              >
                🥛 Glass (750ml)
              </button>
              <button
                id="qa-water-1000"
                onClick={() => handleQuickWater(1000)}
                className="bg-[#0F1117] hover:bg-blue-500/15 border border-white/5 p-4 rounded-xl text-center text-xs text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:border-blue-400/30 transition"
              >
                🍼 Bottle (1000ml)
              </button>
            </div>
          </div>
        ) : activeForm === 'steps' ? (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const w = profile.currentWeightKg || 77;
              if (stepsMode === 'steps') {
                const s = parseInt(stepsInput) || 0;
                if (s > 0) {
                  addStepsLog(s, undefined);
                  setIsSaved(true);
                  setTimeout(() => handleClose(), 650);
                }
              } else {
                const d = parseInt(durationInput) || 0;
                if (d > 0) {
                  addStepsLog(0, d);
                  setIsSaved(true);
                  setTimeout(() => handleClose(), 650);
                }
              }
            }} 
            className="space-y-4 pb-2" 
            id="quickadd-steps-form"
          >
            {/* Mode Switcher */}
            <div className="flex bg-[#0F1117] p-1 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setStepsMode('steps')}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                  stepsMode === 'steps' ? 'bg-[#1A1D24] text-emerald-400' : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                Walk Steps
              </button>
              <button
                type="button"
                onClick={() => setStepsMode('duration')}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                  stepsMode === 'duration' ? 'bg-[#1A1D24] text-emerald-400' : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                Walking Time (mins)
              </button>
            </div>

            {/* Inputs based on mode */}
            {stepsMode === 'steps' ? (
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="qa-steps-count">Steps Walked</label>
                <input
                  id="qa-steps-count"
                  type="number"
                  min="1"
                  max="50000"
                  required
                  value={stepsInput}
                  onChange={(e) => setStepsInput(e.target.value)}
                  className="bg-[#0F1117] text-white text-sm font-bold p-3.5 rounded-xl border border-white/5 outline-none focus:border-emerald-400 font-mono"
                  placeholder="e.g. 10000"
                />
              </div>
            ) : (
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="qa-steps-duration">Walking Duration (Minutes)</label>
                <input
                  id="qa-steps-duration"
                  type="number"
                  min="1"
                  max="480"
                  required
                  value={durationInput}
                  onChange={(e) => setDurationInput(e.target.value)}
                  className="bg-[#0F1117] text-white text-sm font-bold p-3.5 rounded-xl border border-white/5 outline-none focus:border-emerald-400 font-mono"
                  placeholder="e.g. 10"
                />
              </div>
            )}

            {/* Dynamic Computation Preview Box */}
            <div className="bg-[#0F1117] p-4 rounded-xl border border-emerald-500/10 space-y-2">
              <span className="text-[9px] text-[#A1A1AA] uppercase font-bold tracking-wider block">Est. Metabolic Impact</span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-[#A1A1AA] block">Calories Burned</span>
                  <span className="text-sm font-black text-emerald-400">
                    {stepsMode === 'steps' 
                      ? Math.round((parseInt(stepsInput) || 0) * 0.00055 * (profile.currentWeightKg || 77))
                      : Math.round((parseInt(durationInput) || 0) * 0.05775 * (profile.currentWeightKg || 77))
                    } kcal
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#A1A1AA] block">
                    {stepsMode === 'steps' ? 'Calculated Walk Time' : 'Equivalent Steps'}
                  </span>
                  <span className="text-sm font-black text-white">
                    {stepsMode === 'steps'
                      ? `${Math.round((parseInt(stepsInput) || 0) / 120)} mins`
                      : `${(parseInt(durationInput) || 0) * 120} steps`
                    }
                  </span>
                </div>
              </div>
              <p className="text-[9px] text-[#A1A1AA] leading-relaxed pt-1.5 border-t border-white/5">
                * Calibrated for your vital stats: <b>33 yo, Male, 165cm, {profile.currentWeightKg}kg</b>. average pace (4.0-4.8 km/h).
              </p>
            </div>

            <button
              id="qa-steps-submit"
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl transition cursor-pointer"
            >
              Log Steps Activity
            </button>
          </form>
        ) : (
          <form onSubmit={handleQuickWeightSubmit} className="space-y-4 pb-2" id="quickadd-weight-form">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="qa-weight-input">Body Weight (kg)</label>
              <input
                id="qa-weight-input"
                type="number"
                step="0.1"
                min="30"
                max="300"
                required
                value={quickWeight}
                onChange={(e) => setQuickWeight(e.target.value)}
                className="bg-[#0F1117] text-white text-sm font-bold p-3.5 rounded-xl border border-white/5 outline-none focus:border-violet-400 font-mono"
              />
            </div>
            <button
              id="qa-weight-submit"
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm py-3 rounded-xl transition cursor-pointer"
            >
              Log weight
            </button>
          </form>
        )}
      </BottomSheet>
    </>
  );
}
