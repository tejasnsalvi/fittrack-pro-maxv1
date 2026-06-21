/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppStateProvider, useAppState } from './hooks/useAppState';
import DashboardScreen from './components/DashboardScreen';
import FoodScreen from './components/FoodScreen';
import WorkoutScreen from './components/WorkoutScreen';
import WeightScreen from './components/WeightScreen';
import HistoryScreen from './components/HistoryScreen';
import ProfileScreen from './components/ProfileScreen';
import QuickAddModal from './components/QuickAddModal';
import ChartsSection from './components/Charts';
import { Home as HomeIcon, Apple, Dumbbell, TrendingDown, Calendar, User, ShieldAlert, Flame, X, Award, Droplet, Sparkles, CheckCircle2 } from 'lucide-react';
import { getISTTimeInfo, getDailyWorkoutTarget } from './utils/dateUtils';
import { motion, AnimatePresence } from 'motion/react';

const WEEK_SCHEDULE = [
  { dayNum: 1, label: 'Mon', target: 'chest and back' },
  { dayNum: 2, label: 'Tue', target: 'bicep tricep' },
  { dayNum: 3, label: 'Wed', target: 'leg and shoulder' },
  { dayNum: 4, label: 'Thu', target: 'chest and back' },
  { dayNum: 5, label: 'Fri', target: 'abs legs' },
  { dayNum: 6, label: 'Sat', target: 'full body' },
  { dayNum: 0, label: 'Sun', target: 'Rest Day 🧘‍♂️' },
];

