/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { BUILT_IN_FOODS, FOOD_CATEGORIES } from '../data/foods';
import { FoodItem, QtyType } from '../types';
import { Search, Heart, Plus, Scale, Sparkles, PlusCircle } from 'lucide-react';

export default function FoodScreen() {
  const { state, addFoodLog, saveCustomFood, deleteCustomFood, toggleFavorite } = useAppState();
  const { customFoods, favorites, recentFoods } = state;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [filterType, setFilterType] = useState<'all' | 'favorites' | 'recents' | 'custom'>('all');

  // Modal / Log State
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [logQty, setLogQty] = useState<number>(1);

  // New Custom Food Form State
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('Proteins');
  const [customQtyType, setCustomQtyType] = useState<QtyType>('Gram');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');

  // Combine database and custom foods
  const allFoods = [...customFoods, ...BUILT_IN_FOODS];

  // Filtering Logic
  const getFilteredFoods = () => {
    let list = allFoods;

    if (filterType === 'favorites') {
      list = list.filter(f => favorites.includes(f.id));
    } else if (filterType === 'recents') {
      list = list.filter(f => recentFoods.includes(f.id));
    } else if (filterType === 'custom') {
      list = list.filter(f => f.isCustom);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(query));
    }

    // Filter by Active Category
    if (activeCategory !== 'All' && filterType === 'all') {
      list = list.filter(f => f.category === activeCategory);
    }

    return list;
  };

  const filteredFoods = getFilteredFoods();

  // Handle Custom Food Submit
  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customCalories || !customProtein) return;

    saveCustomFood({
      name: customName,
      category: customCategory,
      qtyType: customQtyType,
      calories: parseInt(customCalories) || 0,
      protein: parseFloat(customProtein) || 0
    });

    // Reset fields
    setCustomName('');
    setCustomCalories('');
    setCustomProtein('');
    setShowAddCustom(false);
  };

  // Select food to log
  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    // Set a sensible default quantity
    if (food.qtyType === 'Gram' || food.qtyType === 'ml') {
      setLogQty(100); // 100g or 100ml default
    } else {
      setLogQty(1); // 1 count / bowl default
    }
  };

  // Perform actual food logging
  const handleLogFoodSubmit = () => {
    if (!selectedFood) return;

    let calMultiplier = logQty;
    let protMultiplier = logQty;

    // Scale grams or ml based on a 100-unit baseline
    if (selectedFood.qtyType === 'Gram' || selectedFood.qtyType === 'ml') {
      calMultiplier = logQty / 100;
      protMultiplier = logQty / 100;
    }

    addFoodLog(
      selectedFood.id,
      selectedFood.name,
      selectedFood.category,
      logQty,
      selectedFood.qtyType,
      selectedFood.calories * calMultiplier,
      selectedFood.protein * protMultiplier
    );

    setSelectedFood(null);
  };

  return (
    <div className="space-y-6" id="food-screen">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" id="food-title-section">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles size={20} className="text-[#4ADE80]" /> Food & Macronutrient Directory
          </h1>
          <p className="text-xs text-[#A1A1AA]">Search and log built-in Indian foods or create your custom recipes.</p>
        </div>
        <button
          id="toggle-custom-food-form"
          onClick={() => setShowAddCustom(!showAddCustom)}
          className="w-full sm:w-auto bg-[#4ADE80] text-[#0F1117] font-bold text-xs p-3 px-5 rounded-full hover:bg-emerald-400 transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Plus size={16} /> Create Custom Food
        </button>
      </div>

      {/* Slide-out Add Custom Food panel */}
      {showAddCustom && (
        <div className="bg-[#1A1D24] p-5 rounded-[24px] border border-[#4ADE80]/20 space-y-4 animate-fadeIn" id="custom-food-form">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider">New Custom Food recipe</h3>
          <form onSubmit={handleCreateCustom} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
            <div className="flex flex-col space-y-1.5 col-span-1 sm:col-span-2">
              <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="food-name">Food Name</label>
              <input
                id="food-name"
                type="text"
                required
                placeholder="e.g. Chicken Tikka Salvin"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="bg-[#0F1117] text-white text-xs p-3 rounded-xl border border-white/5 focus:border-[#4ADE80] outline-none"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="food-category">Category</label>
              <select
                id="food-category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="bg-[#0F1117] text-white text-xs p-3 rounded-xl border border-white/5 outline-none cursor-pointer"
              >
                <option value="Proteins">Proteins</option>
                <option value="Dairy">Dairy</option>
                <option value="Grains">Grains</option>
                <option value="Main Meals">Main Meals</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Snacks">Snacks</option>
                <option value="Fruits">Fruits</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="food-qty-type">Qty unit</label>
              <select
                id="food-qty-type"
                value={customQtyType}
                onChange={(e) => setCustomQtyType(e.target.value as QtyType)}
                className="bg-[#0F1117] text-white text-xs p-3 rounded-xl border border-white/5 outline-none cursor-pointer"
              >
                <option value="Gram">Gram (per 100g)</option>
                <option value="ml">ml (per 100ml)</option>
                <option value="Count">Count (per piece)</option>
                <option value="Piece">Piece (per piece)</option>
                <option value="Bowl">Bowl (per bowl)</option>
                <option value="Cup">Cup (per cup)</option>
                <option value="Scoop">Scoop (per scoop)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2.5 col-span-1 sm:col-span-2 md:col-span-1">
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="food-calories">Kcal</label>
                <input
                  id="food-calories"
                  type="number"
                  required
                  placeholder="e.g. 150"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(e.target.value)}
                  className="bg-[#0F1117] text-white text-xs p-3 rounded-xl border border-white/5 outline-none"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] text-[#A1A1AA] uppercase tracking-wider" htmlFor="food-protein">Protein (g)</label>
                <input
                  id="food-protein"
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 8"
                  value={customProtein}
                  onChange={(e) => setCustomProtein(e.target.value)}
                  className="bg-[#0F1117] text-white text-xs p-3 rounded-xl border border-white/5 outline-none"
                />
              </div>
            </div>

            <div className="flex items-end col-span-1 sm:col-span-2 md:col-span-5 justify-end gap-2 text-right">
              <button
                id="cancel-custom-food"
                type="button"
                onClick={() => setShowAddCustom(false)}
                className="text-[#A1A1AA] hover:text-white text-xs font-semibold px-4 py-3 rounded-xl hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                id="submit-custom-food"
                type="submit"
                className="bg-[#0F1117] border border-emerald-400 text-[#4ADE80] text-xs font-bold px-5 py-3 rounded-xl hover:bg-[#4ADE80]/10 transition cursor-pointer"
              >
                Save Food Item
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Search and Storage Filter Tabs */}
      <div className="space-y-4" id="food-filter-controls">
        <div className="relative" id="food-search-bar">
          <Search className="absolute left-4 top-3.5 text-[#A1A1AA]" size={18} />
          <input
            id="food-search-input"
            type="text"
            placeholder="Search healthy proteins, Roti, Chicken, Eggs, Paneer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1D24] text-white text-sm p-3.5 pl-12 rounded-2xl border border-white/5 focus:border-[#4ADE80] outline-none transition"
          />
        </div>

        {/* Filters and scopes */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex bg-[#1A1D24] p-1 rounded-full border border-white/5" id="scope-selectors">
            <button
              id="filter-scope-all"
              onClick={() => { setFilterType('all'); setActiveCategory('All'); }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                filterType === 'all' ? 'bg-[#4ADE80] text-[#0F1117] font-bold' : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              All Foods
            </button>
            <button
              id="filter-scope-favs"
              onClick={() => setFilterType('favorites')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1 ${
                filterType === 'favorites' ? 'bg-[#4ADE80] text-[#0F1117] font-bold' : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              ❤️ Favorites
            </button>
            <button
              id="filter-scope-recents"
              onClick={() => setFilterType('recents')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                filterType === 'recents' ? 'bg-[#4ADE80] text-[#0F1117] font-bold' : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              ⚡ Recents
            </button>
            <button
              id="filter-scope-custom"
              onClick={() => setFilterType('custom')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                filterType === 'custom' ? 'bg-[#4ADE80] text-[#0F1117] font-bold' : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              🛠️ Custom
            </button>
          </div>
        </div>

        {/* Category specific pills (Only visible if filterType === 'all') */}
        {filterType === 'all' && (
          <div className="flex overflow-x-auto gap-2 py-1 scrollbar-hide" id="category-pills">
            {FOOD_CATEGORIES.map(category => (
              <button
                id={`pill-cat-${category.toLowerCase().replace(' ', '-')}`}
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs transition ${
                  activeCategory === category 
                    ? 'bg-[#1A1D24] border border-[#4ADE80] text-[#4ADE80] font-semibold' 
                    : 'bg-[#1A1D24] border border-white/5 text-[#A1A1AA] hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Directory Foods List */}
      {filteredFoods.length === 0 ? (
        <div className="bg-[#1A1D24] p-12 rounded-[24px] border border-white/5 text-center text-[#A1A1AA] text-sm" id="empty-food-list">
          No food items matched your query. Click **Create Custom Food** above to add yours!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="food-items-grid">
          {filteredFoods.map((food) => {
            const isFav = favorites.includes(food.id);
            return (
              <div
                id={`food-card-${food.id}`}
                key={food.id}
                className="bg-[#1A1D24] p-5.5 rounded-[24px] border border-white/5 flex flex-col justify-between hover:border-white/10 transition group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] text-[#4ADE80] bg-[#4ADE80]/10 font-bold px-2 py-0.5 rounded-md">
                      {food.category}
                    </span>
                    <button
                      id={`favorite-${food.id}`}
                      onClick={() => toggleFavorite(food.id)}
                      className={`p-1.5 rounded-full hover:bg-white/5 transition flex items-center justify-center cursor-pointer ${
                        isFav ? 'text-[#EF4444]' : 'text-[#A1A1AA] group-hover:text-white'
                      }`}
                    >
                      <Heart size={16} fill={isFav ? '#EF4444' : 'none'} />
                    </button>
                  </div>
                  <h3 className="text-white font-semibold text-sm mt-2.5 leading-snug">{food.name}</h3>
                  <p className="text-[10px] text-[#A1A1AA] mt-1 uppercase tracking-wider">
                    Base: 1 {food.qtyType === 'Gram' ? '100g' : food.qtyType === 'ml' ? '100ml' : food.qtyType}
                  </p>
                </div>

                <div className="flex justify-between items-end mt-4 pt-4 border-t border-white/5">
                  <div className="text-left font-mono">
                    <div className="text-white text-sm font-bold">{food.calories} kcal</div>
                    <div className="text-[#A1A1AA] text-[10px] mt-0.5">{food.protein}g protein</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {food.isCustom && (
                      <button
                        id={`delete-custom-food-btn-${food.id}`}
                        onClick={() => deleteCustomFood(food.id)}
                        className="text-red-400 hover:text-red-300 text-xs px-2.5 py-1.5 rounded-lg hover:bg-red-400/10 transition"
                      >
                        Delete
                      </button>
                    )}
                    <button
                      id={`log-food-selection-${food.id}`}
                      onClick={() => handleSelectFood(food)}
                      className="bg-[#0F1117] hover:bg-[#4ADE80] hover:text-[#0F1117] p-2 px-3 rounded-xl border border-white/5 text-[#4ADE80] text-xs font-bold transition duration-200 cursor-pointer flex items-center gap-1"
                    >
                      <Plus size={14} /> Log
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Log Quantity Selection Popup Modal */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" id="log-quantity-overlay">
          <div className="bg-[#1A1D24] border border-white/10 rounded-[28px] w-full max-w-sm p-6 space-y-5 animate-fadeIn" id="log-quantity-card">
            <div>
              <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">{selectedFood.category}</span>
              <h3 className="text-white font-bold text-lg leading-snug mt-0.5">{selectedFood.name}</h3>
              <p className="text-[#A1A1AA] text-xs mt-1">Specify how much you consumed today</p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <div className="flex justify-between">
                  <label className="text-xs text-[#A1A1AA]" htmlFor="log-quantity-input">Quantity ({selectedFood.qtyType})</label>
                  <span className="text-xs text-[#4ADE80] font-bold">{logQty} {selectedFood.qtyType}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    id="log-quantity-input"
                    type="number"
                    min="0.1"
                    step={selectedFood.qtyType === 'Gram' || selectedFood.qtyType === 'ml' ? '10' : '0.5'}
                    value={logQty}
                    onChange={(e) => setLogQty(parseFloat(e.target.value) || 1)}
                    className="flex-1 bg-[#0F1117] text-white text-sm font-bold p-3 rounded-xl border border-white/5 outline-none"
                  />
                  {/* Gram baseline selectors */}
                  {(selectedFood.qtyType === 'Gram' || selectedFood.qtyType === 'ml') && (
                    <div className="flex gap-1">
                      <button
                        id="shortcut-qty-50"
                        onClick={() => setLogQty(50)}
                        className="bg-[#0F1117] hover:bg-white/5 text-white text-xs font-semibold px-2 rounded-lg border border-white/5"
                      >
                        50
                      </button>
                      <button
                        id="shortcut-qty-100"
                        onClick={() => setLogQty(100)}
                        className="bg-[#0F1117] hover:bg-white/5 text-white text-xs font-semibold px-2 rounded-lg border border-white/5"
                      >
                        100
                      </button>
                      <button
                        id="shortcut-qty-200"
                        onClick={() => setLogQty(200)}
                        className="bg-[#0F1117] hover:bg-white/5 text-white text-xs font-semibold px-2 rounded-lg border border-white/5"
                      >
                        200
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Live Macros Scale Summary Section */}
              <div className="bg-[#0F1117] p-3.5 rounded-2xl border border-white/5 space-y-2 text-left" id="scale-indicator-panel">
                <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1">
                  <Scale size={12} className="text-[#4ADE80]" /> Dynamic Scale Preview
                </p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <span className="text-[10px] text-[#A1A1AA]">Calories</span>
                    <p className="text-sm font-bold text-white font-mono">
                      {Math.round(
                        selectedFood.calories * (selectedFood.qtyType === 'Gram' || selectedFood.qtyType === 'ml' ? logQty / 100 : logQty)
                      )} kcal
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#A1A1AA]">Protein</span>
                    <p className="text-sm font-bold text-white font-mono">
                      {(
                        selectedFood.protein * (selectedFood.qtyType === 'Gram' || selectedFood.qtyType === 'ml' ? logQty / 100 : logQty)
                      ).toFixed(1)}g
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                id="cancel-log-quantity"
                onClick={() => setSelectedFood(null)}
                className="text-[#A1A1AA] hover:text-white text-xs font-semibold px-4 py-3 rounded-xl hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                id="confirm-log-quantity"
                onClick={handleLogFoodSubmit}
                className="bg-[#4ADE80] hover:bg-emerald-400 text-[#0F1117] font-bold text-xs p-3 px-5 rounded-xl transition duration-150 cursor-pointer"
              >
                Add to Daily Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
