/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { WeightLog, FoodLog, WaterLog, UserProfile } from '../types';
import { getISTPastDateKeys } from '../utils/dateUtils';

interface ChartProps {
  weightLogs: WeightLog[];
  foodLogs: FoodLog[];
  waterLogs: WaterLog[];
  profile: UserProfile;
}

// Helper to format ISO Date to Short human-readable string (e.g. "Jun 14")
function formatShortDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

// Generate past 7 days dates
function getPast7Days(): string[] {
  return getISTPastDateKeys(7);
}

export default function ChartsSection({ weightLogs, foodLogs, waterLogs, profile }: ChartProps) {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const [activeTab, setActiveTab] = useState<'weight' | 'calories' | 'protein' | 'water'>('weight');

  const daysToShow = timeframe === 'weekly' ? 7 : 30;

  // Let's establish recent dates list
  const dateKeys = getISTPastDateKeys(daysToShow);

  // 1. Weight Chart Data
  const weightData = dateKeys.map(date => {
    // Find weight for this date, or propagate carryforward (latest known weight)
    const exactLog = weightLogs.find(l => l.date === date);
    if (exactLog) return { date, value: exactLog.weightKg, isReal: true };
    
    // Carryforward logic or default to profile start weight
    const earlierLogs = weightLogs.filter(l => l.date <= date).sort((a,b) => b.date.localeCompare(a.date));
    if (earlierLogs.length > 0) {
      return { date, value: earlierLogs[0].weightKg, isReal: false };
    }
    return { date, value: profile.currentWeightKg, isReal: false };
  });

  // Calculate Average Weight
  const realWeights = weightLogs.filter(l => {
    const logDate = new Date(l.date);
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - daysToShow);
    return logDate >= limitDate;
  });
  const avgWeight = realWeights.length > 0 
    ? (realWeights.reduce((sum, l) => sum + l.weightKg, 0) / realWeights.length).toFixed(1)
    : profile.currentWeightKg.toFixed(1);

  // 2. Calories & Protein Data
  // Group food logs by date (local time YYYY-MM-DD format)
  const getDailyTotals = (date: string) => {
    const dayLogs = foodLogs.filter(l => l.timestamp.startsWith(date));
    const kCal = dayLogs.reduce((sum, l) => sum + l.calories, 0);
    const prot = dayLogs.reduce((sum, l) => sum + l.protein, 0);
    return { calories: kCal, protein: prot };
  };

  const caloriesData = dateKeys.map(date => ({
    date,
    value: getDailyTotals(date).calories
  }));

  const proteinData = dateKeys.map(date => ({
    date,
    value: getDailyTotals(date).protein
  }));

  const totalCaloriesPeriod = caloriesData.reduce((sum, d) => sum + d.value, 0);
  const avgCalories = (totalCaloriesPeriod / daysToShow).toFixed(0);

  const totalProteinPeriod = proteinData.reduce((sum, d) => sum + d.value, 0);
  const avgProtein = (totalProteinPeriod / daysToShow).toFixed(1);

  // 3. Water Data
  const getWaterTotal = (date: string) => {
    return waterLogs
      .filter(l => l.timestamp.startsWith(date))
      .reduce((sum, l) => sum + l.amountMl, 0);
  };

  const waterData = dateKeys.map(date => ({
    date,
    value: getWaterTotal(date)
  }));

  const totalWaterPeriod = waterData.reduce((sum, d) => sum + d.value, 0);
  const avgWater = (totalWaterPeriod / daysToShow).toFixed(0);

  // Renderer for state detail text
  return (
    <div className="bg-[#1A1D24] p-5 rounded-[24px] border border-white/5 space-y-5" id="charts-container">
      {/* Timeframe & Category Headers */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-white font-medium text-lg leading-tight" id="charts-main-title">Analytics Progress</h3>
          <p className="text-[#A1A1AA] text-xs">Based on user localStorage logs</p>
        </div>
        <div className="flex bg-[#0F1117] p-1 rounded-full border border-white/5 self-stretch sm:self-auto" id="timeframe-selector">
          <button
            id="tab-btn-weekly"
            onClick={() => setTimeframe('weekly')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-full text-xs font-medium transition ${
              timeframe === 'weekly' ? 'bg-[#4ADE80] text-[#0F1117] font-bold' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Weekly
          </button>
          <button
            id="tab-btn-monthly"
            onClick={() => setTimeframe('monthly')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-full text-xs font-medium transition ${
              timeframe === 'monthly' ? 'bg-[#4ADE80] text-[#0F1117] font-bold' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="grid grid-cols-4 gap-1.5 bg-[#0F1117] p-1 rounded-2xl border border-white/5" id="chart-metrics-tabs">
        <button
          id="btn-metric-weight"
          onClick={() => setActiveTab('weight')}
          className={`py-2 px-1 rounded-xl text-center transition ${
            activeTab === 'weight' ? 'bg-[#1A1D24] text-[#4ADE80]' : 'text-[#A1A1AA]'
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider">Weight</div>
          <div className="text-sm font-semibold text-white mt-0.5">{avgWeight}kg <span className="text-[10px] text-[#A1A1AA] font-normal">avg</span></div>
        </button>
        <button
          id="btn-metric-calories"
          onClick={() => setActiveTab('calories')}
          className={`py-2 px-1 rounded-xl text-center transition ${
            activeTab === 'calories' ? 'bg-[#1A1D24] text-[#4ADE80]' : 'text-[#A1A1AA]'
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider">Calories</div>
          <div className="text-sm font-semibold text-white mt-0.5">{avgCalories} <span className="text-[10px] font-normal text-[#A1A1AA]">avg</span></div>
        </button>
        <button
          id="btn-metric-protein"
          onClick={() => setActiveTab('protein')}
          className={`py-2 px-1 rounded-xl text-center transition ${
            activeTab === 'protein' ? 'bg-[#1A1D24] text-[#4ADE80]' : 'text-[#A1A1AA]'
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider">Protein</div>
          <div className="text-sm font-semibold text-white mt-0.5">{avgProtein}g <span className="text-[10px] font-normal text-[#A1A1AA]">avg</span></div>
        </button>
        <button
          id="btn-metric-water"
          onClick={() => setActiveTab('water')}
          className={`py-2 px-1 rounded-xl text-center transition ${
            activeTab === 'water' ? 'bg-[#1A1D24] text-[#4ADE80]' : 'text-[#A1A1AA]'
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider">Water</div>
          <div className="text-sm font-semibold text-white mt-0.5">{avgWater}ml <span className="text-[10px] font-normal text-[#A1A1AA]">avg</span></div>
        </button>
      </div>

      {/* Render selected Chart */}
      <div className="relative pt-2" id="canvas-wrapper">
        {activeTab === 'weight' && (
          <WeightChartWidget
            data={weightData}
            targetWeight={profile.targetWeightKg}
            daysToShow={daysToShow}
          />
        )}
        {activeTab === 'calories' && (
          <BarChartWidget
            data={caloriesData}
            goal={profile.caloriesGoal}
            color="#4ADE80"
            daysToShow={daysToShow}
            unit="kcal"
          />
        )}
        {activeTab === 'protein' && (
          <BarChartWidget
            data={proteinData}
            goal={profile.proteinGoal}
            color="#38BDF8"
            daysToShow={daysToShow}
            unit="g"
          />
        )}
        {activeTab === 'water' && (
          <BarChartWidget
            data={waterData}
            goal={profile.waterGoalMl}
            color="#60A5FA"
            daysToShow={daysToShow}
            unit="ml"
          />
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------------------------------------------------------------------------------
// Weight Line Chart Custom SVG implementation
// -------------------------------------------------------------------------------------------------------------------------------------------------
function WeightChartWidget({ data, targetWeight, daysToShow }: { data: { date: string; value: number; isReal: boolean }[]; targetWeight: number; daysToShow: number }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const values = data.map(d => d.value);
  const minVal = Math.min(targetWeight, ...values) - 2;
  const maxVal = Math.max(targetWeight, ...values) + 2;
  const range = maxVal - minVal || 10;

  const width = 500;
  const height = 180;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Convert array index and data value into SVG relative pixels
  const getX = (idx: number) => paddingLeft + (idx / (data.length - 1)) * chartWidth;
  const getY = (val: number) => paddingTop + chartHeight - ((val - minVal) / range) * chartHeight;

  // Construct coordinates
  const coords = data.map((d, index) => ({
    x: getX(index),
    y: getY(d.value),
    date: d.date,
    value: d.value,
    isReal: d.isReal,
    index
  }));

  // Build SVG Path points
  let pathD = '';
  coords.forEach((coord, i) => {
    if (i === 0) {
      pathD = `M ${coord.x} ${coord.y}`;
    } else {
      pathD += ` L ${coord.x} ${coord.y}`;
    }
  });

  // Calculate target weight Y coordinate
  const targetY = getY(targetWeight);

  // Label ticks for X-Axis (show around 5 ticks)
  const tickStep = Math.max(1, Math.floor(data.length / 5));
  const xticks = coords.filter((c, i) => i % tickStep === 0 || i === data.length - 1);

  return (
    <div className="relative" id="weight-chart-widget">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none" id="weight-svg">
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const val = minVal + pct * range;
          const y = getY(val);
          return (
            <g key={idx} className="opacity-20">
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#A1A1AA" strokeWidth="0.5" strokeDasharray="2 2" />
              <text x={paddingLeft - 5} y={y + 3} fill="#A1A1AA" fontSize="8" textAnchor="end">{val.toFixed(0)}</text>
            </g>
          );
        })}

        {/* Target Weight line */}
        <g>
          <line x1={paddingLeft} y1={targetY} x2={width - paddingRight} y2={targetY} stroke="#EF4444" strokeWidth="1" strokeDasharray="3 3" className="opacity-70" />
          <text x={width - paddingRight} y={targetY - 4} fill="#EF4444" fontSize="8" fontWeight="600" textAnchor="end">Goal ({targetWeight}kg)</text>
        </g>

        {/* Connection Trend Line */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="#4ADE80"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Points with hovering interaction */}
        {coords.map((c, i) => (
          <g key={i}>
            {/* Draw dot only if real measurement or high contrast hover */}
            <circle
              cx={c.x}
              cy={c.y}
              r={hoverIndex === i ? 6 : c.isReal ? 3.5 : 2}
              fill={c.isReal ? '#4ADE80' : '#1A1D24'}
              stroke="#4ADE80"
              strokeWidth="1.5"
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            />
          </g>
        ))}

        {/* X Axis Labels */}
        {xticks.map((tick, i) => (
          <text key={i} x={tick.x} y={height - 8} fill="#A1A1AA" fontSize="8" textAnchor="middle" className="opacity-80">
            {formatShortDate(tick.date)}
          </text>
        ))}
      </svg>

      {/* Tooltip Overlay */}
      {hoverIndex !== null && coords[hoverIndex] && (
        <div 
          className="absolute bg-[#1F2430] border border-white/10 px-3 py-1.5 rounded-xl shadow-xl pointer-events-none text-left z-10"
          style={{
            left: `${(coords[hoverIndex].x / width) * 100}%`,
            top: `${(coords[hoverIndex].y / height) * 100 - 15}%`,
            transform: 'translate(-50%, -100%)'
          }}
          id="chart-tooltip"
        >
          <p className="text-[10px] text-[#A1A1AA] leading-none">{formatShortDate(coords[hoverIndex].date)}</p>
          <p className="text-xs font-bold text-white mt-1">
            {coords[hoverIndex].value.toFixed(1)} kg 
            <span className="text-[9px] font-normal ml-1.5 text-[#A1A1AA]">
              {coords[hoverIndex].isReal ? '(Logged)' : '(Estimated)'}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------------------------------------------------------------------------------------------
// Grouped / Single Bar Chart Custom SVG implementation for Calories, Protein, Water
// -------------------------------------------------------------------------------------------------------------------------------------------------
function BarChartWidget({ data, goal, color, daysToShow, unit }: { data: { date: string; value: number }[]; goal: number; color: string; daysToShow: number; unit: string }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const values = data.map(d => d.value);
  const maxVal = Math.max(goal, ...values, 10);
  const range = maxVal;

  const width = 500;
  const height = 180;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const barCount = data.length;
  // Dynamic bar sizing for weekly vs monthly view
  const spacing = daysToShow === 7 ? 12 : 3;
  const barWidth = (chartWidth - (spacing * (barCount - 1))) / barCount;

  // Calculate coordinates
  const bars = data.map((d, index) => {
    const x = paddingLeft + index * (barWidth + spacing);
    const valueRatio = Math.min(1, d.value / range);
    const barHeight = valueRatio * chartHeight;
    const y = paddingTop + chartHeight - barHeight;

    return {
      x,
      y,
      w: barWidth,
      h: Math.max(2, barHeight), // min 2px to show tiny bar
      value: d.value,
      date: d.date,
      index
    };
  });

  const goalY = paddingTop + chartHeight - Math.min(1, goal / range) * chartHeight;

  // Render around 5 ticks for the X-axis
  const tickStep = Math.max(1, Math.floor(data.length / 5));
  const xticks = bars.filter((b, i) => i % tickStep === 0 || i === data.length - 1);

  return (
    <div className="relative" id="barchart-widget">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none" id="bar-svg">
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const val = pct * range;
          const y = paddingTop + chartHeight - pct * chartHeight;
          return (
            <g key={idx} className="opacity-20">
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#A1A1AA" strokeWidth="0.5" strokeDasharray="2 2" />
              <text x={paddingLeft - 5} y={y + 3} fill="#A1A1AA" fontSize="8" textAnchor="end">{val.toFixed(0)}</text>
            </g>
          );
        })}

        {/* Goal line */}
        {goal > 0 && (
          <g>
            <line x1={paddingLeft} y1={goalY} x2={width - paddingRight} y2={goalY} stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" className="opacity-70" />
            <text x={width - paddingRight} y={goalY - 4} fill="#F59E0B" fontSize="8" fontWeight="600" textAnchor="end">Goal ({goal}{unit})</text>
          </g>
        )}

        {/* Draw Bars */}
        {bars.map((bar, i) => {
          const hasExceeded = bar.value >= goal;
          const isHovered = hoverIndex === i;
          
          return (
            <rect
              key={i}
              x={bar.x}
              y={bar.y}
              width={bar.w}
              height={bar.h}
              rx={daysToShow === 7 ? Math.min(6, bar.w / 2) : 1}
              fill={isHovered ? color : hasExceeded && goal > 0 ? '#4ADE80' : color}
              opacity={isHovered ? 1.0 : hasExceeded && goal > 0 ? 0.9 : 0.65}
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            />
          );
        })}

        {/* X Axis Labels */}
        {xticks.map((tick, i) => (
          <text key={i} x={tick.x + tick.w / 2} y={height - 8} fill="#A1A1AA" fontSize="8" textAnchor="middle" className="opacity-80">
            {formatShortDate(tick.date)}
          </text>
        ))}
      </svg>

      {/* Tooltip Over overlay */}
      {hoverIndex !== null && bars[hoverIndex] && (
        <div 
          className="absolute bg-[#1F2430] border border-white/10 px-3 py-1.5 rounded-xl shadow-xl pointer-events-none text-left z-10"
          style={{
            left: `${((bars[hoverIndex].x + bars[hoverIndex].w / 2) / width) * 100}%`,
            top: `${(bars[hoverIndex].y / height) * 100 - 15}%`,
            transform: 'translate(-50%, -100%)'
          }}
          id="bar-tooltip"
        >
          <p className="text-[10px] text-[#A1A1AA] leading-none">{formatShortDate(bars[hoverIndex].date)}</p>
          <p className="text-xs font-bold text-white mt-1">
            {bars[hoverIndex].value} {unit}
          </p>
          {goal > 0 && (
            <p className="text-[9px] mt-0.5" style={{ color: bars[hoverIndex].value >= goal ? '#4ADE80' : '#F59E0B' }}>
              {bars[hoverIndex].value >= goal 
                ? 'Goal Met! 🎉' 
                : `${(goal - bars[hoverIndex].value).toFixed(0)} ${unit} below goal`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