function AppInner() {
  const [activeTab, setActiveTab] = useState<'home' | 'food' | 'workout' | 'weight' | 'history' | 'profile'>('home');
  const { state, activeToast, setActiveToast } = useAppState();

  // Auto dismiss toast after 3 seconds
  React.useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeToast, setActiveToast]);

  const [showWorkoutTargetNote, setShowWorkoutTargetNote] = useState(() => {
    const istInfo = getISTTimeInfo();
    // 9 AM (9) till 11 PM (23) in IST
    if (istInfo.hour >= 9 && istInfo.hour < 23) {
      const todayTarget = getDailyWorkoutTarget(istInfo.dayOfWeek);
      return todayTarget !== null;
    }
    return false;
  });

  const handleNavigateToTab = (tab: 'home' | 'food' | 'workout' | 'weight' | 'profile' | 'history') => {
    setActiveTab(tab);
  };

  const istInfo = getISTTimeInfo();
  const currentDayOfWeek = istInfo.dayOfWeek;
  const currentTargetWorkout = getDailyWorkoutTarget(currentDayOfWeek);

  return (
    <>
      <div 
        className={`min-h-screen bg-[#0F1117] text-white flex flex-col justify-between transition-all duration-500 ease-out ${
          showWorkoutTargetNote ? 'blur-md pointer-events-none select-none scale-[0.98]' : ''
        }`} 
        id="app-inner-root"
      >
        {/* Outer constraint framework */}
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6 pt-5 pb-28 flex-1" id="main-scroller">
          {activeTab === 'home' && (
            <div className="space-y-6 animate-fadeIn" id="dashboard-tab-wrapper">
              {/* Primary Dashboard Cockpit */}
              <DashboardScreen 
                onSetActiveTab={handleNavigateToTab} 
                onOpenQuickAdd={(type) => {}} 
              />
              {/* Progress charts right beneath bento indicators */}
              <ChartsSection 
                weightLogs={state.weightLogs}
                foodLogs={state.foodLogs}
                waterLogs={state.waterLogs}
                profile={state.profile}
              />
            </div>
          )}

        {/* Tab route renders */}
        {activeTab === 'food' && (
          <div className="animate-fadeIn" id="food-tab-wrapper">
            <FoodScreen />
          </div>
        )}

        {activeTab === 'workout' && (
          <div className="animate-fadeIn" id="workout-tab-wrapper">
            <WorkoutScreen />
          </div>
        )}

        {activeTab === 'weight' && (
          <div className="space-y-6 animate-fadeIn" id="weight-tab-wrapper">
            <WeightScreen />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-fadeIn" id="history-tab-wrapper">
            <HistoryScreen />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="animate-fadeIn" id="profile-tab-wrapper">
            <ProfileScreen />
          </div>
        )}
      </div>

      {/* Floating Quick Action Button overlay */}
      <QuickAddModal onNavigateToTab={handleNavigateToTab} />

      {/* iPhone-optimized Apple-style Tab Navigation Bar */}
      <nav 
        id="app-bottom-navbar"
        className="fixed bottom-0 left-0 right-0 bg-[#1A1D24]/95 backdrop-blur-md border-t border-white/5 py-3.5 px-3 shadow-2xl z-40"
      >
        <div className="max-w-xl mx-auto grid grid-cols-5 gap-1" id="navbar-slots-grid">
          {/* Home Tab */}
          <button
            id="nav-btn-home"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1.5 transition py-1 rounded-xl cursor-pointer ${
              activeTab === 'home' ? 'text-[#4ADE80]' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <HomeIcon size={20} className={activeTab === 'home' ? 'stroke-[2.5px]' : 'stroke-1'} />
            <span className="text-[11px] font-bold tracking-wider uppercase">Home</span>
          </button>
 
          {/* Food Tab */}
          <button
            id="nav-btn-food"
            onClick={() => setActiveTab('food')}
            className={`flex flex-col items-center gap-1.5 transition py-1 rounded-xl cursor-pointer ${
              activeTab === 'food' ? 'text-[#4ADE80]' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <Apple size={20} className={activeTab === 'food' ? 'stroke-[2.5px]' : 'stroke-1'} />
            <span className="text-[11px] font-bold tracking-wider uppercase">Nutrition</span>
          </button>
 
          {/* Workout Tab */}
          <button
            id="nav-btn-workout"
            onClick={() => setActiveTab('workout')}
            className={`flex flex-col items-center gap-1.5 transition py-1 rounded-xl cursor-pointer ${
              activeTab === 'workout' ? 'text-[#4ADE80]' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <Dumbbell size={20} className={activeTab === 'workout' ? 'stroke-[2.5px]' : 'stroke-1'} />
            <span className="text-[11px] font-bold tracking-wider uppercase">Workout</span>
          </button>
 
          {/* History Tab */}
          <button
            id="nav-btn-history"
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1.5 transition py-1 rounded-xl cursor-pointer ${
              activeTab === 'history' ? 'text-[#4ADE80]' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <Calendar size={20} className={activeTab === 'history' ? 'stroke-[2.5px]' : 'stroke-1'} />
            <span className="text-[11px] font-bold tracking-wider uppercase">History</span>
          </button>
 
          {/* Profile Tab */}
          <button
            id="nav-btn-profile"
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1.5 transition py-1 rounded-xl cursor-pointer ${
              activeTab === 'profile' ? 'text-[#4ADE80]' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <User size={20} className={activeTab === 'profile' ? 'stroke-[2.5px]' : 'stroke-1'} />
            <span className="text-[11px] font-bold tracking-wider uppercase">Profile</span>
          </button>
        </div>
      </nav>
    </div>

    {/* Workout Target Overlay Modal */}
    <AnimatePresence>
      {showWorkoutTargetNote && currentTargetWorkout && (
        <div 
          key="workout-target-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowWorkoutTargetNote(false)}
          id="workout-modal-overlay"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking card
            className="bg-[#1A1D24] border border-white/10 rounded-[28px] max-w-sm w-full p-5 shadow-2xl relative overflow-hidden space-y-4"
            id="workout-modal-card"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 text-violet-400 font-bold uppercase text-[9px] tracking-widest bg-violet-500/10 px-2.5 py-1 rounded-full border border-violet-500/10">
                <Flame size={12} className="animate-pulse" />
                <span>Today's Target Workout</span>
              </div>
              <button 
                onClick={() => setShowWorkoutTargetNote(false)}
                className="p-1 rounded-full hover:bg-white/10 text-[#A1A1AA] hover:text-white transition cursor-pointer"
                title="Dismiss"
              >
                <X size={16} />
              </button>
            </div>

            <div className="text-left space-y-2">
              <h2 className="text-white text-base sm:text-lg font-black font-sans tracking-tight leading-snug">
                Today you need to target weight workout:
              </h2>
              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 rounded-[20px] shadow-lg shadow-violet-500/10 text-center relative overflow-hidden">
                <div className="absolute -top-4 -right-4 p-3 opacity-10">
                  <Dumbbell size={96} className="stroke-[3px]" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-violet-100/75">Focus Area</span>
                <p className="text-white text-xl sm:text-2xl font-black uppercase tracking-wide mt-0.5 drop-shadow-sm">
                  {currentTargetWorkout}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <span className="text-[#A1A1AA] text-[9px] uppercase font-bold tracking-wider block px-1">
                Weekly Workout Focus
              </span>
              <div className="bg-[#0F1117] rounded-2xl border border-white/5 divide-y divide-white/5 overflow-hidden">
                {WEEK_SCHEDULE.map(({ dayNum, label, target }) => {
                  const isToday = dayNum === currentDayOfWeek;
                  return (
                    <div 
                      key={label}
                      className={`flex items-center justify-between px-3 py-1.5 text-xs transition duration-200 ${
                        isToday 
                          ? 'bg-violet-500/10 text-[#4ADE80] font-bold' 
                          : 'text-[#A1A1AA]/60 hover:text-[#A1A1AA]'
                      }`}
                    >
                      <span className="font-mono flex items-center gap-1.5">
                        {isToday && <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />}
                        {label}
                      </span>
                      <span className={`capitalize text-[11px] ${isToday ? 'text-white font-extrabold' : ''}`}>
                        {target}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setShowWorkoutTargetNote(false)}
              className="w-full bg-[#4ADE80] hover:bg-[#3DCE73] text-[#0F1117] font-black py-3 rounded-2xl cursor-pointer transition active:scale-[0.98] shadow-md shadow-[#4ADE80]/15 tracking-wide text-xs uppercase"
            >
              Let's Crush It! 🔥
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* Absolute Toast alert popup */}
    <AnimatePresence>
      {activeToast && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 cursor-pointer"
            onClick={() => setActiveToast(null)}
          />

          <motion.div
            key={activeToast.id}
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            className="fixed top-[32%] left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm"
          >
            <div className={`bg-[#1A1D24]/95 border border-white/10 rounded-2xl p-4 shadow-2xl flex items-start gap-3.5 relative overflow-hidden ring-1 ring-black/20 ${
              activeToast.type === 'food' ? 'border-amber-500/20 shadow-amber-500/10' :
              activeToast.type === 'workout' ? 'border-violet-500/20 shadow-violet-500/10' :
              activeToast.type === 'water' ? 'border-blue-500/20 shadow-blue-500/10' :
              activeToast.type === 'steps' ? 'border-emerald-500/20 shadow-emerald-500/10' :
              activeToast.type === 'weight' ? 'border-pink-500/20 shadow-pink-500/10' :
              activeToast.type === 'fasting' ? 'border-indigo-500/20 shadow-indigo-500/10' :
              'border-green-500/20 shadow-green-500/10'
            }`}>
            {/* Type Indicator Icon */}
            <div className={`p-2.5 rounded-xl ${
              activeToast.type === 'food' ? 'bg-amber-500/10 text-amber-400' :
              activeToast.type === 'workout' ? 'bg-violet-500/10 text-violet-400' :
              activeToast.type === 'water' ? 'bg-blue-500/10 text-blue-400' :
              activeToast.type === 'steps' ? 'bg-emerald-500/10 text-emerald-400' :
              activeToast.type === 'weight' ? 'bg-pink-500/10 text-pink-400' :
              activeToast.type === 'fasting' ? 'bg-indigo-500/10 text-indigo-400' :
              'bg-[#4ADE80]/10 text-[#4ADE80]'
            }`}>
              {activeToast.type === 'food' && <Apple size={18} className="stroke-[2.5]" />}
              {activeToast.type === 'workout' && <Dumbbell size={18} className="stroke-[2.5]" />}
              {activeToast.type === 'water' && <Droplet size={18} className="stroke-[2.5]" />}
              {activeToast.type === 'steps' && <Flame size={18} className="stroke-[2.5]" />}
              {activeToast.type === 'weight' && <TrendingDown size={18} className="stroke-[2.5]" />}
              {activeToast.type === 'fasting' && <Sparkles size={18} className="stroke-[2.5]" />}
              {!['food', 'workout', 'water', 'steps', 'weight', 'fasting'].includes(activeToast.type || '') && (
                <CheckCircle2 size={18} className="stroke-[2.5]" />
              )}
            </div>

            {/* Text Area */}
            <div className="flex-1 min-w-0 pr-6 text-left">
              <h3 className="text-white text-xs font-extrabold tracking-wide uppercase">
                {activeToast.message}
              </h3>
              {activeToast.description && (
                <p className="text-[#A1A1AA] text-[11px] font-medium mt-0.5 leading-relaxed">
                  {activeToast.description}
                </p>
              )}
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => setActiveToast(null)}
              className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/5 text-[#A1A1AA]/60 hover:text-white transition cursor-pointer"
            >
              <X size={14} />
            </button>

            {/* Visual mini progress track line that shrinks */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/[0.04]">
              <motion.div 
                initial={{ width: '100%' }}
                animate={{ width: 0 }}
                transition={{ duration: 3, ease: 'linear' }}
                className={`h-full ${
                  activeToast.type === 'food' ? 'bg-amber-500' :
                  activeToast.type === 'workout' ? 'bg-violet-500' :
                  activeToast.type === 'water' ? 'bg-blue-500' :
                  activeToast.type === 'steps' ? 'bg-emerald-500' :
                  activeToast.type === 'weight' ? 'bg-pink-500' :
                  activeToast.type === 'fasting' ? 'bg-indigo-500' :
                  'bg-[#4ADE80]'
                }`}
              />
            </div>
          </div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <AppInner />
    </AppStateProvider>
  );
}
