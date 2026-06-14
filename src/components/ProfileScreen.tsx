/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { UserProfile } from '../types';
import { User, Activity, Settings, Scale, CheckCircle } from 'lucide-react';

export default function ProfileScreen() {
  const { state, updateProfile } = useAppState();
  const { profile } = state;

  const [age, setAge] = useState(profile.age);
  const [gender, setGender] = useState<'male' | 'female'>(profile.gender);
  const [height, setHeight] = useState(profile.heightCm);
  const [initialWeight, setInitialWeight] = useState(profile.initialWeightKg ?? profile.currentWeightKg ?? 77);
  const [currentWeight, setCurrentWeight] = useState(profile.currentWeightKg);
  const [targetWeight, setTargetWeight] = useState(profile.targetWeightKg);
  
  const [caloriesGoal, setCaloriesGoal] = useState(profile.caloriesGoal);
  const [proteinGoal, setProteinGoal] = useState(profile.proteinGoal);
  const [waterGoal, setWaterGoal] = useState(profile.waterGoalMl);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateProfile({
      age,
      gender,
      heightCm: height,
      initialWeightKg: initialWeight,
      currentWeightKg: currentWeight,
      targetWeightKg: targetWeight,
      caloriesGoal,
      proteinGoal,
      waterGoalMl: waterGoal
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6" id="profile-settings-screen">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <User size={20} className="text-[#4ADE80]" /> Profile & Physical Goals
        </h1>
        <p className="text-xs text-[#A1A1AA]">Modify your physical attributes and daily calorie, protein, and water targets.</p>
      </div>

      <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-12 gap-6" id="profile-fields-form">
        {/* PHYSICAL CONSTANTS SECTION */}
        <div className="md:col-span-6 bg-[#1A1D24] p-6 rounded-[24px] border border-white/5 space-y-4" id="bio-stats-box">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
            <Scale size={16} className="text-[#4ADE80]" /> Physical Biometrics
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="bio-age">Age (Years)</label>
              <input
                id="bio-age"
                type="number"
                required
                min="10"
                max="100"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                className="bg-[#0F1117] text-white text-xs p-3.5 rounded-xl border border-white/5 outline-none font-medium"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="bio-gender">Biological Gender</label>
              <select
                id="bio-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="bg-[#0F1117] text-white text-xs p-3.5 rounded-xl border border-white/5 outline-none cursor-pointer font-medium"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="bio-height">Height (cm)</label>
              <input
                id="bio-height"
                type="number"
                required
                min="100"
                max="250"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                className="bg-[#0F1117] text-white text-xs p-3.5 rounded-xl border border-white/5 outline-none font-medium"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="bio-initial-weight">Starting Weight (kg)</label>
              <input
                id="bio-initial-weight"
                type="number"
                step="0.1"
                required
                min="30"
                max="300"
                value={initialWeight}
                onChange={(e) => setInitialWeight(parseFloat(e.target.value) || 0)}
                className="bg-[#0F1117] text-zinc-300 text-xs p-3.5 rounded-xl border border-white/5 outline-none font-semibold"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="bio-weight">Current Weight (kg)</label>
              <input
                id="bio-weight"
                type="number"
                step="0.1"
                required
                min="30"
                max="300"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
                className="bg-[#0F1117] text-white text-xs p-3.5 rounded-xl border border-white/5 outline-none font-bold"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="bio-target">Weight Target (kg)</label>
              <input
                id="bio-target"
                type="number"
                step="0.1"
                required
                min="30"
                max="300"
                value={targetWeight}
                onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
                className="bg-[#0F1117] text-violet-400 text-xs p-3.5 rounded-xl border border-white/5 outline-none font-bold"
              />
            </div>
          </div>
        </div>

        {/* DAILY HABIT TARGETS SECTION */}
        <div className="md:col-span-6 bg-[#1A1D24] p-6 rounded-[24px] border border-white/5 space-y-4" id="goals-setup-box">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
            <Activity size={16} className="text-[#4ADE80]" /> Daily Targets Selection
          </h3>

          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="goal-calories">Daily Calorie Target (kcal)</label>
            <input
              id="goal-calories"
              type="number"
              required
              min="800"
              max="10000"
              value={caloriesGoal}
              onChange={(e) => setCaloriesGoal(parseInt(e.target.value) || 0)}
              className="bg-[#0F1117] text-white text-xs p-3.5 rounded-xl border border-white/5 outline-none font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="goal-protein">Protein Goal (g)</label>
              <input
                id="goal-protein"
                type="number"
                required
                min="20"
                max="500"
                value={proteinGoal}
                onChange={(e) => setProteinGoal(parseInt(e.target.value) || 0)}
                className="bg-[#0F1117] text-white text-xs p-3.5 rounded-xl border border-white/5 outline-none font-bold text-sky-400"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="goal-water">Water Goal (ml)</label>
              <input
                id="goal-water"
                type="number"
                required
                min="500"
                max="10000"
                step="250"
                value={waterGoal}
                onChange={(e) => setWaterGoal(parseInt(e.target.value) || 0)}
                className="bg-[#0F1117] text-white text-xs p-3.5 rounded-xl border border-white/5 outline-none font-bold text-blue-400"
              />
            </div>
          </div>

          {/* Safe feedback alert */}
          <div className="flex justify-between items-center pt-4">
            {savedSuccess ? (
              <span className="text-xs text-[#4ADE80] font-semibold flex items-center gap-1 animate-fadeIn">
                <CheckCircle size={14} /> Profile configured and set!
              </span>
            ) : (
              <span className="text-[10px] text-[#A1A1AA]">
                Saves directly to localStorage
              </span>
            )}
            <button
              id="profile-save-btn"
              type="submit"
              className="bg-[#4ADE80] hover:bg-emerald-400 text-[#0F1117] text-xs font-extrabold p-3 px-6 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
