import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar, Utensils, Flame, 
  Activity, CheckCircle2, Circle, Sparkles, Heart, Plus, 
  ExternalLink, Bed, RefreshCw, AlertCircle, Award 
} from 'lucide-react';
import { UserProfile } from '../../types';
import { 
  getPlanForDate, getDayCalorieMetrics, logPlannedMealAsEaten, 
  logExerciseActivity, DayCalorieMetrics 
} from '../../services/plan240Service';
import { formatDisplayDate, getLocalDateString } from '../../utils/dateUtils';
import confetti from 'canvas-confetti';

interface TodayViewProps {
  profile: UserProfile;
  todayStr: string;
  selectedDateStr: string;
  onChangeSelectedDate: (newDateStr: string) => void;
  onOpenDietTab: () => void;
  onOpenWorkoutTab: () => void;
  onOpenProgressTab: () => void;
  onAskAI: (prompt: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  profile,
  todayStr,
  selectedDateStr,
  onChangeSelectedDate,
  onOpenDietTab,
  onOpenWorkoutTab,
  onOpenProgressTab,
  onAskAI
}) => {
  const [metrics, setMetrics] = useState<DayCalorieMetrics | null>(null);
  const [selectedBreakfastIdx, setSelectedBreakfastIdx] = useState(0);
  const [selectedLunchIdx, setSelectedLunchIdx] = useState(0);
  const [selectedDinnerIdx, setSelectedDinnerIdx] = useState(0);
  const [selectedSnackIdx, setSelectedSnackIdx] = useState(0);
  const [justLoggedMeal, setJustLoggedMeal] = useState<string | null>(null);

  // Load plan and metrics whenever selected date or profile changes
  const loadDayData = async () => {
    const data = await getDayCalorieMetrics(selectedDateStr, profile);
    setMetrics(data);
  };

  useEffect(() => {
    loadDayData();
  }, [selectedDateStr, profile]);

  const plan = getPlanForDate(selectedDateStr);
  const isToday = selectedDateStr === todayStr;

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

  const handleJumpToToday = () => {
    onChangeSelectedDate(todayStr);
  };

  // Quick Meal Log as Eaten
  const handleLogMeal = async (
    mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner',
    optText: string,
    fallbackCals: number,
    fallbackP: number
  ) => {
    // Parse macros from text or fallbacks: e.g. "[340 kcal, 19g P, 38g C, 12g F, ₹35]"
    let cals = fallbackCals;
    let prot = fallbackP;
    let carbs = 40;
    let fat = 10;

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
    await loadDayData();
    
    setJustLoggedMeal(mealType);
    setTimeout(() => setJustLoggedMeal(null), 2500);
    confetti({ particleCount: 40, spread: 45, origin: { y: 0.6 } });
  };

  // Quick Workout Log
  const handleLogWorkout = async () => {
    if (!plan.workout) return;
    await logExerciseActivity({
      date: selectedDateStr,
      title: plan.workout.title,
      durationMins: plan.workout.duration,
      caloriesBurned: plan.workout.burnCals,
      method: `MET ${plan.workout.met} formula`
    });
    await loadDayData();
    confetti({ particleCount: 50, spread: 55, origin: { y: 0.7 } });
  };

  const isBreakfastLogged = metrics?.loggedFoods.some(f => f.mealType === 'breakfast');
  const isLunchLogged = metrics?.loggedFoods.some(f => f.mealType === 'lunch');
  const isDinnerLogged = metrics?.loggedFoods.some(f => f.mealType === 'dinner');
  const isWorkoutLogged = metrics?.loggedActivities.length ? metrics.loggedActivities.length > 0 : false;

  return (
    <div className="space-y-6 pb-24 animate-fadeIn max-w-4xl mx-auto px-4 pt-3 font-sans">
      
      {/* 1. DATE SELECTOR & JOURNEY DAY HEADER */}
      <div className="rounded-3xl bg-white p-4 sm:p-5 border border-cream-300 shadow-soft">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Day & Date info */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="px-3 py-1 bg-roseDust-100 text-roseDust-700 rounded-full text-xs font-bold uppercase tracking-wider">
                Day {metrics?.dayNumber || 1} of 240
              </span>
              {isToday && (
                <span className="px-2 py-0.5 bg-sageCare-100 text-sageCare-800 rounded-full text-[11px] font-bold">
                  Today
                </span>
              )}
            </div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-plum-950 mt-1">
              {formatDisplayDate(selectedDateStr, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </h1>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-2">
            <button
              id="prev-day-btn"
              onClick={handlePrevDay}
              className="p-2.5 rounded-2xl bg-cream-100 hover:bg-cream-200 text-plum-800 border border-cream-300 transition-all active:scale-95"
              title="Previous Day"
              aria-label="Previous Day"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="relative">
              <input
                id="date-picker-input"
                type="date"
                value={selectedDateStr}
                onChange={(e) => {
                  if (e.target.value) onChangeSelectedDate(e.target.value);
                }}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                title="Select date from calendar"
              />
              <button
                type="button"
                className="flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-cream-50 text-plum-800 text-xs font-bold rounded-2xl border border-cream-300 shadow-2xs"
              >
                <Calendar className="w-4 h-4 text-roseDust-500" />
                <span>Calendar</span>
              </button>
            </div>

            <button
              id="next-day-btn"
              onClick={handleNextDay}
              className="p-2.5 rounded-2xl bg-cream-100 hover:bg-cream-200 text-plum-800 border border-cream-300 transition-all active:scale-95"
              title="Next Day"
              aria-label="Next Day"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {!isToday && (
              <button
                onClick={handleJumpToToday}
                className="px-3 py-2 bg-roseDust-50 hover:bg-roseDust-100 text-roseDust-700 text-xs font-bold rounded-2xl border border-roseDust-200 transition-all"
              >
                Jump to Today
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 2. CALORIE TARGET, ACTUALS & ESTIMATED DEFICIT (SECTION 4 METRICS) */}
      <div className="rounded-3xl bg-gradient-to-br from-plum-950 via-plum-900 to-roseDust-950 text-white p-5 sm:p-6 shadow-soft-lg border border-plum-800">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-plum-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-roseDust-500/20 text-roseDust-300 rounded-xl">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-cream-50">
                Daily Energy & Deficit Balance
              </h2>
              <p className="text-[11px] text-cream-300">
                Mifflin–St Jeor estimate • Non-aggressive moderate deficit
              </p>
            </div>
          </div>

          <button
            onClick={onOpenProgressTab}
            className="text-xs text-roseDust-200 hover:text-white underline font-medium"
          >
            View Trends
          </button>
        </div>

        {/* 4 Main Numerical Values Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
          
          {/* A. Planned Calorie Target */}
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] uppercase font-bold text-cream-300 tracking-wider block">
              A. Planned Target
            </span>
            <div className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
              {metrics?.plannedCalorieTarget || 1526} <span className="text-xs font-sans font-normal text-cream-300">kcal</span>
            </div>
            <span className="text-[10px] text-cream-300 mt-0.5 block">
              Home food plan
            </span>
          </div>

          {/* B. Actual Calories Consumed */}
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] uppercase font-bold text-cream-300 tracking-wider block">
              B. Actual Consumed
            </span>
            <div className="text-xl sm:text-2xl font-bold font-serif text-roseDust-300 mt-1">
              {metrics?.actualCaloriesConsumed || 0} <span className="text-xs font-sans font-normal text-cream-300">kcal</span>
            </div>
            <span className="text-[10px] text-cream-300 mt-0.5 block">
              {metrics?.loggedFoods.length || 0} items logged
            </span>
          </div>

          {/* C. Total Daily Energy Expenditure (TDEE) */}
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] uppercase font-bold text-cream-300 tracking-wider block">
              C. Estimated TDEE
            </span>
            <div className="text-xl sm:text-2xl font-bold font-serif text-amber-200 mt-1">
              {metrics?.estimatedTdee || 1876} <span className="text-xs font-sans font-normal text-cream-300">kcal</span>
            </div>
            <span className="text-[10px] text-cream-300 mt-0.5 block">
              Baseline + {metrics?.exerciseCaloriesBurned || 0} ex. burn
            </span>
          </div>

          {/* D. Estimated Calorie Deficit / Surplus */}
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] uppercase font-bold text-cream-300 tracking-wider block">
              D. Calorie Balance
            </span>
            <div className={`text-xl sm:text-2xl font-bold font-serif mt-1 ${
              (metrics?.calorieDeficit || 0) >= 0 ? 'text-emerald-300' : 'text-amber-300'
            }`}>
              {(metrics?.calorieDeficit || 0) >= 0 
                ? `+${metrics?.calorieDeficit || 0}` 
                : `${metrics?.calorieDeficit || 0}`} 
              <span className="text-xs font-sans font-normal text-cream-300"> kcal</span>
            </div>
            <span className="text-[10px] text-cream-300 mt-0.5 block font-medium">
              {(metrics?.calorieDeficit || 0) >= 0 ? 'Estimated Deficit' : 'Estimated Surplus'}
            </span>
          </div>

        </div>

        {/* Protein Target Bar */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-roseDust-400" />
            <span className="font-semibold text-cream-100">Protein Intake:</span>
            <span className="font-bold text-roseDust-200">
              {metrics?.actualProteinConsumed || 0}g
            </span>
            <span className="text-cream-400">/ {metrics?.plannedProteinTarget || 85}g target (~1.0g/kg)</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-cream-300">
            <span>Carbs: <strong className="text-white">{metrics?.actualCarbsConsumed || 0}g</strong></span>
            <span>Fat: <strong className="text-white">{metrics?.actualFatConsumed || 0}g</strong></span>
            <span>Ex. Burn: <strong className="text-amber-300">{metrics?.exerciseCaloriesBurned || 0} kcal</strong></span>
          </div>
        </div>

      </div>

      {/* 3. TODAY'S ZUMBA DANCE OR REST DAY CARD */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 border border-cream-300 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-2xl ${plan.isRestDay ? 'bg-emerald-100 text-emerald-700' : 'bg-lavenderSoft-100 text-lavenderSoft-500'}`}>
              {plan.isRestDay ? <Bed className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-plum-950 flex items-center space-x-2">
                <span>Daily Zumba & Movement</span>
                {!plan.isRestDay && <span className="text-sm">💃</span>}
              </h3>
              <p className="text-xs text-plum-500">
                {plan.isRestDay ? 'Scheduled Recovery Day' : 'Joyful YouTube Dance Session • Follow Along'}
              </p>
            </div>
          </div>

          {plan.isRestDay ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
              <span>🌱 REST DAY</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-lavenderSoft-50 text-lavenderSoft-600 border border-lavenderSoft-200">
              ~{plan.workout?.duration} Mins • ~{plan.workout?.burnCals} kcal
            </span>
          )}
        </div>

        {plan.isRestDay ? (
          /* REST DAY EXPLICIT CONTENT */
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-plum-900">
            <h4 className="font-bold text-emerald-950 text-sm sm:text-base flex items-center space-x-2">
              <span>Rest Means Rest ❤️</span>
            </h4>
            <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
              {plan.restReason}
            </p>
            <div className="mt-3 p-3 bg-white/80 rounded-xl text-xs text-emerald-900 space-y-1 border border-emerald-200/80">
              <p className="font-semibold text-emerald-950">• No mandatory workout or Zumba assigned today.</p>
              <p>• No cardio step target to hit. Zero workout calories required.</p>
              <p>• Resting allows muscle repair, hormone stabilization, and deep nervous system recovery.</p>
            </div>
          </div>
        ) : (
          /* ZUMBA SESSION CONTENT */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-roseDust-50/70 via-cream-50 to-lavenderSoft-50/50 border border-roseDust-200/80">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-roseDust-700 bg-roseDust-100 px-2 py-0.5 rounded-md">
                  💃 Zumba Dance Session
                </span>
                <span className="text-[11px] text-plum-500 font-medium">
                  {plan.workout?.style}
                </span>
              </div>
              <h4 className="font-bold text-plum-950 text-base">
                {plan.workout?.title}
              </h4>
              <p className="text-xs text-plum-600 mt-1 leading-relaxed">
                {plan.workout?.instructions}
              </p>
              <div className="mt-2.5 text-xs text-plum-700 bg-white/90 p-2.5 rounded-xl border border-cream-200">
                <span className="font-bold text-plum-900">Dance Routine & Flow: </span>
                {plan.workout?.exercises}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* YouTube Video Link */}
              <a
                href={plan.workout?.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 bg-roseDust-50 hover:bg-roseDust-100 text-roseDust-700 rounded-2xl text-xs font-bold border border-roseDust-200 transition-all active:scale-98"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Watch Zumba Video on YouTube</span>
              </a>

              {/* Log as Completed */}
              <button
                onClick={handleLogWorkout}
                className="flex items-center justify-center space-x-2 py-2.5 px-5 bg-plum-900 hover:bg-plum-950 text-white rounded-2xl text-xs font-bold shadow-soft transition-all active:scale-95 shrink-0"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Log Zumba ({plan.workout?.duration}m)</span>
              </button>

              <button
                onClick={onOpenWorkoutTab}
                className="px-3 py-2.5 text-xs text-plum-600 hover:text-plum-900 font-bold border border-cream-300 rounded-2xl bg-white hover:bg-cream-50"
              >
                All Routines →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. TODAY'S MEALS WITH 2+ ALTERNATIVES (SECTION 3) */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 border border-cream-300 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-roseDust-100 text-roseDust-600 rounded-2xl">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-plum-950">
                Daily Diet Plan & Options
              </h3>
              <p className="text-xs text-plum-500">
                {plan.diet.menuName} • Affordable Bengaluru Home Food
              </p>
            </div>
          </div>

          <button
            onClick={onOpenDietTab}
            className="text-xs text-roseDust-600 hover:text-roseDust-800 font-bold"
          >
            Custom Food Diary →
          </button>
        </div>

        {justLoggedMeal && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Logged to your food diary! Actual calories & protein updated. ❤️</span>
          </div>
        )}

        <div className="space-y-4">
          
          {/* BREAKFAST */}
          <div className="p-4 rounded-2xl bg-cream-50/80 border border-cream-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-roseDust-700">
                Breakfast • 8:30 – 9:30 AM
              </span>
              {isBreakfastLogged && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  ✓ Logged
                </span>
              )}
            </div>

            {/* Alternatives Selector */}
            <div className="flex space-x-1.5 mb-2.5 overflow-x-auto no-scrollbar">
              {plan.diet.breakfast.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedBreakfastIdx(idx)}
                  className={`py-1 px-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedBreakfastIdx === idx
                      ? 'bg-plum-900 text-white shadow-2xs'
                      : 'bg-white text-plum-700 border border-cream-200 hover:bg-cream-100'
                  }`}
                >
                  Option {idx + 1} {idx === 0 ? '(Recommended)' : idx === 2 ? '(Veg)' : ''}
                </button>
              ))}
            </div>

            <p className="text-xs font-bold text-plum-900 leading-snug">
              {plan.diet.breakfast.options[selectedBreakfastIdx]}
            </p>
            <p className="text-[11px] text-plum-600 mt-1 italic">
              Scale guide: {plan.diet.breakfast.instructions}
            </p>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-cream-200/80">
              <span className="text-[11px] text-plum-500">
                Est. Cost: ₹{plan.diet.breakfast.cost}
              </span>
              <button
                onClick={() => handleLogMeal('breakfast', plan.diet.breakfast.options[selectedBreakfastIdx], plan.diet.breakfast.cals, plan.diet.breakfast.protein)}
                className="px-3 py-1.5 bg-roseDust-500 hover:bg-roseDust-600 text-white text-xs font-bold rounded-xl shadow-2xs transition-all active:scale-95"
              >
                Log as Eaten
              </button>
            </div>
          </div>

          {/* LUNCH */}
          <div className="p-4 rounded-2xl bg-cream-50/80 border border-cream-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-roseDust-700">
                Lunch • 1:00 – 2:00 PM
              </span>
              {isLunchLogged && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  ✓ Logged
                </span>
              )}
            </div>

            <div className="flex space-x-1.5 mb-2.5 overflow-x-auto no-scrollbar">
              {plan.diet.lunch.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedLunchIdx(idx)}
                  className={`py-1 px-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedLunchIdx === idx
                      ? 'bg-plum-900 text-white shadow-2xs'
                      : 'bg-white text-plum-700 border border-cream-200 hover:bg-cream-100'
                  }`}
                >
                  Option {idx + 1} {idx === 0 ? '(Non-Veg)' : idx === 1 ? '(Egg/Fish)' : '(Veg)'}
                </button>
              ))}
            </div>

            <p className="text-xs font-bold text-plum-900 leading-snug">
              {plan.diet.lunch.options[selectedLunchIdx]}
            </p>
            <p className="text-[11px] text-plum-600 mt-1 italic">
              Scale guide: {plan.diet.lunch.instructions}
            </p>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-cream-200/80">
              <span className="text-[11px] text-plum-500">
                Est. Cost: ₹{plan.diet.lunch.cost}
              </span>
              <button
                onClick={() => handleLogMeal('lunch', plan.diet.lunch.options[selectedLunchIdx], plan.diet.lunch.cals, plan.diet.lunch.protein)}
                className="px-3 py-1.5 bg-roseDust-500 hover:bg-roseDust-600 text-white text-xs font-bold rounded-xl shadow-2xs transition-all active:scale-95"
              >
                Log as Eaten
              </button>
            </div>
          </div>

          {/* SNACKS */}
          <div className="p-4 rounded-2xl bg-cream-50/80 border border-cream-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-roseDust-700">
                Snacks (Morning Refresher & Evening Crunch)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-plum-800">
              <div className="p-2.5 bg-white rounded-xl border border-cream-200">
                <span className="text-[10px] font-bold text-plum-500 uppercase block">Mid-Morning</span>
                <p className="font-semibold mt-0.5">{plan.diet.snackMorning.options[0]}</p>
                <button
                  onClick={() => handleLogMeal('snack', plan.diet.snackMorning.options[0], plan.diet.snackMorning.cals, plan.diet.snackMorning.protein)}
                  className="mt-2 text-[10px] text-roseDust-600 hover:text-roseDust-800 font-bold block"
                >
                  + Log Morning Snack
                </button>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-cream-200">
                <span className="text-[10px] font-bold text-plum-500 uppercase block">Evening Snack</span>
                <p className="font-semibold mt-0.5">{plan.diet.snackEvening.options[0]}</p>
                <button
                  onClick={() => handleLogMeal('snack', plan.diet.snackEvening.options[0], plan.diet.snackEvening.cals, plan.diet.snackEvening.protein)}
                  className="mt-2 text-[10px] text-roseDust-600 hover:text-roseDust-800 font-bold block"
                >
                  + Log Evening Snack
                </button>
              </div>
            </div>
          </div>

          {/* DINNER */}
          <div className="p-4 rounded-2xl bg-cream-50/80 border border-cream-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-roseDust-700">
                Dinner • 8:00 – 9:00 PM
              </span>
              {isDinnerLogged && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  ✓ Logged
                </span>
              )}
            </div>

            <div className="flex space-x-1.5 mb-2.5 overflow-x-auto no-scrollbar">
              {plan.diet.dinner.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDinnerIdx(idx)}
                  className={`py-1 px-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedDinnerIdx === idx
                      ? 'bg-plum-900 text-white shadow-2xs'
                      : 'bg-white text-plum-700 border border-cream-200 hover:bg-cream-100'
                  }`}
                >
                  Option {idx + 1} {idx === 0 ? '(High Protein)' : idx === 1 ? '(Veg Bhurji)' : '(Light Khichdi)'}
                </button>
              ))}
            </div>

            <p className="text-xs font-bold text-plum-900 leading-snug">
              {plan.diet.dinner.options[selectedDinnerIdx]}
            </p>
            <p className="text-[11px] text-plum-600 mt-1 italic">
              Scale guide: {plan.diet.dinner.instructions}
            </p>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-cream-200/80">
              <span className="text-[11px] text-plum-500">
                Est. Cost: ₹{plan.diet.dinner.cost}
              </span>
              <button
                onClick={() => handleLogMeal('dinner', plan.diet.dinner.options[selectedDinnerIdx], plan.diet.dinner.cals, plan.diet.dinner.protein)}
                className="px-3 py-1.5 bg-roseDust-500 hover:bg-roseDust-600 text-white text-xs font-bold rounded-xl shadow-2xs transition-all active:scale-95"
              >
                Log as Eaten
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 5. SIMPLE COMPLETION CHECKLIST */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 border border-cream-300 shadow-soft">
        <h3 className="font-serif font-bold text-base sm:text-lg text-plum-950 mb-3 flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-roseDust-600" />
          <span>Daily Wellness Checklist</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className={`p-3 rounded-2xl flex items-center space-x-2.5 border ${
            isBreakfastLogged ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-cream-50 border-cream-200 text-plum-700'
          }`}>
            {isBreakfastLogged ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Circle className="w-4 h-4 text-plum-400" />}
            <span className="font-semibold">Nourishing Breakfast Eaten</span>
          </div>

          <div className={`p-3 rounded-2xl flex items-center space-x-2.5 border ${
            isLunchLogged ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-cream-50 border-cream-200 text-plum-700'
          }`}>
            {isLunchLogged ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Circle className="w-4 h-4 text-plum-400" />}
            <span className="font-semibold">Balanced Lunch Eaten</span>
          </div>

          <div className={`p-3 rounded-2xl flex items-center space-x-2.5 border ${
            isDinnerLogged ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-cream-50 border-cream-200 text-plum-700'
          }`}>
            {isDinnerLogged ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Circle className="w-4 h-4 text-plum-400" />}
            <span className="font-semibold">Satisfying Dinner Eaten</span>
          </div>

          <div className={`p-3 rounded-2xl flex items-center space-x-2.5 border ${
            plan.isRestDay || isWorkoutLogged ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-cream-50 border-cream-200 text-plum-700'
          }`}>
            {plan.isRestDay || isWorkoutLogged ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Circle className="w-4 h-4 text-plum-400" />}
            <span className="font-semibold">{plan.isRestDay ? 'Rest Day Honored ❤️' : 'Daily Zumba Dance Completed 💃'}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
