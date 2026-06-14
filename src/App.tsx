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
import { Home as HomeIcon, Apple, Dumbbell, TrendingDown, Calendar, User, ShieldAlert } from 'lucide-react';

function AppInner() {
  const [activeTab, setActiveTab] = useState<'home' | 'food' | 'workout' | 'weight' | 'history' | 'profile'>('home');
  const { state } = useAppState();

  const handleNavigateToTab = (tab: 'home' | 'food' | 'workout' | 'weight' | 'profile' | 'history') => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-white flex flex-col justify-between" id="app-inner-root">
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
        className="fixed bottom-0 left-0 right-0 bg-[#1A1D24]/95 backdrop-blur-md border-t border-white/5 py-3 px-3 shadow-2xl z-40"
      >
        <div className="max-w-xl mx-auto grid grid-cols-6 gap-1" id="navbar-slots-grid">
          {/* Home Tab */}
          <button
            id="nav-btn-home"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1.5 transition py-1 rounded-xl cursor-pointer ${
              activeTab === 'home' ? 'text-[#4ADE80]' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <HomeIcon size={18} className={activeTab === 'home' ? 'stroke-[2.5px]' : 'stroke-1'} />
            <span className="text-[9px] font-semibold tracking-wider uppercase">Home</span>
          </button>

          {/* Food Tab */}
          <button
            id="nav-btn-food"
            onClick={() => setActiveTab('food')}
            className={`flex flex-col items-center gap-1.5 transition py-1 rounded-xl cursor-pointer ${
              activeTab === 'food' ? 'text-[#4ADE80]' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <Apple size={18} className={activeTab === 'food' ? 'stroke-[2.5px]' : 'stroke-1'} />
            <span className="text-[9px] font-semibold tracking-wider uppercase">Nutrition</span>
          </button>

          {/* Workout Tab */}
          <button
            id="nav-btn-workout"
            onClick={() => setActiveTab('workout')}
            className={`flex flex-col items-center gap-1.5 transition py-1 rounded-xl cursor-pointer ${
              activeTab === 'workout' ? 'text-[#4ADE80]' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <Dumbbell size={18} className={activeTab === 'workout' ? 'stroke-[2.5px]' : 'stroke-1'} />
            <span className="text-[9px] font-semibold tracking-wider uppercase">Workout</span>
          </button>

          {/* Weight Tab */}
          <button
            id="nav-btn-weight"
            onClick={() => setActiveTab('weight')}
            className={`flex flex-col items-center gap-1.5 transition py-1 rounded-xl cursor-pointer ${
              activeTab === 'weight' ? 'text-[#4ADE80]' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <TrendingDown size={18} className={activeTab === 'weight' ? 'stroke-[2.5px]' : 'stroke-1'} />
            <span className="text-[9px] font-semibold tracking-wider uppercase">Weight</span>
          </button>

          {/* History Tab */}
          <button
            id="nav-btn-history"
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1.5 transition py-1 rounded-xl cursor-pointer ${
              activeTab === 'history' ? 'text-[#4ADE80]' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <Calendar size={18} className={activeTab === 'history' ? 'stroke-[2.5px]' : 'stroke-1'} />
            <span className="text-[9px] font-semibold tracking-wider uppercase">History</span>
          </button>

          {/* Profile Tab */}
          <button
            id="nav-btn-profile"
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1.5 transition py-1 rounded-xl cursor-pointer ${
              activeTab === 'profile' ? 'text-[#4ADE80]' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            <User size={18} className={activeTab === 'profile' ? 'stroke-[2.5px]' : 'stroke-1'} />
            <span className="text-[9px] font-semibold tracking-wider uppercase">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <AppInner />
    </AppStateProvider>
  );
}
