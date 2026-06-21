/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { Sparkles, Calendar, TrendingDown, Target, Trash2 } from 'lucide-react';
import { getISTDateString } from '../utils/dateUtils';

export default function WeightScreen() {
  const { state, logWeight } = useAppState();
  const { weightLogs, profile } = state;

  const todayStr = getISTDateString();

  const [weightKg, setWeightKg] = useState<string>(profile.currentWeightKg.toString());
  const [logDate, setLogDate] = useState<string>(todayStr);

  const startWeight = profile.initialWeightKg ?? (weightLogs.length > 0 ? weightLogs[0].weightKg : profile.currentWeightKg);
  const currentWeight = profile.currentWeightKg;
  const targetWeight = profile.targetWeightKg;
  
  const isLosing = targetWeight < startWeight;
  const totalLost = isLosing ? (startWeight - currentWeight).toFixed(1) : (currentWeight - startWeight).toFixed(1);
  const remaining = Math.abs(currentWeight - targetWeight).toFixed(1);
  const remainingNum = isLosing ? (currentWeight - targetWeight) : (targetWeight - currentWeight);

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(weightKg);
    if (!parsed || parsed <= 0) return;

    logWeight(parsed, logDate);
  };

  // Sort weight history by date descending for display list
  const sortedHistory = [...weightLogs].sort((a,b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6" id="weight-screen-view">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingDown size={20} className="text-violet-400" /> Body Mass Log
        </h1>
        <p className="text-xs text-[#A1A1AA]">Register your daily weigh-ins to track trends and see goal progress.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="weight-screengrid">
        {/* LEFT VIEW: LOGGER AND STATS */}
        <div className="lg:col-span-6 space-y-6">
          {/* Quick Stats Panel */}
          <div className="grid grid-cols-3 gap-2.5" id="weight-metrics-boxes">
            <div className="bg-[#1A1D24] p-4.5 rounded-[20px] border border-white/5 text-center" id="wt-start">
              <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">Start weight</span>
              <p className="text-lg font-extrabold text-white mt-1">{startWeight} kg</p>
              <span className="text-[9px] text-[#A1A1AA] mt-0.5 block">{sortedHistory[sortedHistory.length - 1]?.date || 'None'}</span>
            </div>
            
            <div className="bg-[#1A1D24] p-4.5 rounded-[20px] border border-white/5 text-center" id="wt-lost">
              <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">Total Lost</span>
              <p className="text-lg font-extrabold text-[#4ADE80] mt-1">
                {parseFloat(totalLost) > 0 ? `-${totalLost}` : `${totalLost}`} kg
              </p>
              <span className="text-[9px] text-[#A1A1AA] mt-0.5 block">Trend progress</span>
            </div>

            <div className="bg-[#1A1D24] p-4.5 rounded-[20px] border border-white/5 text-center" id="wt-remain">
              <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">Remaining</span>
              <p className="text-lg font-extrabold text-violet-400 mt-1">{remaining} kg</p>
              <span className="text-[9px] text-[#A1A1AA] mt-0.5 block">to target ({targetWeight}kg)</span>
            </div>
          </div>

          {/* New Weight Log Form card */}
          <div className="bg-[#1A1D24] p-6 rounded-[24px] border border-white/5 space-y-5" id="add-weight-card">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
              <Target size={16} className="text-violet-400" /> Save Daily Measurement
            </h3>

            <form onSubmit={handleSaveWeight} className="space-y-4" id="weight-entry-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="weight-num-input">Body Weight (kg)</label>
                  <input
                    id="weight-num-input"
                    type="text"
                    inputMode="decimal"
                    required
                    value={weightKg}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^\d*\.?\d*$/.test(val)) {
                        setWeightKg(val);
                      }
                    }}
                    className="bg-[#0F1117] text-white text-xs p-3.5 rounded-xl border border-white/5 focus:border-violet-400 outline-none font-bold"
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="weight-date-input">Calendar Date</label>
                  <input
                    id="weight-date-input"
                    type="date"
                    required
                    max={todayStr}
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="bg-[#0F1117] text-white text-xs p-3.5 rounded-xl border border-white/5 outline-none font-medium cursor-pointer"
                  />
                </div>
              </div>

              <button
                id="weight-save-submit"
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm py-3.5 rounded-xl transition shadow-lg cursor-pointer"
              >
                Log daily weigh-in
              </button>
            </form>
            <p className="text-[#A1A1AA] text-[10px] leading-tight-normal mt-2">
              * Note: Submitting multiple entries on the same date will overwrite previous measurement logs for that specific day.
            </p>
          </div>

          {/* DYNAMIC PROGRESS FORECAST CARD */}
          <div className="bg-[#1A1D24] p-5 rounded-[24px] border border-violet-500/10 space-y-3" id="weight-forecast-card">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-violet-400 animate-pulse" /> Physiological Target Estimate
            </h4>
            
            {remainingNum > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Assuming a gold-standard, metabolic-safe fat loss rate of <span className="text-white font-semibold">0.5 kg</span> per week:
                </p>
                <div className="bg-[#0F1117] p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                  <span className="text-[#A1A1AA]">Projected Target ETA:</span>
                  <span className="font-extrabold text-violet-400 font-mono">
                    ~{Math.ceil(remainingNum / 0.5)} Weeks
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-tight">
                  This pace preserves dry contractile lean muscle tissue while successfully down-regulating biological set-point weights.
                </p>
              </div>
            ) : remainingNum < 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Assuming a high-fidelity lean muscle tissue accretion rate of <span className="text-white font-semibold">0.25 kg</span> per week:
                </p>
                <div className="bg-[#0F1117] p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                  <span className="text-[#A1A1AA]">Projected Target ETA:</span>
                  <span className="font-extrabold text-[#4ADE80] font-mono">
                    ~{Math.ceil(Math.abs(remainingNum) / 0.25)} Weeks
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-tight">
                  A hyper-controlled, small calorie surplus fuels hyper-recovery without unnecessary adipose tissue deposition.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-500/5 p-4 rounded-xl border border-[#4ADE80]/20 text-center space-y-1">
                <p className="text-xs text-[#4ADE80] font-bold">🏆 Target Weight Achieved!</p>
                <p className="text-[10px] text-[#A1A1AA]">
                  You have matched your set biometric target. Switch to dynamic calorie maintenance to lock in your physiological adaptation.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT VIEW: WEIGHT HISTORY TABLE LIST */}
        <div className="lg:col-span-6 bg-[#1A1D24] p-5.5 rounded-[24px] border border-white/5 flex flex-col max-h-[355px]" id="weight-trend-list">
          <div className="mb-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Weight Logs Registry</h3>
            <p className="text-[#A1A1AA] text-xs">A comprehensive catalog of your recorded scale weigh-ins</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1" id="weight-history-elements">
            {sortedHistory.length === 0 ? (
              <div className="text-center py-12 text-[#A1A1AA] text-xs">No records available. Please log above.</div>
            ) : (
              sortedHistory.map((item, idx) => {
                const diff = idx < sortedHistory.length - 1 ? (item.weightKg - sortedHistory[idx + 1].weightKg) : 0;
                return (
                  <div 
                    key={item.date} 
                    className="bg-[#0F1117] p-3.5 rounded-xl border border-white/5 flex justify-between items-center"
                    id={`weight-log-row-${item.date}`}
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="p-2 rounded-lg bg-violet-400/5 text-violet-400">
                        <Calendar size={14} />
                      </div>
                      <div>
                        <p className="text-xs text-white font-semibold">{item.date === todayStr ? 'Today' : item.date}</p>
                        <p className="text-[10px] text-[#A1A1AA] mt-0.5">Scale weighing</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-white font-bold">{item.weightKg} kg</span>
                      {diff !== 0 && (
                        <p className={`text-[9px] font-semibold mt-0.5 ${diff > 0 ? 'text-red-400' : 'text-[#4ADE80]'}`}>
                          {diff > 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`} kg
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
