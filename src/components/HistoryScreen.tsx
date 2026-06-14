/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useAppState } from '../hooks/useAppState';
import { Download, Upload, Trash2, Calendar, FileText, Database, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';

export default function HistoryScreen() {
  const { 
    state, 
    deleteFoodLog, 
    deleteWorkoutLog, 
    deleteWaterLog, 
    deleteStepsLog,
    exportBackup, 
    importBackup, 
    clearAllData 
  } = useAppState();

  const { foodLogs, workoutLogs, waterLogs, stepsLogs = [] } = state;

  const [activeTab, setActiveTab] = useState<'logs' | 'database'>('logs');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Group all logs by date string (YYYY-MM-DD from timestamps)
  const getLogsByDate = () => {
    const grouped: { [date: string]: { foods: typeof foodLogs; workouts: typeof workoutLogs; water: typeof waterLogs; steps: typeof stepsLogs } } = {};

    foodLogs.forEach(log => {
      const date = log.timestamp.split('T')[0];
      if (!grouped[date]) grouped[date] = { foods: [], workouts: [], water: [], steps: [] };
      grouped[date].foods.push(log);
    });

    workoutLogs.forEach(log => {
      const date = log.timestamp.split('T')[0];
      if (!grouped[date]) grouped[date] = { foods: [], workouts: [], water: [], steps: [] };
      grouped[date].workouts.push(log);
    });

    waterLogs.forEach(log => {
      const date = log.timestamp.split('T')[0];
      if (!grouped[date]) grouped[date] = { foods: [], workouts: [], water: [], steps: [] };
      grouped[date].water.push(log);
    });

    stepsLogs.forEach(log => {
      const date = log.timestamp.split('T')[0];
      if (!grouped[date]) grouped[date] = { foods: [], workouts: [], water: [], steps: [] };
      grouped[date].steps.push(log);
    });

    // Sort dates descending
    return Object.keys(grouped)
      .sort((a, b) => b.localeCompare(a))
      .map(date => ({
        date,
        foods: grouped[date].foods,
        workouts: grouped[date].workouts,
        water: grouped[date].water,
        steps: grouped[date].steps
      }));
  };

  const groupedLogs = getLogsByDate();

  // Trigger JSON file export
  const handleExport = () => {
    try {
      const backupStr = exportBackup();
      const blob = new Blob([backupStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `fittrack-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccessMsg('State exported successfully to fittrack-backup.json!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch {
      setErrorMsg('Failed to trigger browser download.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  // Trigger JSON file import
  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const res = importBackup(text);
      if (res.success) {
        setSuccessMsg('Complete system restore successful! Reloading stats.');
        setErrorMsg('');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res.error || 'Invalid file backup structure.');
        setSuccessMsg('');
        setTimeout(() => setErrorMsg(''), 4000);
      }
    };
    reader.readAsText(file);
    // Reset file input value
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Trigger factory database wipe
  const handleFactoryReset = () => {
    if (window.confirm('Are you absolutely sure you want to clear your entire fitness tracker state? This wipes all foods, workouts, water logs, and historical weight indices. This action is irreversible.')) {
      clearAllData();
      setSuccessMsg('Clean local storage restored successfully.');
      setTimeout(() => setSuccessMsg(''), 4500);
    }
  };

  return (
    <div className="space-y-6" id="history-screen-panel">
      {/* Tab Selectors */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" id="history-headers">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar size={20} className="text-[#4ADE80]" /> Log history & Backup console
          </h1>
          <p className="text-xs text-[#A1A1AA]">Examine your historic journals, download portable backups, or load existing tables.</p>
        </div>
        <div className="flex bg-[#1A1D24] p-1 rounded-full border border-white/5 w-full sm:w-auto" id="history-sub-tab">
          <button
            id="tab-history-logs"
            onClick={() => setActiveTab('logs')}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-full text-xs font-semibold transition ${
              activeTab === 'logs' ? 'bg-[#4ADE80] text-[#0F1117] font-bold' : 'text-[#A1A1AA]'
            }`}
          >
            Chronological Logs
          </button>
          <button
            id="tab-history-database"
            onClick={() => setActiveTab('database')}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-full text-xs font-semibold transition ${
              activeTab === 'database' ? 'bg-[#4ADE80] text-[#0F1117] font-bold' : 'text-[#A1A1AA]'
            }`}
          >
            Settings & Backup
          </button>
        </div>
      </div>

      {/* Quick feedback banner notifications */}
      {successMsg && (
        <div className="bg-[#4ADE80]/15 border border-[#4ADE80]/30 p-4 rounded-2xl text-xs text-[#4ADE80] flex items-center gap-2" id="backup-success-alert">
          <CheckCircle size={16} /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="bg-[#EF4444]/15 border border-[#EF4444]/30 p-4 rounded-2xl text-xs text-red-400 flex items-center gap-2" id="backup-error-alert">
          <ShieldAlert size={16} /> {errorMsg}
        </div>
      )}

      {/* SCREEN ROUTER */}
      {activeTab === 'logs' ? (
        <div className="space-y-4" id="logs-view-section">
          {groupedLogs.length === 0 ? (
            <div className="bg-[#1A1D24] p-12 rounded-[24px] border border-white/5 text-center text-[#A1A1AA] text-sm">
              Your historical log diary is currently empty. Get started by entering calories, training sets, or water cups!
            </div>
          ) : (
            groupedLogs.map((day) => {
              // Format date nicely (e.g. "Sunday, Jun 14")
              const d = new Date(day.date);
              const formattedDate = d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
              
              return (
                <div 
                  key={day.date} 
                  className="bg-[#1A1D24] p-5.5 rounded-[24px] border border-white/5 space-y-4.5"
                  id={`day-history-card-${day.date}`}
                >
                  {/* Date Heading Header */}
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <Calendar size={14} className="text-[#4ADE80]" />
                    <h3 className="text-white text-xs font-bold uppercase tracking-wider">{formattedDate}</h3>
                  </div>

                  {/* Sub Logs List */}
                  <div className="space-y-4">
                    {/* Food list */}
                    {day.foods.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest pl-1">🍳 Foods Logged</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {day.foods.map(item => (
                            <div key={item.id} className="bg-[#0F1117] p-3 rounded-2xl border border-white/5 flex justify-between items-center text-xs">
                              <div className="text-left">
                                <p className="text-white font-medium">{item.name}</p>
                                <p className="text-[10px] text-[#A1A1AA] mt-0.5">
                                  {item.qty} {item.qtyType} • {item.protein}g protein
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-white font-mono">{item.calories} kcal</span>
                                <button
                                  id={`history-delete-food-${item.id}`}
                                  onClick={() => deleteFoodLog(item.id)}
                                  className="text-red-400 hover:bg-red-400/10 p-1.5 rounded-lg transition"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Workouts list */}
                    {day.workouts.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest pl-1">💪 Training Logs</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {day.workouts.map(item => (
                            <div key={item.id} className="bg-[#0F1117] p-3 rounded-2xl border border-white/5 flex justify-between items-center text-xs">
                              <div className="text-left">
                                <p className="text-white font-medium">{item.exerciseName}</p>
                                <p className="text-[10px] text-[#A1A1AA] mt-0.5">
                                  {item.type === 'strength' 
                                    ? `${item.muscleGroup} • ${item.sets} x ${item.reps} reps (${item.weight}kg)`
                                    : `Cardio • ${item.duration} mins`
                                  }
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-red-400 font-mono">-{item.caloriesBurned} kcal</span>
                                <button
                                  id={`history-delete-workout-${item.id}`}
                                  onClick={() => deleteWorkoutLog(item.id)}
                                  className="text-red-400 hover:bg-red-400/10 p-1.5 rounded-lg transition"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Water list */}
                    {day.water.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest pl-1">💧 Water Registered</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {day.water.map(item => {
                            const time = new Date(item.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                            return (
                              <div key={item.id} className="bg-[#0F1117] p-3 rounded-2xl border border-white/5 flex justify-between items-center text-xs">
                                <div className="text-left">
                                  <p className="text-white font-medium">{item.amountMl} ml</p>
                                  <p className="text-[9px] text-[#A1A1AA] mt-0.5">Logged: {time}</p>
                                </div>
                                <button
                                  id={`history-delete-water-${item.id}`}
                                  onClick={() => deleteWaterLog(item.id)}
                                  className="text-red-400 hover:bg-red-400/10 p-1.5 rounded-lg transition"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Steps list */}
                    {day.steps && day.steps.length > 0 && (
                      <div className="space-y-2 pt-1 font-sans">
                        <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest pl-1">👣 Steps & Walking</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {day.steps.map(item => (
                            <div key={item.id} className="bg-[#0F1117] p-3 rounded-2xl border border-white/5 flex justify-between items-center text-xs">
                              <div className="text-left w-full">
                                <p className="text-white font-medium">
                                  {item.steps > 0 ? `${item.steps.toLocaleString()} Steps` : `${item.durationMinutes} mins walk`}
                                </p>
                                <p className="text-[10px] text-[#A1A1AA] mt-0.5">
                                  {item.steps > 0 
                                    ? `~${Math.round(item.steps / 120)} mins walk`
                                    : `~${(item.durationMinutes || 0) * 120} steps`
                                  }
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-emerald-400 font-mono">-{item.caloriesBurned} kcal</span>
                                <button
                                  id={`history-delete-steps-${item.id}`}
                                  onClick={() => deleteStepsLog(item.id)}
                                  className="text-red-400 hover:bg-red-400/10 p-1.5 rounded-lg transition"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="database-backup-view">
          {/* IMPORT EXPORT ACCORDION */}
          <div className="bg-[#1A1D24] p-6 rounded-[24px] border border-white/5 flex flex-col justify-between space-y-6" id="backup-card">
            <div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
                <Database size={16} className="text-[#4ADE80]" /> Backup & Portability
              </h3>
              <p className="text-[#A1A1AA] text-xs mt-1">Export your complete progress dataset to a portable JSON file or upload existing databases seamlessly.</p>
            </div>

            <div className="space-y-3.5">
              {/* EXPORT WORKSPACE */}
              <button
                id="do-export-btn"
                onClick={handleExport}
                className="w-full bg-[#0F1117] hover:bg-[#4ADE80] hover:text-[#0F1117] text-[#4ADE80] font-bold text-xs p-4 rounded-xl border border-emerald-400/10 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download size={14} /> Export fittrack-backup.json
              </button>

              {/* IMPORT WORKSPACE */}
              <div className="relative">
                <input
                  id="import-file-selector"
                  type="file"
                  accept=".json"
                  ref={fileInputRef}
                  onChange={handleImportFileChange}
                  className="hidden"
                />
                <button
                  id="do-import-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-[#0F1117] hover:bg-sky-400 hover:text-[#0F1117] text-sky-400 font-bold text-xs p-4 rounded-xl border border-sky-400/10 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload size={14} /> Upload and Import Backup (.json)
                </button>
              </div>
            </div>

            <div className="bg-[#0F1117] p-3 text-left rounded-xl border border-white/5 text-[10px] text-[#A1A1AA] space-y-1">
              <p className="font-semibold text-white">Import details:</p>
              <p>1. Must be a valid fittrack-backup.json file.</p>
              <p>2. Complete restore overrides your existing client local data.</p>
            </div>
          </div>

          {/* HAZARD ZONE RESET */}
          <div className="bg-[#1A1D24] p-6 rounded-[24px] border border-[#EF4444]/15 flex flex-col justify-between space-y-6" id="danger-zone-card">
            <div>
              <h3 className="text-[#EF4444] font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert size={16} /> Hazard Emergency Settings
              </h3>
              <p className="text-[#A1A1AA] text-xs mt-1">Reset the application database tables, completely emptying local logs and rolling back to default configurations.</p>
            </div>

            <div className="bg-red-500/5 p-4 rounded-2xl border border-red-500/10 text-left text-xs text-red-300 flex items-start gap-2.5">
              <ShieldAlert size={18} className="flex-shrink-0 mt-0.5 text-red-400" />
              <div>
                <p className="font-semibold">Destructive Action:</p>
                <p className="text-[11px] leading-relaxed text-[#A1A1AA] mt-1">
                  Once deleted, your weight registers, historic calorie deficits, and training milestones are lost forever without a downloaded backup copy.
                </p>
              </div>
            </div>

            <button
              id="factory-reset-btn"
              onClick={handleFactoryReset}
              className="w-full bg-[#EF4444] hover:bg-red-700 text-white font-bold text-xs p-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Trash2 size={14} /> Destroy All Data & Soft Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
