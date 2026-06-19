/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { MUSCLE_GROUPS } from '../data/exercises';
import { Plus, Flame, Droplet, Dumbbell, Apple, Sparkles, Trash2, ChevronLeft, ChevronRight, Calendar, Footprints, Activity, Scale, Share2, Check, Timer } from 'lucide-react';
import { getISTDateString } from '../utils/dateUtils';

interface DashboardProps {
  onSetActiveTab: (tab: any) => void;
  onOpenQuickAdd: (type?: 'food' | 'workout' | 'water' | 'weight' | 'steps') => void;
}

export default function DashboardScreen({ onSetActiveTab, onOpenQuickAdd }: DashboardProps) {
  const { state, addWaterLog, deleteFoodLog, deleteWorkoutLog, deleteWaterLog, selectedDate, setSelectedDate, deleteStepsLog, toggleFastingLog } = useAppState();
  const { foodLogs, workoutLogs, waterLogs, weightLogs, stepsLogs = [], fastingLogs = [], profile } = state;

  // Format selectedDate comparison
  const isSelectedDate = (timestampStr: string) => {
    return timestampStr.split('T')[0] === selectedDate;
  };

  const todayFood = foodLogs.filter(log => isSelectedDate(log.timestamp));
  const todayWorkout = workoutLogs.filter(log => isSelectedDate(log.timestamp));
  const todayWater = waterLogs.filter(log => isSelectedDate(log.timestamp));
  const todaySteps = stepsLogs.filter(log => isSelectedDate(log.timestamp));

  // Compute stats
  const consumedCalories = todayFood.reduce((sum, log) => sum + log.calories, 0);
  const consumedProtein = todayFood.reduce((sum, log) => sum + log.protein, 0);
  const burnedActiveWorkout = todayWorkout.reduce((sum, log) => sum + log.caloriesBurned, 0);
  const loggedWater = todayWater.reduce((sum, log) => sum + log.amountMl, 0);

  // Steps Stats
  const stepsToday = todaySteps.reduce((sum, log) => sum + log.steps, 0);
  const stepsMinutes = todaySteps.reduce((sum, log) => sum + (log.durationMinutes || 0), 0);
  const stepsCaloriesBurned = todaySteps.reduce((sum, log) => sum + log.caloriesBurned, 0);

  const burnedTotalCalories = burnedActiveWorkout + stepsCaloriesBurned;

  const netCalories = consumedCalories - burnedTotalCalories;

  const caloricDeficitGoal = profile.caloriesGoal; // e.g. 1800 kcal

  // Circular / Linear Bar percentage utilities
  const getPercent = (value: number, goal: number) => {
    if (!goal) return 0;
    return Math.min(100, Math.round((value / goal) * 100));
  };

  // Helper to format selectedDate nicely
  const getFormattedViewingDate = () => {
    const todayLocal = getISTDateString();
    if (selectedDate === todayLocal) return 'Today';
    
    // Create local Date from YYYY-MM-DD without timezone shifts
    const [year, month, day] = selectedDate.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    
    // Calculate yesterday in IST
    const now = new Date();
    const utcEpoch = now.getTime() + (now.getTimezoneOffset() * 60000);
    const todayIST = new Date(utcEpoch + (3600000 * 5.5));
    todayIST.setDate(todayIST.getDate() - 1);
    const yesterdayLocal = getISTDateString(todayIST);
    
    if (selectedDate === yesterdayLocal) return 'Yesterday';

    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handlePrevDay = () => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() - 1);
    
    // Format back to YYYY-MM-DD manually to prevent offset errors
    const yStr = d.getFullYear();
    const mStr = (d.getMonth() + 1).toString().padStart(2, '0');
    const dStr = d.getDate().toString().padStart(2, '0');
    setSelectedDate(`${yStr}-${mStr}-${dStr}`);
  };

  const handleNextDay = () => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() + 1);
    
    // Format back to YYYY-MM-DD manually
    const yStr = d.getFullYear();
    const mStr = (d.getMonth() + 1).toString().padStart(2, '0');
    const dStr = d.getDate().toString().padStart(2, '0');
    setSelectedDate(`${yStr}-${mStr}-${dStr}`);
  };

  const jumpToToday = () => {
    setSelectedDate(getISTDateString());
  };

  // Derive Weekly Muscle Coverage (Strength workouts in last 7 days from selectedDate)
  const getWeeklyMuscleCoverage = () => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const activeDate = new Date(year, month - 1, day);
    
    const sevenDaysAgo = new Date(activeDate);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentWorkouts = workoutLogs.filter(log => {
      const [ly, lm, ld] = log.timestamp.split('T')[0].split('-').map(Number);
      const logDate = new Date(ly, lm - 1, ld);
      return log.type === 'strength' && logDate >= sevenDaysAgo && logDate <= activeDate;
    });

    const coveredMuscles = new Set<string>();
    recentWorkouts.forEach(log => {
      if (log.muscleGroup) {
        coveredMuscles.add(log.muscleGroup);
      }
    });

    return coveredMuscles;
  };

  const coveredMuscles = getWeeklyMuscleCoverage();

  // Calculated start weight, fallback to historical weight entry if profile value is missing
  const startWeight = profile.initialWeightKg ?? (weightLogs.length > 0 ? weightLogs[0].weightKg : profile.currentWeightKg);
  const currentWeight = profile.currentWeightKg;
  const targetWeight = profile.targetWeightKg;

  let weightProgressPercent = 0;
  if (startWeight === targetWeight) {
    weightProgressPercent = 100;
  } else {
    const losing = targetWeight < startWeight;
    if (losing) {
      if (currentWeight <= targetWeight) weightProgressPercent = 100;
      else if (currentWeight >= startWeight) weightProgressPercent = 0;
      else {
        weightProgressPercent = Math.round(((startWeight - currentWeight) / (startWeight - targetWeight)) * 100);
      }
    } else {
      if (currentWeight >= targetWeight) weightProgressPercent = 100;
      else if (currentWeight <= startWeight) weightProgressPercent = 0;
      else {
        weightProgressPercent = Math.round(((currentWeight - startWeight) / (targetWeight - startWeight)) * 100);
      }
    }
  }

  // Calculate dynamic stats
  const weightDistanceToGoal = Math.abs(currentWeight - targetWeight).toFixed(1);

  // 1. Calculate weekDays (Mon-Sun) containing `selectedDate`
  const getWeekDays = () => {
    const [sYear, sMonth, sDay] = selectedDate.split('-').map(Number);
    const currentRefDate = new Date(sYear, sMonth - 1, sDay);
    
    const dayOfWeek = currentRefDate.getDay(); 
    // Monday is 1, Sunday is 0. If Sunday, go back 6 days. Otherwise go back dayOfWeek - 1.
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const mondayDate = new Date(currentRefDate);
    mondayDate.setDate(currentRefDate.getDate() - daysToMonday);

    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const days = [];
    const todayLocalStr = getISTDateString();

    for (let i = 0; i < 7; i++) {
      const d = new Date(mondayDate);
      d.setDate(mondayDate.getDate() + i);
      
      const yStr = d.getFullYear();
      const mStr = (d.getMonth() + 1).toString().padStart(2, '0');
      const dStr = d.getDate().toString().padStart(2, '0');
      const dateKey = `${yStr}-${mStr}-${dStr}`;

      // Check fitness log completions: workout logged or steps count >= 10,000 for that date
      const isWorkoutLogged = workoutLogs.some(log => log.timestamp.split('T')[0] === dateKey);
      const stepsForDay = stepsLogs.filter(log => log.timestamp.split('T')[0] === dateKey).reduce((sum, log) => sum + log.steps, 0);
      const hasWorkout = isWorkoutLogged || stepsForDay >= 10000;
      const hasFasting = fastingLogs.includes(dateKey);
      const isCompleted = hasWorkout || hasFasting;

      days.push({
        label: dayLabels[i],
        dateKey,
        isCompleted,
        hasWorkout,
        hasFasting,
        isToday: dateKey === todayLocalStr,
        isViewing: dateKey === selectedDate,
        dayNum: d.getDate(),
      });
    }
    return days;
  };

  const weekDays = getWeekDays();
  const currentWeekStreak = weekDays.filter(d => d.isCompleted).length;

  return (
    <div className="space-y-4" id="dashboard-screen">
      {/* Sleek Header & Integrated Date Slider */}
      <div id="header-and-backtrack-bar">
        <div className="flex flex-col bg-[#1A1D24] p-5 rounded-[24px] border border-white/5 shadow-xl gap-3.5" id="dashboard-hero-header">
          {/* Top row: Brand -> Space-saving Integrated Date Selector Pill -> Profile Badge */}
          <div className="flex justify-between items-center w-full gap-1.5">
            <h1 className="text-lg xs:text-xl sm:text-2xl font-black bg-gradient-to-r from-white to-[#A1A1AA] bg-clip-text text-transparent tracking-tight whitespace-nowrap">
              FitTrack
            </h1>

            {/* Integrated Date Switcher Pill */}
            <div className="flex items-center bg-[#0F1117] p-1 rounded-full border border-white/5 shadow-inner" id="header-date-pill">
              {/* Prev Button */}
              <button
                onClick={handlePrevDay}
                className="p-1.5 hover:bg-white/5 rounded-full text-white/70 hover:text-[#4ADE80] transition active:scale-90"
                title="Previous Day"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Clickable Date display with hidden native picker trigger overlay */}
              <div className="relative flex items-center gap-1 px-1.5 py-0.5 text-[#A1A1AA] hover:text-white transition">
                <input
                  id="header-date-picker"
                  type="date"
                  value={selectedDate}
                  max={getISTDateString()}
                  onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-15"
                />
                <Calendar size={13} className="text-[#4ADE80] shrink-0" />
                <span className="text-[11px] font-extrabold tracking-tight whitespace-nowrap select-none font-sans">
                  {selectedDate === getISTDateString() ? 'Today' : getFormattedViewingDate()}
                </span>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextDay}
                disabled={selectedDate === getISTDateString()}
                className="p-1.5 hover:bg-white/5 rounded-full text-white/70 hover:text-[#4ADE80] disabled:opacity-10 disabled:pointer-events-none transition active:scale-90"
                title="Next Day"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Simple quick return back to today button if viewing historical dates */}
              {selectedDate !== getISTDateString() && (
                <button 
                  id="jump-today-btn"
                  onClick={jumpToToday}
                  className="bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/20 text-[10px] px-2 py-1 rounded-full font-bold transition hover:bg-[#4ADE80]/25 cursor-pointer active:scale-95"
                >
                  Today
                </button>
              )}
              <div 
                onClick={() => onSetActiveTab('profile')} 
                className="flex items-center gap-1 bg-[#0F1117] p-1.5 px-2.5 rounded-full border border-white/5 cursor-pointer hover:bg-white/5 transition"
                id="profile-shortcut"
              >
                <div className="w-1 h-1 rounded-full bg-[#40C057] animate-pulse" />
                <span className="text-xs text-white font-bold font-mono">{profile.currentWeightKg}kg</span>
              </div>
            </div>
          </div>

          {/* Weight goal progress bar - Interactive weight tracking link */}
          <div 
            id="weight-progress-banner"
            onClick={() => onSetActiveTab('weight')}
            className="bg-[#0F1117]/60 hover:bg-[#151821] py-3 px-4 rounded-[18px] border border-white/5 hover:border-violet-500/25 cursor-pointer transition flex flex-col gap-2 group"
          >
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <div className="flex items-baseline gap-1">
                <span className="text-[#A1A1AA] text-[90%] uppercase font-bold tracking-widest text-[9px]">Start</span>
                <span className="text-zinc-300 font-bold font-mono">{startWeight} kg</span>
              </div>
              
              <div className="flex items-center gap-1 font-bold">
                <span className="text-violet-400 text-[11px] sm:text-xs bg-violet-500/15 px-2 py-0.5 rounded-full tracking-tight">
                  {currentWeight} kg
                </span>
                <span className="text-[10px] text-violet-300/70 font-mono font-medium">({weightProgressPercent}%)</span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-[#A1A1AA] text-[90%] uppercase font-bold tracking-widest text-[9px]">Target</span>
                <span className="text-[#4ADE80] font-extrabold font-mono">{targetWeight} kg</span>
              </div>
            </div>

            <div className="w-full h-1.5 bg-[#0F1117] rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-[#9C27B0] rounded-full transition-all duration-550"
                style={{ width: `${weightProgressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Activity Streak Bar */}
      <div className="bg-[#1A1D24] p-3 rounded-[24px] border border-white/5 shadow-xl" id="weekly-streak-bar">
        <div className="grid grid-cols-7 gap-1 sm:gap-3" id="streak-days-grid">
          {weekDays.map(({ label, dateKey, isCompleted, hasWorkout, hasFasting, isToday, isViewing, dayNum }) => {
            return (
              <button
                key={dateKey}
                onClick={() => setSelectedDate(dateKey)}
                className={`flex flex-col items-center gap-1.5 p-1 rounded-xl transition-all duration-200 cursor-pointer text-center group relative`}
                id={`streak-day-btn-${label.toLowerCase()}`}
                title={`${label} (${dayNum}): Fasting: ${hasFasting ? '✅ Done' : '❌ No'}, Workout: ${hasWorkout ? '✅ Done' : '❌ No'}`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  isViewing ? 'text-[#4ADE80]' : 'text-[#A1A1AA]/60'
                }`}>
                  {label}
                </span>

                <div 
                  className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-full flex overflow-hidden relative transition-all duration-300 ${
                    isViewing
                      ? 'ring-2 ring-[#4ADE80] ring-offset-2 ring-offset-[#1A1D24]'
                      : isToday
                        ? 'ring-1 ring-violet-500/40'
                        : 'border border-white/5'
                  }`}
                >
                  {/* Left Half: Intermittent Fasting (Amber status/grey) */}
                  <div 
                    className={`w-1/2 h-full transition-all duration-300 ${
                      hasFasting 
                        ? 'bg-gradient-to-br from-amber-400 to-[#F59E0B]' 
                        : 'bg-[#0F1117]/80'
                    }`}
                  />

                  {/* Right Half: Workout (Violet/Purple status/grey) */}
                  <div 
                    className={`w-1/2 h-full transition-all duration-300 ${
                      hasWorkout 
                        ? 'bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9]' 
                        : 'bg-[#0F1117]/80'
                    }`}
                  />

                  {/* Centered Indicator Day Circle */}
                  <div 
                    className={`absolute inset-0 m-auto w-5 h-5 xs:w-6 xs:h-6 rounded-full flex items-center justify-center text-[9px] xs:text-[10px] font-sans font-extrabold transition-all duration-300 z-10 ${
                      isViewing
                        ? 'bg-[#1A1D24] text-[#4ADE80]'
                        : isToday
                          ? 'bg-[#1A1D24]/95 text-violet-400'
                          : 'bg-[#1A1D24]/90 text-[#A1A1AA]'
                    }`}
                  >
                    {dayNum}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Key Macro trackers - optimized side-by-side on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5" id="dashboard-bento-grid">
        {/* Calorie Hub Card */}
        {(() => {
          const isFastingCompleted = fastingLogs.includes(selectedDate);
          return (
            <div 
              id="bento-calories-hub"
              onClick={() => onSetActiveTab('food')}
              className="bg-[#1A1D24] p-3.5 sm:p-5 rounded-[24px] border border-white/5 hover:border-[#4ADE80]/30 cursor-pointer transition flex flex-col justify-between h-[145px] sm:h-[165px]"
            >
              <div className="flex justify-between items-center gap-2">
                <div className="min-w-0 flex-1">
                  <span className="text-[#A1A1AA] text-[10px] sm:text-xs font-bold uppercase tracking-wider block truncate">Calorie Hub</span>
                  <p className="text-xl xs:text-2xl sm:text-3xl font-black text-white mt-0.5 sm:mt-1 leading-none">
                    {netCalories}<span className="text-[10px] sm:text-xs font-semibold text-[#A1A1AA] ml-1">Net</span>
                  </p>
                </div>

                {/* Prominent Fasting Quick Toggle with Pop Colors on the Right */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFastingLog(selectedDate);
                  }}
                  className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 cursor-pointer shadow-md shrink-0 border text-center ${
                    isFastingCompleted 
                      ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white font-extrabold border-amber-300 shadow-amber-500/20' 
                      : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/10 hover:border-amber-400/30'
                  }`}
                  title="Toggle Intermittent Fasting Status"
                >
                  <div className="flex items-center gap-1">
                    <Timer size={10} className={isFastingCompleted ? 'animate-spin-[duration:10s]' : ''} />
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest leading-none">
                      {isFastingCompleted ? 'FASTED' : 'FAST'}
                    </span>
                  </div>
                  <span className="text-[7px] sm:text-[8px] opacity-80 uppercase tracking-tight font-bold mt-0.5 block leading-none">
                    {isFastingCompleted ? 'Done ✅' : 'Log Fast'}
                  </span>
                </button>
              </div>
              <div>
                <div className="flex justify-between text-xs sm:text-sm text-[#A1A1AA] mb-1.5 font-mono">
                  <span className="truncate">C: <span className="text-[#4ADE80] font-bold">{consumedCalories}</span> | B: <span className="text-red-400 font-bold">{burnedTotalCalories}</span></span>
                  <span className="font-bold text-[#4ADE80]">{getPercent(consumedCalories, profile.caloriesGoal)}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#0F1117] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#4ADE80] to-[#2ECC71] rounded-full"
                    style={{ width: `${getPercent(consumedCalories, profile.caloriesGoal)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })()}

        {/* Protein Card */}
        <div 
          id="bento-protein"
          onClick={() => onSetActiveTab('food')}
          className="bg-[#1A1D24] p-4 sm:p-5 rounded-[24px] border border-white/5 hover:border-sky-400/30 cursor-pointer transition flex flex-col justify-between h-[145px] sm:h-[165px]"
        >
          <div className="flex justify-between items-start">
            <div className="min-w-0 flex-1">
              <span className="text-[#A1A1AA] text-xs sm:text-sm font-bold uppercase tracking-wider block truncate">Protein Today</span>
              <p className="text-xl xs:text-2xl sm:text-3xl font-black text-white mt-1 leading-none">
                {consumedProtein}g<span className="text-xs sm:text-sm font-semibold text-[#A1A1AA]">/{profile.proteinGoal}g</span>
              </p>
            </div>
            <div className="p-1.5 sm:p-2 bg-sky-400/10 text-sky-400 rounded-xl flex-shrink-0 ml-1">
              <Flame size={16} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs sm:text-sm text-[#A1A1AA] mb-1.5">
              <span className="truncate">Left: <b className="text-white font-mono">{Math.max(0, profile.proteinGoal - consumedProtein)}g</b></span>
              <span className="font-bold text-sky-400">{getPercent(consumedProtein, profile.proteinGoal)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#0F1117] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sky-400 to-[#3498DB] rounded-full"
                style={{ width: `${getPercent(consumedProtein, profile.proteinGoal)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Steps Tracker Card */}
        <div 
          id="bento-steps-tracker"
          className="bg-[#1A1D24] p-4 sm:p-5 rounded-[24px] border border-white/5 hover:border-emerald-400/20 transition flex flex-col justify-between h-[145px] sm:h-[165px]"
        >
          <div className="flex justify-between items-start">
            <div className="min-w-0 flex-1">
              <span className="text-[#A1A1AA] text-xs sm:text-sm font-bold uppercase tracking-wider block truncate">Steps Tracker</span>
              <p className="text-xl xs:text-2xl sm:text-3xl font-black text-emerald-400 mt-1 leading-none">
                {stepsToday.toLocaleString()}<span className="text-xs sm:text-sm font-medium text-[#A1A1AA]"> /10k</span>
              </p>
            </div>
            <button 
              id="steps-direct-add-btn"
              onClick={() => window.dispatchEvent(new CustomEvent('open-quick-add', { detail: { type: 'steps' } }))}
              className="p-2 sm:p-2 bg-emerald-500/10 text-[#4ADE80] rounded-xl hover:bg-emerald-500/20 transition cursor-pointer active:scale-90"
              title="Quick Log Steps"
            >
              <Plus size={16} />
            </button>
          </div>
          <div>
            <div className="flex justify-between text-xs sm:text-sm text-[#A1A1AA] mb-1.5 font-mono">
              <span className="truncate">{stepsCaloriesBurned} kcal • {stepsMinutes}m walk</span>
              <span className="font-bold text-[#4ADE80]">{getPercent(stepsToday, 10000)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#0F1117] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-[#4ADE80] rounded-full"
                style={{ width: `${getPercent(stepsToday, 10000)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Water Track Card with in-line Quick Adds */}
        <div 
          id="bento-water"
          className="bg-[#1A1D24] p-4 sm:p-5 rounded-[24px] border border-white/5 flex flex-col justify-between h-[145px] sm:h-[165px]"
        >
          <div className="flex justify-between items-start">
            <div className="min-w-0 flex-1">
              <span className="text-[#A1A1AA] text-xs sm:text-sm font-bold uppercase tracking-wider block truncate">Water registered</span>
              <p className="text-xl xs:text-2xl sm:text-3xl font-black text-blue-400 mt-1 leading-none">
                {loggedWater}<span className="text-xs sm:text-sm font-normal text-[#A1A1AA]">/{profile.waterGoalMl}ml</span>
              </p>
            </div>
            <div className="p-1.5 sm:p-2 bg-blue-400/10 text-blue-400 rounded-xl flex-shrink-0 ml-1">
              <Droplet size={16} />
            </div>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-between text-xs sm:text-sm text-[#A1A1AA]">
              <span className="hidden sm:inline">Tap to log:</span>
              <span className="font-bold text-blue-400">{getPercent(loggedWater, profile.waterGoalMl)}%</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5" id="dashboard-water-quickadds">
              <button 
                id="water-quick-250"
                onClick={() => addWaterLog(250)}
                className="bg-[#0F1117] hover:bg-blue-900/40 text-xs text-blue-300 font-bold py-1.5 rounded-lg border border-blue-400/10 transition flex items-center justify-center cursor-pointer active:scale-95"
              >
                250
              </button>
              <button 
                id="water-quick-500"
                onClick={() => addWaterLog(500)}
                className="bg-[#0F1117] hover:bg-blue-900/40 text-xs text-blue-300 font-bold py-1.5 rounded-lg border border-blue-400/10 transition flex items-center justify-center cursor-pointer active:scale-95"
              >
                500
              </button>
              <button 
                id="water-quick-750"
                onClick={() => addWaterLog(750)}
                className="bg-[#0F1117] hover:bg-blue-900/40 text-xs text-blue-300 font-bold py-1.5 rounded-lg border border-blue-400/10 transition flex items-center justify-center cursor-pointer active:scale-95"
              >
                750
              </button>
              <button 
                id="water-quick-1000"
                onClick={() => addWaterLog(1000)}
                className="bg-[#0F1117] hover:bg-blue-900/40 text-xs text-blue-300 font-bold py-1.5 rounded-lg border border-blue-400/10 transition flex items-center justify-center cursor-pointer active:scale-95"
              >
                1L
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Weekly Muscle Coverage */}
      <div className="bg-[#1A1D24] p-5 rounded-[24px] border border-white/5" id="dashboard-muscle-coverage">
        <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Weekly Muscle Coverage</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5" id="muscle-pills-list">
          {MUSCLE_GROUPS.map((muscle) => {
            const covered = coveredMuscles.has(muscle);
            return (
              <div
                id={`muscle-badge-${muscle.toLowerCase()}`}
                key={muscle}
                className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-medium transition ${
                  covered 
                    ? 'bg-[#4ADE80]/10 border-[#4ADE80]/30 text-[#4ADE80]' 
                    : 'bg-[#0F1117] border-white/5 text-[#A1A1AA]'
                }`}
              >
                <span>{muscle}</span>
                <span className="text-sm font-bold">{covered ? '✓' : '✗'}</span>
              </div>
            );
          })}
        </div>
        <p className="text-[#A1A1AA] text-[10px] mt-3">
          * Indicates muscle groups trained via Strength logs in the last 7 days.
        </p>
      </div>

      {/* Lists of today's items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dashboard-todays-activity">
        {/* Today's Food Logs */}
        <div className="bg-[#1A1D24] p-5 rounded-[24px] border border-white/5" id="todays-food-logs-cell">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
              <Apple size={16} className="text-[#4ADE80]" /> Today's Foods
            </h3>
            <button
              id="dashboard-add-food-btn"
              onClick={() => onOpenQuickAdd('food')}
              className="text-[#4ADE80] bg-[#4ADE80]/10 hover:bg-[#4ADE80]/20 text-xs font-semibold px-3 py-1.5 rounded-full transition cursor-pointer"
            >
              + Log Food
            </button>
          </div>

          {todayFood.length === 0 ? (
            <div className="bg-[#0F1117] p-8 rounded-2xl border border-white/5 text-center text-[#A1A1AA] text-xs">
              No food logs registered today. Tap + Log Food to fuel your active targets!
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1" id="todays-food-elements">
              {todayFood.map((log) => (
                <div 
                  key={log.id} 
                  className="bg-[#0F1117] p-3 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-[#4ADE80]/10 transition"
                  id={`dashboard-food-item-${log.id}`}
                >
                  <div className="text-left">
                    <p className="text-xs text-white font-medium">{log.name}</p>
                    <p className="text-[10px] text-[#A1A1AA] mt-0.5">
                      {log.qty} {log.qtyType} • {log.protein}g protein
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white font-bold">{log.calories} kcal</span>
                    <button
                      id={`delete-food-log-${log.id}`}
                      onClick={() => deleteFoodLog(log.id)}
                      className="text-[#EF4444] p-1.5 rounded-lg hover:bg-[#EF4444]/10 transition opacity-80 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Workout Logs */}
        <div className="bg-[#1A1D24] p-5 rounded-[24px] border border-white/5" id="todays-workout-logs-cell">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
              <Dumbbell size={16} className="text-red-400" /> Today's Workouts
            </h3>
            <button
              id="dashboard-add-workout-btn"
              onClick={() => onOpenQuickAdd('workout')}
              className="text-red-400 bg-red-400/10 hover:bg-red-400/20 text-xs font-semibold px-3 py-1.5 rounded-full transition cursor-pointer"
            >
              + Log Workout
            </button>
          </div>

          {todayWorkout.length === 0 ? (
            <div className="bg-[#0F1117] p-8 rounded-2xl border border-white/5 text-center text-[#A1A1AA] text-xs">
              No workout logs registered today. Build muscle by logging a session!
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1" id="todays-workout-elements">
              {todayWorkout.map((log) => (
                <div 
                  key={log.id} 
                  className="bg-[#0F1117] p-3 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-red-400/10 transition"
                  id={`dashboard-workout-item-${log.id}`}
                >
                  <div className="text-left">
                    <p className="text-xs text-white font-medium">{log.exerciseName}</p>
                    <p className="text-[10px] text-[#A1A1AA] mt-0.5">
                      {log.type === 'strength' 
                        ? `${log.muscleGroup} • ${log.sets} sets x ${log.reps} reps (${log.weight}kg)`
                        : `Cardio • ${log.duration} mins`
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-red-400 font-bold">-{log.caloriesBurned} kcal</span>
                    <button
                      id={`delete-workout-log-${log.id}`}
                      onClick={() => deleteWorkoutLog(log.id)}
                      className="text-[#EF4444] p-1.5 rounded-lg hover:bg-[#EF4444]/10 transition opacity-80 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Step Logs */}
        <div className="col-span-1 lg:col-span-2 bg-[#1A1D24] p-5 rounded-[24px] border border-white/5" id="todays-steps-logs-cell">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
              <Footprints size={16} className="text-emerald-400" /> Today's Steps & Walks
            </h3>
            <button
              id="dashboard-add-steps-btn"
              onClick={() => window.dispatchEvent(new CustomEvent('open-quick-add', { detail: { type: 'steps' } }))}
              className="text-[#4ADE80] bg-[#4ADE80]/10 hover:bg-[#4ADE80]/20 text-xs font-semibold px-3 py-1.5 rounded-full transition cursor-pointer"
            >
              + Log Steps
            </button>
          </div>

          {todaySteps.length === 0 ? (
            <div className="bg-[#0F1117] p-8 rounded-2xl border border-white/5 text-center text-[#A1A1AA] text-xs">
              No walking or steps logged today. Walk a bit and record it to see your progress!
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1" id="todays-steps-elements">
              {todaySteps.map((log) => (
                <div 
                  key={log.id} 
                  className="bg-[#0F1117] p-3 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-[#4ADE80]/10 transition"
                  id={`dashboard-steps-item-${log.id}`}
                >
                  <div className="text-left">
                    <p className="text-xs text-white font-semibold">
                      {log.steps > 0 ? `${log.steps.toLocaleString()} Steps` : `${log.durationMinutes} minutes Walk`}
                    </p>
                    <p className="text-[10px] text-[#A1A1AA] mt-0.5">
                      {log.steps > 0 
                        ? `Equivalent walk duration: ~${Math.round(log.steps / 120)} mins`
                        : `Equivalent steps walked: ~${(log.durationMinutes || 0) * 120} steps`
                      } • Calibrated for Indian male active goals
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs text-emerald-400 font-bold">-{log.caloriesBurned} kcal</span>
                      <span className="text-[9px] text-[#A1A1AA] block font-mono">
                        {log.timestamp.split('T')[1]?.substring(0, 5) || 'Walk'}
                      </span>
                    </div>
                    <button
                      id={`delete-steps-log-${log.id}`}
                      onClick={() => deleteStepsLog(log.id)}
                      className="text-[#EF4444] p-1.5 rounded-lg hover:bg-[#EF4444]/10 transition opacity-80 cursor-pointer"
                      title="Delete Entry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
