/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAppState } from '../hooks/useAppState';
import { BUILT_IN_STRENGTH, BUILT_IN_CARDIO, MUSCLE_GROUPS } from '../data/exercises';
import { calculateStrengthCalories, calculateCardioCalories } from '../utils/caloriesEngine';
import { MuscleGroup } from '../types';
import { Search, Flame, Dumbbell, Compass, CheckCircle, Activity, Trash2, ShieldAlert, Timer, Play, Pause, RotateCcw } from 'lucide-react';

export default function WorkoutScreen() {
  const { state, addWorkoutLog, deleteWorkoutLog } = useAppState();
  const { workoutLogs, profile } = state;

  const [activeSubTab, setActiveSubTab] = useState<'strength' | 'cardio'>('strength');
  const [searchQuery, setSearchQuery] = useState('');

  // REST TIMER STATE
  const [restDuration, setRestDuration] = useState<number>(90); // default 90s
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [autoStartTimer, setAutoStartTimer] = useState<boolean>(true);

  // Timer interval logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            // Trigger haptic
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200, 100, 300]);
            }
            try {
              // Beep tone feedback
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const oscillator = audioCtx.createOscillator();
              const gainNode = audioCtx.createGain();
              oscillator.connect(gainNode);
              gainNode.connect(audioCtx.destination);
              oscillator.type = 'sine';
              oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
              gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
              oscillator.start();
              oscillator.stop(audioCtx.currentTime + 0.5);
            } catch (e) {
              console.log('Audio synthesis error:', e);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timeLeft]);

  const startRestTimer = (duration: number) => {
    setTimeLeft(duration);
    setTimerRunning(true);
  };

  const toggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(restDuration);
      setTimerRunning(true);
    } else {
      setTimerRunning(!timerRunning);
    }
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(0);
  };

  // 1. STRENGTH WORKOUT FORM STATE
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup>('Chest');
  const [exerciseName, setExerciseName] = useState('Pec Deck Fly');
  const [weightKg, setWeightKg] = useState<number | string>(50);
  const [sets, setSets] = useState<number>(5);
  const [reps, setReps] = useState<number>(10);
  const [strengthCalories, setStrengthCalories] = useState<number>(0);

  // 2. CARDIO WORKOUT FORM STATE
  const [cardioName, setCardioName] = useState('Elliptical Trainer');
  const [cardioDuration, setCardioDuration] = useState<number | string>(40);
  const [cardioCalories, setCardioCalories] = useState<number>(0);

  // Recalculate Strength calories on input changes
  useEffect(() => {
    const numWeight = parseFloat(String(weightKg)) || 0;
    const cal = calculateStrengthCalories(sets, reps, numWeight, profile);
    setStrengthCalories(cal);
  }, [sets, reps, weightKg, profile]);

  // Recalculate Cardio calories on input changes
  useEffect(() => {
    const numDuration = parseInt(String(cardioDuration)) || 0;
    const cal = calculateCardioCalories(numDuration, cardioName, profile);
    setCardioCalories(cal);
  }, [cardioDuration, cardioName, profile]);

  // Handle template selection
  const selectStrengthTemplate = (item: typeof BUILT_IN_STRENGTH[0]) => {
    setExerciseName(item.name);
    setSelectedMuscle(item.muscleGroup);
    setWeightKg(item.defaultWeight);
    setSets(item.defaultSets);
    setReps(item.defaultReps);
  };

  const selectCardioTemplate = (item: typeof BUILT_IN_CARDIO[0]) => {
    setCardioName(item.name);
    setCardioDuration(item.defaultDuration);
  };

  // Submit log
  const handleLogStrength = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseName.trim()) return;

    addWorkoutLog({
      type: 'strength',
      exerciseName,
      muscleGroup: selectedMuscle,
      weight: parseFloat(String(weightKg)) || 0,
      sets,
      reps,
      caloriesBurned: strengthCalories
    });

    if (autoStartTimer) {
      startRestTimer(restDuration);
    }

    // Simple confirmation or reset
    setExerciseName('');
  };

  const handleLogCardio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardioName.trim()) return;

    addWorkoutLog({
      type: 'cardio',
      exerciseName: cardioName,
      duration: parseInt(String(cardioDuration)) || 0,
      caloriesBurned: cardioCalories
    });

    // Reset card name back to default
    setCardioName('');
  };

  // Filter templates
  const filteredStrengthTemplates = BUILT_IN_STRENGTH.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = item.muscleGroup === selectedMuscle || searchQuery.trim() !== '';
    return matchesSearch && matchesCategory;
  });

  const filteredCardioTemplates = BUILT_IN_CARDIO.filter(item => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6" id="workout-screen">
      {/* Tab Selectors */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" id="workout-tabs-bar">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Dumbbell size={20} className="text-red-400" /> Active Workout Logger
          </h1>
          <p className="text-xs text-[#A1A1AA]">Log your resistance sets or aerobic activities to keep tabs on energy burn.</p>
        </div>
        <div className="flex bg-[#1A1D24] p-1 rounded-full border border-white/5 w-full sm:w-auto" id="strength-cardio-filter">
          <button
            id="tab-btn-strength"
            onClick={() => { setActiveSubTab('strength'); setSearchQuery(''); }}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-full text-xs font-semibold transition ${
              activeSubTab === 'strength' ? 'bg-red-500 text-white font-bold' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Strength Training
          </button>
          <button
            id="tab-btn-cardio"
            onClick={() => { setActiveSubTab('cardio'); setSearchQuery(''); }}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-full text-xs font-semibold transition ${
              activeSubTab === 'cardio' ? 'bg-red-500 text-white font-bold' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Cardio Sessions
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="workout-grid-layout">
        {/* LEFT COLUMN: ACTIVE LOGGER FORM */}
        <div className="lg:col-span-7 bg-[#1A1D24] p-6 rounded-[24px] border border-white/5 space-y-5" id="workout-form-card">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
            <Activity size={16} className="text-red-400 animate-pulse" /> Live Session Parameters
          </h3>

          {activeSubTab === 'strength' ? (
            <form onSubmit={handleLogStrength} className="space-y-4" id="strength-logging-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5 animate-fadeIn">
                  <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="strength-exercise">Exercise Name</label>
                  <input
                    id="strength-exercise"
                    type="text"
                    required
                    placeholder="e.g. Pec Deck Bench Press"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    className="bg-[#0F1117] text-white text-xs p-3.5 rounded-xl border border-white/5 focus:border-red-400 outline-none font-medium"
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="strength-muscle">Target Muscle Group</label>
                  <select
                    id="strength-muscle"
                    value={selectedMuscle}
                    onChange={(e) => setSelectedMuscle(e.target.value as MuscleGroup)}
                    className="bg-[#0F1117] text-white text-xs p-3.5 rounded-xl border border-white/5 outline-none cursor-pointer"
                  >
                    {MUSCLE_GROUPS.map(muscle => (
                      <option key={muscle} value={muscle}>{muscle}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Slider Inputs for Sets, Reps, Weight */}
              <div className="space-y-4 pt-2">
                {/* Weight Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#A1A1AA]">Weight Load</span>
                    <span className="text-white font-bold">{weightKg} kg</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <input
                      id="strength-weight-range"
                      type="range"
                      min="0"
                      max="200"
                      step="2.5"
                      value={parseFloat(String(weightKg)) || 0}
                      onChange={(e) => setWeightKg(e.target.value)}
                      className="flex-1 accent-red-400 h-1.5 bg-[#0F1117] rounded-all cursor-pointer"
                    />
                    <input
                      id="strength-weight-num"
                      type="text"
                      inputMode="decimal"
                      value={weightKg}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^\d*\.?\d*$/.test(val)) {
                          setWeightKg(val);
                        }
                      }}
                      className="w-16 bg-[#0F1117] text-white text-center text-xs p-1.5 rounded-lg border border-white/5"
                    />
                  </div>
                </div>

                {/* Sets Input */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#A1A1AA]">Sets</span>
                      <span className="text-white font-bold">{sets}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        id="set-minus-btn"
                        type="button"
                        onClick={() => setSets(Math.max(1, sets - 1))}
                        className="bg-[#0F1117] text-white w-9 h-9 rounded-lg border border-white/5 hover:bg-white/5 text-sm font-semibold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="flex-1 bg-[#0F1117] text-white text-center text-xs flex items-center justify-center rounded-lg font-bold">
                        {sets} sets
                      </span>
                      <button
                        id="set-plus-btn"
                        type="button"
                        onClick={() => setSets(sets + 1)}
                        className="bg-[#0F1117] text-white w-9 h-9 rounded-lg border border-white/5 hover:bg-white/5 text-sm font-semibold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Reps Input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#A1A1AA]">Reps</span>
                      <span className="text-white font-bold">{reps}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        id="rep-minus-btn"
                        type="button"
                        onClick={() => setReps(Math.max(1, reps - 1))}
                        className="bg-[#0F1117] text-white w-9 h-9 rounded-lg border border-white/5 hover:bg-white/5 text-sm font-semibold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="flex-1 bg-[#0F1117] text-white text-center text-xs flex items-center justify-center rounded-lg font-bold">
                        {reps} reps
                      </span>
                      <button
                        id="rep-plus-btn"
                        type="button"
                        onClick={() => setReps(reps + 1)}
                        className="bg-[#0F1117] text-white w-9 h-9 rounded-lg border border-white/5 hover:bg-white/5 text-sm font-semibold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Recalculating Burn Banner */}
              <div className="bg-[#0F1117] p-4 rounded-2xl border border-red-500/15 flex justify-between items-center" id="strength-burn-calc-preview">
                <div>
                  <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">Dynamic Estimated Burn</span>
                  <p className="text-lg font-extrabold text-red-400 mt-0.5 flex items-center gap-1.5">
                    <Flame size={16} /> {strengthCalories} kcal
                  </p>
                </div>
                <div className="text-[10px] text-right text-[#A1A1AA]">
                  Adapts based on current body<br />weight ({profile.currentWeightKg}kg)
                </div>
              </div>

              <button
                id="log-strength-submit-btn"
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold text-sm py-3.5 rounded-xl transition shadow-lg cursor-pointer"
              >
                Log Strength Exercise
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogCardio} className="space-y-4" id="cardio-logging-form">
              <div className="flex flex-col space-y-1.5 animate-fadeIn">
                <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="cardio-exercise">Cardio Activity</label>
                <input
                  id="cardio-exercise"
                  type="text"
                  required
                  placeholder="e.g. Elliptical Trainer high intensity"
                  value={cardioName}
                  onChange={(e) => setCardioName(e.target.value)}
                  className="bg-[#0F1117] text-white text-xs p-3.5 rounded-xl border border-white/5 focus:border-red-400 outline-none font-medium"
                />
              </div>

              {/* Duration Slider */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#A1A1AA]">Active Duration</span>
                  <span className="text-white font-bold">{cardioDuration} minutes</span>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    id="cardio-duration-range"
                    type="range"
                    min="5"
                    max="180"
                    step="1"
                    value={parseInt(String(cardioDuration)) || 0}
                    onChange={(e) => setCardioDuration(e.target.value)}
                    className="flex-1 accent-red-400 h-1.5 bg-[#0F1117] rounded-all cursor-pointer"
                  />
                  <input
                    id="cardio-duration-num"
                    type="text"
                    inputMode="numeric"
                    value={cardioDuration}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^\d*$/.test(val)) {
                        setCardioDuration(val);
                      }
                    }}
                    className="w-16 bg-[#0F1117] text-white text-center text-xs p-1.5 rounded-lg border border-white/5"
                  />
                </div>
              </div>

              {/* Dynamic Recalculating Burn Banner */}
              <div className="bg-[#0F1117] p-4 rounded-2xl border border-red-500/15 flex justify-between items-center" id="cardio-burn-calc-preview">
                <div>
                  <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">Dynamic Estimated Burn</span>
                  <p className="text-lg font-extrabold text-red-400 mt-0.5 flex items-center gap-1.5">
                    <Flame size={16} /> {cardioCalories} kcal
                  </p>
                </div>
                <div className="text-[10px] text-right text-[#A1A1AA]">
                  Adapts based on current body<br />weight ({profile.currentWeightKg}kg)
                </div>
              </div>

              <button
                id="log-cardio-submit-btn"
                type="submit"
                className="w-full bg-red-400 hover:bg-red-500 text-white font-bold text-sm py-3.5 rounded-xl transition shadow-lg cursor-pointer animate-scale"
              >
                Log Cardio Session
              </button>
            </form>
          )}
        </div>

        {/* RIGHT COLUMN: PRESETS AND TEMPLATES SEARCH */}
        <div className="lg:col-span-5 flex flex-col bg-[#1A1D24] p-5.5 rounded-[24px] border border-white/5 space-y-4" id="workout-templates-panel">
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Templates & Presets</h3>
            <p className="text-[#A1A1AA] text-xs">Tap a built-in pre-populated plan to load defaults instantly</p>
          </div>

          <div className="relative" id="template-search">
            <Search className="absolute left-3.5 top-3 text-[#A1A1AA]" size={14} />
            <input
              id="template-search-input"
              type="text"
              placeholder={`Search ${activeSubTab === 'strength' ? 'exercises...' : 'cardio...'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0F1117] text-white text-xs p-2.5 pl-10 rounded-xl border border-white/5 focus:border-red-400 outline-none transition"
            />
          </div>

          {activeSubTab === 'strength' ? (
            <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1" id="strength-presets-list">
              {/* Muscle selection pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 mb-2" id="muscle-sub-navigation">
                {MUSCLE_GROUPS.map((m) => (
                  <button
                    id={`active-muscle-pill-${m.toLowerCase()}`}
                    key={m}
                    type="button"
                    onClick={() => { setSelectedMuscle(m); setSearchQuery(''); }}
                    className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition ${
                      selectedMuscle === m && !searchQuery
                        ? 'bg-[#E11D48] text-white font-bold'
                        : 'bg-[#0F1117] text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {filteredStrengthTemplates.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#A1A1AA]">No matching strengths templates.</div>
              ) : (
                filteredStrengthTemplates.map((item) => (
                  <div
                    id={`strength-template-${item.name.toLowerCase().replace(/ /g, '-')}`}
                    key={item.name}
                    onClick={() => selectStrengthTemplate(item)}
                    className="bg-[#0F1117] hover:bg-neutral-800/40 p-3 rounded-xl border border-white/5 flex justify-between items-center cursor-pointer transition"
                  >
                    <div className="text-left">
                      <p className="text-xs text-white font-semibold">{item.name}</p>
                      <p className="text-[10px] text-[#A1A1AA] mt-0.5">{item.muscleGroup} • {item.defaultSets} sets x {item.defaultReps} reps</p>
                    </div>
                    <span className="text-[10px] bg-red-400/10 text-red-400 px-2.5 py-0.5 rounded-full font-bold">
                      {item.defaultWeight}kg
                    </span>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto max-h-[320px] pr-1 font-mono" id="cardio-presets-list">
              {filteredCardioTemplates.map((item) => (
                <div
                  id={`cardio-template-${item.name.toLowerCase().replace(/ /g, '-')}`}
                  key={item.name}
                  onClick={() => selectCardioTemplate(item)}
                  className="bg-[#0F1117] hover:bg-neutral-800/40 p-3 rounded-xl border border-white/5 flex justify-between items-center cursor-pointer transition"
                >
                  <div className="text-left">
                    <p className="text-xs text-white font-semibold">{item.name}</p>
                    <p className="text-[10px] text-[#A1A1AA] mt-0.5">{item.defaultDuration} minutes duration</p>
                  </div>
                  <span className="text-[10px] bg-blue-400/10 text-blue-400 px-2 py-0.5 rounded-full font-bold">
                    MET {item.metValue}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* STRENGTH INTER-SET REST TIMER WIDGET (30+ YR VETERAN SPEC) */}
          {activeSubTab === 'strength' && (
            <div className="pt-4 border-t border-white/5 space-y-3" id="rest-timer-widget">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white font-bold flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                  <Timer size={13} className="text-red-400 animate-pulse" /> Inter-Set Rest Timer
                </span>
                <label className="flex items-center gap-1.5 text-[10px] text-[#A1A1AA] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoStartTimer}
                    onChange={(e) => setAutoStartTimer(e.target.checked)}
                    className="rounded accent-red-500 w-3 h-3 bg-[#0F1117] border-white/10"
                  />
                  Auto-Start
                </label>
              </div>

              <div className="bg-[#0F1117] p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
                {timerRunning && (
                  <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
                )}

                <div className="flex items-center justify-between w-full">
                  <div className="text-left">
                    <p className="text-[9px] text-[#A1A1AA] uppercase tracking-wider">Recovery Clock</p>
                    <p className="text-2xl font-black font-mono text-white tracking-tight mt-0.5">
                      {timeLeft > 0 
                        ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
                        : `${Math.floor(restDuration / 60)}:${(restDuration % 60).toString().padStart(2, '0')}`
                      }
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="timer-play-btn"
                      onClick={toggleTimer}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
                        timerRunning 
                          ? 'bg-red-500/15 text-red-500 hover:bg-red-500/25' 
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    >
                      {timerRunning ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                    </button>

                    <button
                      id="timer-reset-btn"
                      onClick={resetTimer}
                      disabled={timeLeft === 0}
                      className="w-9 h-9 rounded-full bg-[#1A1D24] text-[#A1A1AA] hover:text-white disabled:opacity-40 transition flex items-center justify-center cursor-pointer"
                    >
                      <RotateCcw size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-1 w-full pt-1">
                  {[30, 45, 60, 90, 120].map((dur) => (
                    <button
                      id={`timer-dur-pill-${dur}`}
                      key={dur}
                      type="button"
                      onClick={() => {
                        setRestDuration(dur);
                        if (timerRunning || timeLeft > 0) {
                          setTimeLeft(dur);
                        }
                      }}
                      className={`py-1.5 rounded-lg text-[10px] font-bold transition text-center cursor-pointer ${
                        restDuration === dur 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                          : 'bg-[#1A1D24] text-[#A1A1AA] hover:text-white border border-white/5'
                      }`}
                    >
                      {dur}s
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
