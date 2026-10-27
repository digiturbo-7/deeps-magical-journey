import React, { useState, useEffect } from 'react';
import { 
  Utensils, Search, Plus, Trash2, Copy, CheckCircle2, 
  ChevronLeft, ChevronRight, Calendar, Sparkles, Scale, 
  HelpCircle, ChevronDown, ChevronUp, AlertCircle 
} from 'lucide-react';
import { UserProfile, FoodLog } from '../../types';
import { 
  getPlanForDate, getDayCalorieMetrics, logPlannedMealAsEaten, 
  addCustomFoodLog, deleteFoodLogEntry, copyYesterdayFoodLogs, 
  DayCalorieMetrics 
} from '../../services/plan240Service';
import { INDIAN_FOOD_DATABASE } from '../../data/planData240';
import { formatDisplayDate, getLocalDateString } from '../../utils/dateUtils';
import confetti from 'canvas-confetti';

interface DietViewProps {
  profile: UserProfile;
  selectedDateStr: string;
  onChangeSelectedDate: (newDate: string) => void;
  onAskAI: (prompt: string) => void;
}

export const DietView: React.FC<DietViewProps> = ({
  profile,
  selectedDateStr,
  onChangeSelectedDate,
  onAskAI
}) => {
  const [subTab, setSubTab] = useState<'plan' | 'diary' | 'database' | 'scale'>('plan');
  const [metrics, setMetrics] = useState<DayCalorieMetrics | null>(null);
  
  // Selected meal options state
  const [selectedBreakfastIdx, setSelectedBreakfastIdx] = useState(0);
  const [selectedLunchIdx, setSelectedLunchIdx] = useState(0);
  const [selectedDinnerIdx, setSelectedDinnerIdx] = useState(0);
  
  // Food Database search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoodCategory, setSelectedFoodCategory] = useState<string>('All');

  // Custom Food Form state
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customMealType, setCustomMealType] = useState<'breakfast' | 'lunch' | 'snack' | 'dinner'>('lunch');
  const [customGrams, setCustomGrams] = useState(100);
  const [customCals, setCustomCals] = useState(150);
  const [customProt, setCustomProt] = useState(5);
  const [customCarbs, setCustomCarbs] = useState(20);
  const [customFat, setCustomFat] = useState(3);

  // Kitchen Scale Calculator State
  const [scaleRawGrams, setScaleRawGrams] = useState(50);
  const [scaleFoodType, setScaleFoodType] = useState<'rice' | 'dal' | 'chicken' | 'atta'>('rice');

  const loadMetrics = async () => {
    const data = await getDayCalorieMetrics(selectedDateStr, profile);
    setMetrics(data);
  };

  useEffect(() => {
    loadMetrics();
  }, [selectedDateStr, profile]);

  const plan = getPlanForDate(selectedDateStr);

  // Date Navigation handlers
  const handlePrevDay = () => {
    const parts = selectedDateStr.split('-');
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    d.setDate(d.getDate() - 1);
    onChangeSelectedDate(getLocalDateString(d));
  };

  const handleNextDay = () => {
    const parts = selectedDateStr.split('-');
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    d.setDate(d.getDate() + 1);
    onChangeSelectedDate(getLocalDateString(d));
  };

  // Log meal from plan
  const handleLogPlannedMeal = async (
    mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner',
    optText: string,
    fallbackCals: number,
    fallbackP: number
  ) => {
    let cals = fallbackCals;
    let prot = fallbackP;
    let carbs = 35;
    let fat = 8;

    const matchCals = optText.match(/(\d+)\s*kcal/);
    if (matchCals) cals = parseInt(matchCals[1], 10);

    const matchP = optText.match(/(\d+)g\s*P/);
    if (matchP) prot = parseInt(matchP[1], 10);

    const matchC = optText.match(/(\d+)g\s*C/);
    if (matchC) carbs = parseInt(matchC[1], 10);

    const matchF = optText.match(/(\d+)g\s*F/);
    if (matchF) fat = parseInt(matchF[1], 10);

    const titleOnly = optText.split('[')[0].trim();

    await logPlannedMealAsEaten(selectedDateStr, mealType, titleOnly, cals, prot, carbs, fat, optText);
    await loadMetrics();
    confetti({ particleCount: 35, spread: 40, origin: { y: 0.6 } });
    alert(`Logged to Actual Food Diary: "${titleOnly}" (${cals} kcal, ${prot}g protein)`);
  };

  // Add from Indian Food Database
  const handleAddFromDatabase = async (food: typeof INDIAN_FOOD_DATABASE[0], mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner') => {
    await addCustomFoodLog({
      date: selectedDateStr,
      mealType,
      foodName: food.name,
      weightGrams: 100,
      caloriesApprox: food.cals,
      proteinApprox: food.protein,
      carbsApprox: food.carbs,
      fatApprox: food.fat,
      notes: `${food.portion} (Local DB)`
    });
    await loadMetrics();
    confetti({ particleCount: 35, spread: 40, origin: { y: 0.6 } });
    alert(`Added "${food.name}" to your ${mealType} log!`);
  };

  // Add Custom Food
  const handleSaveCustomFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    await addCustomFoodLog({
      date: selectedDateStr,
      mealType: customMealType,
      foodName: customName.trim(),
      weightGrams: Number(customGrams) || 100,
      caloriesApprox: Number(customCals) || 0,
      proteinApprox: Number(customProt) || 0,
      carbsApprox: Number(customCarbs) || 0,
      fatApprox: Number(customFat) || 0,
      notes: 'Custom food entry'
    });

    setCustomName('');
    setIsCustomModalOpen(false);
    await loadMetrics();
    confetti({ particleCount: 40, spread: 45, origin: { y: 0.6 } });
  };

  // Delete log entry
  const handleDeleteLog = async (id: number) => {
    if (confirm('Delete this food entry from your actual log?')) {
      await deleteFoodLogEntry(id);
      await loadMetrics();
    }
  };

  // Copy yesterday's meals
  const handleCopyYesterday = async () => {
    const copiedCount = await copyYesterdayFoodLogs(selectedDateStr);
    if (copiedCount === 0) {
      alert('No logged meals found on yesterday to copy.');
    } else {
      await loadMetrics();
      confetti({ particleCount: 45, spread: 50, origin: { y: 0.6 } });
      alert(`Copied ${copiedCount} meals from yesterday!`);
    }
  };

  // Filtered Food Database items
  const filteredFoods = INDIAN_FOOD_DATABASE.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedFoodCategory === 'All') return matchesSearch;
    if (selectedFoodCategory === 'Veg') return matchesSearch && f.isVeg;
    if (selectedFoodCategory === 'Non-Veg') return matchesSearch && !f.isVeg;
    return matchesSearch && f.category === selectedFoodCategory;
  });

  return (
    <div className="space-y-6 pb-24 animate-fadeIn max-w-4xl mx-auto px-4 pt-3 font-sans">
      
      {/* Header & Sub-Tabs Navigation */}
      <div className="rounded-3xl bg-white p-5 border border-cream-300 shadow-soft">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="p-2.5 bg-roseDust-100 text-roseDust-600 rounded-2xl">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-plum-950">
                Daily Diet & Food Diary
              </h2>
              <p className="text-xs sm:text-sm text-plum-500">
                Complete 240-day menu • South Indian home food • Local food tracker
              </p>
            </div>
          </div>

          {/* Date Selector */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevDay}
              className="p-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-plum-800 border border-cream-300"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-plum-900 bg-cream-50 px-3 py-1.5 rounded-xl border border-cream-200">
              {formatDisplayDate(selectedDateStr, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <button
              onClick={handleNextDay}
              className="p-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-plum-800 border border-cream-300"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Clean Sub-Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-cream-100 rounded-2xl">
          <button
            onClick={() => setSubTab('plan')}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition-all ${
              subTab === 'plan' ? 'bg-white text-plum-950 shadow-sm' : 'text-plum-600 hover:text-plum-900'
            }`}
          >
            📋 Daily Planned Diet
          </button>
          <button
            onClick={() => setSubTab('diary')}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition-all ${
              subTab === 'diary' ? 'bg-white text-plum-950 shadow-sm' : 'text-plum-600 hover:text-plum-900'
            }`}
          >
            ✍️ Actual Food Diary ({metrics?.loggedFoods.length || 0})
          </button>
          <button
            onClick={() => setSubTab('database')}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition-all ${
              subTab === 'database' ? 'bg-white text-plum-950 shadow-sm' : 'text-plum-600 hover:text-plum-900'
            }`}
          >
            🔍 Indian Food Search
          </button>
          <button
            onClick={() => setSubTab('scale')}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition-all ${
              subTab === 'scale' ? 'bg-white text-plum-950 shadow-sm' : 'text-plum-600 hover:text-plum-900'
            }`}
          >
            ⚖️ Kitchen Scale Guide
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: COMPLETE DAILY PLANNED DIET */}
      {subTab === 'plan' && (
        <div className="space-y-4">
          
          {/* Day Theme Banner */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-roseDust-50 to-cream-50 border border-roseDust-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-roseDust-700 block">
                Day {plan.day} Menu Theme
              </span>
              <h3 className="font-serif font-bold text-lg text-plum-950 mt-0.5">
                {plan.diet.menuName}
              </h3>
              <p className="text-xs text-plum-600 mt-0.5">
                Planned Daily Totals: ~{plan.diet.totalCals} kcal • {plan.diet.totalP}g Protein • {plan.diet.totalC}g Carbs • {plan.diet.totalF}g Fat • Est. Cost: ₹{plan.diet.totalCost}
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span className="px-3 py-1 rounded-full bg-white text-plum-800 text-xs font-bold border border-cream-300">
                Budget: ₹{plan.diet.totalCost}/day
              </span>
            </div>
          </div>

          {/* Meals list */}
          <div className="space-y-4">
            
            {/* Breakfast */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-cream-300 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-roseDust-700">
                  Breakfast • 8:30 – 9:30 AM
                </span>
                <span className="text-xs text-plum-500 font-medium">
                  Est. Cost: ₹{plan.diet.breakfast.cost}
                </span>
              </div>

              {/* Options Pills */}
              <div className="flex space-x-1.5 mb-3 overflow-x-auto no-scrollbar">
                {plan.diet.breakfast.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedBreakfastIdx(idx)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedBreakfastIdx === idx
                        ? 'bg-plum-900 text-white shadow-2xs'
                        : 'bg-cream-100 text-plum-700 hover:bg-cream-200'
                    }`}
                  >
                    Option {idx + 1} {idx === 0 ? '(Recommended)' : idx === 2 ? '(Veg Swap)' : ''}
                  </button>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200">
                <h4 className="text-sm font-bold text-plum-950 leading-snug">
                  {plan.diet.breakfast.options[selectedBreakfastIdx]}
                </h4>
                <div className="mt-2 text-xs text-plum-600 space-y-1">
                  <p><strong>Cooking & Kitchen Scale:</strong> {plan.diet.breakfast.instructions}</p>
                  <p><strong>Substitutions:</strong> {plan.diet.breakfast.substitutions}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end">
                <button
                  onClick={() => handleLogPlannedMeal('breakfast', plan.diet.breakfast.options[selectedBreakfastIdx], plan.diet.breakfast.cals, plan.diet.breakfast.protein)}
                  className="px-4 py-2 bg-roseDust-500 hover:bg-roseDust-600 text-white text-xs font-bold rounded-xl shadow-2xs transition-all active:scale-95"
                >
                  ✓ Confirm & Log as Eaten
                </button>
              </div>
            </div>

            {/* Mid-Morning Refresher */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-cream-300 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-roseDust-700">
                  Mid-Morning Refresher • 11:00 – 11:30 AM
                </span>
                <span className="text-xs text-plum-500 font-medium">
                  Est. Cost: ₹{plan.diet.snackMorning.cost}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plan.diet.snackMorning.options.map((opt, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-plum-500 uppercase">Option {idx + 1}</span>
                      <p className="text-xs font-bold text-plum-900 mt-1">{opt}</p>
                    </div>
                    <button
                      onClick={() => handleLogPlannedMeal('snack', opt, plan.diet.snackMorning.cals, plan.diet.snackMorning.protein)}
                      className="mt-3 text-xs text-roseDust-600 hover:text-roseDust-800 font-bold text-left"
                    >
                      + Log this snack
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Lunch */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-cream-300 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-roseDust-700">
                  Lunch • 1:00 – 2:00 PM
                </span>
                <span className="text-xs text-plum-500 font-medium">
                  Est. Cost: ₹{plan.diet.lunch.cost}
                </span>
              </div>

              <div className="flex space-x-1.5 mb-3 overflow-x-auto no-scrollbar">
                {plan.diet.lunch.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedLunchIdx(idx)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedLunchIdx === idx
                        ? 'bg-plum-900 text-white shadow-2xs'
                        : 'bg-cream-100 text-plum-700 hover:bg-cream-200'
                    }`}
                  >
                    Option {idx + 1} {idx === 0 ? '(Non-Veg)' : idx === 1 ? '(Egg/Fish)' : '(Veg / Dal)'}
                  </button>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200">
                <h4 className="text-sm font-bold text-plum-950 leading-snug">
                  {plan.diet.lunch.options[selectedLunchIdx]}
                </h4>
                <div className="mt-2 text-xs text-plum-600 space-y-1">
                  <p><strong>Kitchen Scale Note:</strong> {plan.diet.lunch.instructions}</p>
                  <p><strong>Substitutions:</strong> {plan.diet.lunch.substitutions}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end">
                <button
                  onClick={() => handleLogPlannedMeal('lunch', plan.diet.lunch.options[selectedLunchIdx], plan.diet.lunch.cals, plan.diet.lunch.protein)}
                  className="px-4 py-2 bg-roseDust-500 hover:bg-roseDust-600 text-white text-xs font-bold rounded-xl shadow-2xs transition-all active:scale-95"
                >
                  ✓ Confirm & Log as Eaten
                </button>
              </div>
            </div>

            {/* Evening Snack */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-cream-300 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-roseDust-700">
                  Evening Snack & Crunch • 5:00 – 6:00 PM
                </span>
                <span className="text-xs text-plum-500 font-medium">
                  Est. Cost: ₹{plan.diet.snackEvening.cost}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plan.diet.snackEvening.options.map((opt, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-plum-500 uppercase">Option {idx + 1}</span>
                      <p className="text-xs font-bold text-plum-900 mt-1">{opt}</p>
                    </div>
                    <button
                      onClick={() => handleLogPlannedMeal('snack', opt, plan.diet.snackEvening.cals, plan.diet.snackEvening.protein)}
                      className="mt-3 text-xs text-roseDust-600 hover:text-roseDust-800 font-bold text-left"
                    >
                      + Log this snack
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Dinner */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-cream-300 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-roseDust-700">
                  Dinner • 8:00 – 9:00 PM
                </span>
                <span className="text-xs text-plum-500 font-medium">
                  Est. Cost: ₹{plan.diet.dinner.cost}
                </span>
              </div>

              <div className="flex space-x-1.5 mb-3 overflow-x-auto no-scrollbar">
                {plan.diet.dinner.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDinnerIdx(idx)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedDinnerIdx === idx
                        ? 'bg-plum-900 text-white shadow-2xs'
                        : 'bg-cream-100 text-plum-700 hover:bg-cream-200'
                    }`}
                  >
                    Option {idx + 1} {idx === 0 ? '(High Protein)' : idx === 1 ? '(Veg Bhurji)' : '(Light Khichdi)'}
                  </button>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200">
                <h4 className="text-sm font-bold text-plum-950 leading-snug">
                  {plan.diet.dinner.options[selectedDinnerIdx]}
                </h4>
                <div className="mt-2 text-xs text-plum-600 space-y-1">
                  <p><strong>Instructions:</strong> {plan.diet.dinner.instructions}</p>
                  <p><strong>Substitutions:</strong> {plan.diet.dinner.substitutions}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end">
                <button
                  onClick={() => handleLogPlannedMeal('dinner', plan.diet.dinner.options[selectedDinnerIdx], plan.diet.dinner.cals, plan.diet.dinner.protein)}
                  className="px-4 py-2 bg-roseDust-500 hover:bg-roseDust-600 text-white text-xs font-bold rounded-xl shadow-2xs transition-all active:scale-95"
                >
                  ✓ Confirm & Log as Eaten
                </button>
              </div>
            </div>

            {/* Pre/Post Workout */}
            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 text-xs text-plum-700">
              <span className="font-bold text-plum-900">Optional Pre / Post Movement Food: </span>
              <span>{plan.diet.prePost}</span>
            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB 2: ACTUAL FOOD DIARY & LOGS */}
      {subTab === 'diary' && (
        <div className="space-y-4">
          
          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-plum-900 hover:bg-plum-950 text-white rounded-2xl text-xs font-bold shadow-soft transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Food / Recipe</span>
            </button>

            <button
              onClick={handleCopyYesterday}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-cream-100 text-plum-800 rounded-2xl text-xs font-bold border border-cream-300 transition-all active:scale-95"
              title="Copy yesterday's logged meals to today"
            >
              <Copy className="w-3.5 h-3.5 text-roseDust-500" />
              <span>Copy Yesterday's Meal</span>
            </button>
          </div>

          {/* Actual Logged Items Table */}
          <div className="rounded-3xl bg-white p-5 border border-cream-300 shadow-soft">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-cream-200">
              <h3 className="font-serif font-bold text-base text-plum-950">
                Actually Consumed Foods on {formatDisplayDate(selectedDateStr, { month: 'short', day: 'numeric' })}
              </h3>
              <span className="text-xs font-bold text-roseDust-600">
                Total: {metrics?.actualCaloriesConsumed || 0} kcal • {metrics?.actualProteinConsumed || 0}g P
              </span>
            </div>

            {!metrics?.loggedFoods.length ? (
              <div className="text-center py-10 space-y-2">
                <Utensils className="w-8 h-8 text-cream-400 mx-auto" />
                <p className="text-xs text-plum-600 font-medium">
                  No foods logged for this date yet.
                </p>
                <p className="text-[11px] text-plum-400">
                  Select a meal from the Planned Diet tab or add custom food above.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-cream-100">
                {metrics.loggedFoods.map((log) => (
                  <div key={log.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-roseDust-50 text-roseDust-700">
                          {log.mealType}
                        </span>
                        <h4 className="font-bold text-plum-950">
                          {log.foodName}
                        </h4>
                      </div>
                      <p className="text-[11px] text-plum-500 mt-0.5">
                        {log.notes || `${log.weightGrams}g portion`}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="text-right">
                        <span className="font-bold text-plum-950 block">{log.caloriesApprox} kcal</span>
                        <span className="text-[11px] text-plum-500">{log.proteinApprox}g P • {log.carbsApprox || 0}g C</span>
                      </div>

                      <button
                        onClick={() => handleDeleteLog(log.id!)}
                        className="p-1.5 text-cream-400 hover:text-softCoral-600 hover:bg-softCoral-50 rounded-lg transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* SUB-TAB 3: SEARCHABLE INDIAN FOOD DATABASE */}
      {subTab === 'database' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-5 border border-cream-300 shadow-soft">
            <h3 className="font-serif font-bold text-base text-plum-950 mb-3">
              Bengaluru & South Indian Food Library (IFCT / NIN Hyderabad)
            </h3>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-plum-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Idli, Dosa, Chicken, Paneer, Rice, Dal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-50 border border-cream-300 text-xs text-plum-900 focus:outline-none focus:border-roseDust-400"
              />
            </div>

            {/* Categories */}
            <div className="flex space-x-1.5 mb-4 overflow-x-auto no-scrollbar">
              {['All', 'Veg', 'Non-Veg', 'Breakfast', 'Grains', 'Dals', 'Proteins', 'Vegetables', 'Snacks', 'Fruits'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFoodCategory(cat)}
                  className={`py-1 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedFoodCategory === cat
                      ? 'bg-plum-900 text-white'
                      : 'bg-cream-100 text-plum-700 hover:bg-cream-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Food Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredFoods.map((f) => (
                <div key={f.id} className="p-3 rounded-2xl bg-cream-50/60 border border-cream-200 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-plum-950">{f.name}</h4>
                    <span className="text-[11px] text-plum-500">{f.portion}</span>
                    <div className="text-[11px] text-plum-600 mt-1">
                      <strong>{f.cals} kcal</strong> • {f.protein}g P • {f.carbs}g C • {f.fat}g F
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0 ml-2">
                    <button
                      onClick={() => handleAddFromDatabase(f, 'breakfast')}
                      className="px-2 py-0.5 bg-white hover:bg-roseDust-50 text-plum-700 hover:text-roseDust-700 rounded-lg text-[10px] font-bold border border-cream-300"
                    >
                      + B'fast
                    </button>
                    <button
                      onClick={() => handleAddFromDatabase(f, 'lunch')}
                      className="px-2 py-0.5 bg-white hover:bg-roseDust-50 text-plum-700 hover:text-roseDust-700 rounded-lg text-[10px] font-bold border border-cream-300"
                    >
                      + Lunch
                    </button>
                    <button
                      onClick={() => handleAddFromDatabase(f, 'dinner')}
                      className="px-2 py-0.5 bg-white hover:bg-roseDust-50 text-plum-700 hover:text-roseDust-700 rounded-lg text-[10px] font-bold border border-cream-300"
                    >
                      + Dinner
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: KITCHEN SCALE GUIDE */}
      {subTab === 'scale' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-5 sm:p-6 border border-cream-300 shadow-soft">
            <div className="flex items-center space-x-2.5 mb-3">
              <Scale className="w-5 h-5 text-roseDust-600" />
              <h3 className="font-serif font-bold text-base sm:text-lg text-plum-950">
                Raw vs Cooked Kitchen Scale Converter
              </h3>
            </div>

            <p className="text-xs text-plum-600 mb-4 leading-relaxed">
              In Indian cooking, raw staples expand with water (rice, dal) while meats lose moisture when cooked. Use this converter to know exactly how much to weigh on your kitchen scale!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-cream-50 border border-cream-200">
              <div>
                <label className="text-xs font-bold text-plum-800 block mb-1">
                  Select Food Type:
                </label>
                <select
                  value={scaleFoodType}
                  onChange={(e) => setScaleFoodType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-white border border-cream-300 text-xs font-medium text-plum-900"
                >
                  <option value="rice">Sona Masoori Rice (Raw → Cooked)</option>
                  <option value="dal">Toor / Moong Dal (Raw → Cooked)</option>
                  <option value="chicken">Boneless Chicken (Raw → Cooked meat)</option>
                  <option value="atta">Whole Wheat Atta (Dry flour → Phulkas)</option>
                </select>

                <div className="mt-3">
                  <label className="text-xs font-bold text-plum-800 block mb-1">
                    Raw / Dry Weight (grams):
                  </label>
                  <input
                    type="number"
                    value={scaleRawGrams}
                    onChange={(e) => setScaleRawGrams(Number(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl bg-white border border-cream-300 text-xs font-bold text-plum-900"
                  />
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-cream-200 flex flex-col justify-center">
                <span className="text-[10px] uppercase font-bold text-roseDust-600 tracking-wider">
                  Kitchen Scale Cooked Equivalent
                </span>
                
                <div className="text-2xl font-bold font-serif text-plum-950 mt-1">
                  {scaleFoodType === 'rice' && `${Math.round(scaleRawGrams * 2.8)}g cooked rice`}
                  {scaleFoodType === 'dal' && `${Math.round(scaleRawGrams * 3.0)}g cooked dal`}
                  {scaleFoodType === 'chicken' && `${Math.round(scaleRawGrams * 0.72)}g cooked meat`}
                  {scaleFoodType === 'atta' && `${Math.round(scaleRawGrams / 30)} medium phulkas (~${Math.round(scaleRawGrams * 1.3)}g)`}
                </div>

                <p className="text-[11px] text-plum-500 mt-1">
                  {scaleFoodType === 'rice' && "1g raw rice absorbs water to yield ~2.8g cooked rice."}
                  {scaleFoodType === 'dal' && "1g dry toor dal yields ~3.0g cooked thick dal."}
                  {scaleFoodType === 'chicken' && "1g raw boneless chicken shrinks to ~0.72g cooked edible meat."}
                  {scaleFoodType === 'atta' && "30g dry atta kneads into 1 soft home phulka."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM FOOD MODAL */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 bg-plum-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-soft-lg border border-cream-300 animate-scaleUp">
            <h3 className="font-serif font-bold text-lg text-plum-950 mb-3">
              Add Food to Diary
            </h3>

            <form onSubmit={handleSaveCustomFood} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-plum-800 block mb-1">Food Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2 Dosa with Sambar"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-plum-800 block mb-1">Meal Slot</label>
                  <select
                    value={customMealType}
                    onChange={(e) => setCustomMealType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300 font-medium"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="snack">Snack</option>
                    <option value="dinner">Dinner</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-plum-800 block mb-1">Portion (g/ml)</label>
                  <input
                    type="number"
                    value={customGrams}
                    onChange={(e) => setCustomGrams(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="font-bold text-plum-800 block mb-1">Calories</label>
                  <input
                    type="number"
                    value={customCals}
                    onChange={(e) => setCustomCals(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-cream-50 border border-cream-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-plum-800 block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={customProt}
                    onChange={(e) => setCustomProt(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-cream-50 border border-cream-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-plum-800 block mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-cream-50 border border-cream-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-plum-800 block mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={customFat}
                    onChange={(e) => setCustomFat(Number(e.target.value))}
                    className="w-full p-2 rounded-xl bg-cream-50 border border-cream-300 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-plum-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-plum-900 hover:bg-plum-950 text-white font-bold rounded-xl shadow-soft"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
