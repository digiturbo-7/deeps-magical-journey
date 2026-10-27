import { db } from '../db';
import { HER_JOURNEY_240_DAYS, DayRecord240, INDIAN_FOOD_DATABASE } from '../data/planData240';
import { FoodLog, ActivityLog, UserProfile } from '../types';
import { calculateJourneyDay, getLocalDateString } from '../utils/dateUtils';

export interface DayCalorieMetrics {
  date: string;
  dayNumber: number;
  plannedCalorieTarget: number;
  actualCaloriesConsumed: number;
  exerciseCaloriesBurned: number;
  baselineExpenditure: number;
  estimatedTdee: number;
  calorieDeficit: number; // Positive = Deficit; Negative = Surplus
  plannedProteinTarget: number;
  actualProteinConsumed: number;
  actualCarbsConsumed: number;
  actualFatConsumed: number;
  loggedFoods: FoodLog[];
  loggedActivities: ActivityLog[];
}

/**
 * Returns the 240-day master plan for a specific date string (YYYY-MM-DD)
 */
export function getPlanForDate(dateStr: string): DayRecord240 {
  const found = HER_JOURNEY_240_DAYS.find(d => d.date === dateStr);
  if (found) return found;
  
  // Fallback to Day 1
  return HER_JOURNEY_240_DAYS[0];
}

/**
 * Calculates Mifflin-St Jeor BMR for Female:
 * BMR = 10 * weightKg + 6.25 * heightCm - 5 * age - 161
 */
export function calculateMifflinBmr(weightKg: number, heightCm: number, age: number): number {
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
}

/**
 * Calculates baseline maintenance TDEE (excluding separately logged exercise)
 * Multiplier default is 1.20 (Sedentary baseline for desk work & daily life)
 */
export function calculateBaselineTdee(bmr: number, multiplier: number = 1.20): number {
  return Math.round(bmr * multiplier);
}

/**
 * MET-based Exercise Calories Calculator:
 * Calories = MET * weightKg * (durationMins / 60)
 */
export function calculateMetCalories(met: number, weightKg: number, durationMins: number): number {
  if (durationMins <= 0 || weightKg <= 0) return 0;
  return Math.round(met * weightKg * (durationMins / 60));
}

/**
 * Fetches actual Dexie logs and computes all calorie, protein, and energy expenditure metrics
 */
export async function getDayCalorieMetrics(dateStr: string, profile: UserProfile): Promise<DayCalorieMetrics> {
  const dayNum = calculateJourneyDay(profile.startDate || '2026-10-24', dateStr);
  const plan = getPlanForDate(dateStr);

  const weight = profile.weightKg || 86.2;
  const height = profile.heightCm || 158.0;
  const age = profile.age || 25;

  const bmr = calculateMifflinBmr(weight, height, age);
  const baselineExpenditure = calculateBaselineTdee(bmr, 1.20);
  const plannedCalorieTarget = 1526; // Moderate, sustainable deficit from 1876 kcal
  const plannedProteinTarget = 85;

  // Retrieve actual food logs for this date from IndexedDB
  const foodLogs = await db.foodLogs.where('date').equals(dateStr).toArray();
  const actualCaloriesConsumed = Math.round(foodLogs.reduce((sum, f) => sum + (f.caloriesApprox || 0), 0));
  const actualProteinConsumed = Math.round(foodLogs.reduce((sum, f) => sum + (f.proteinApprox || 0), 0) * 10) / 10;
  const actualCarbsConsumed = Math.round(foodLogs.reduce((sum, f) => sum + (f.carbsApprox || 0), 0) * 10) / 10;
  const actualFatConsumed = Math.round(foodLogs.reduce((sum, f) => sum + (f.fatApprox || 0), 0) * 10) / 10;

  // Retrieve actual exercise logs for this date
  const actLogs = await db.activityLogs.where('date').equals(dateStr).toArray();
  
  // Sum estimated calories burned from activities
  let exerciseCaloriesBurned = 0;
  for (const act of actLogs) {
    if (act.notes && act.notes.includes('kcal')) {
      const match = act.notes.match(/(\d+)\s*kcal/);
      if (match) {
        exerciseCaloriesBurned += parseInt(match[1], 10);
        continue;
      }
    }
    // Default walking MET: ~3.3
    const met = act.isTreadmill ? 3.8 : 3.3;
    exerciseCaloriesBurned += calculateMetCalories(met, weight, act.durationMins);
  }

  // Consistent energy expenditure model:
  // Baseline TDEE + Separately logged exercise calories
  const estimatedTdee = baselineExpenditure + exerciseCaloriesBurned;

  // Deficit = TDEE - Actual calories consumed
  // A positive result means an estimated deficit; a negative result means an estimated surplus.
  const calorieDeficit = actualCaloriesConsumed > 0 ? (estimatedTdee - actualCaloriesConsumed) : 0;

  return {
    date: dateStr,
    dayNumber: dayNum,
    plannedCalorieTarget,
    actualCaloriesConsumed,
    exerciseCaloriesBurned,
    baselineExpenditure,
    estimatedTdee,
    calorieDeficit,
    plannedProteinTarget,
    actualProteinConsumed,
    actualCarbsConsumed,
    actualFatConsumed,
    loggedFoods: foodLogs,
    loggedActivities: actLogs
  };
}

/**
 * Log a planned meal option as eaten into Dexie DB
 */
export async function logPlannedMealAsEaten(
  dateStr: string,
  mealCategory: 'breakfast' | 'lunch' | 'snack' | 'dinner',
  foodName: string,
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  portionDesc: string
): Promise<void> {
  await db.foodLogs.add({
    date: dateStr,
    mealType: mealCategory,
    foodName: foodName,
    state: 'COOKED/READY-TO-EAT',
    weightGrams: 100, // standard placeholder portion
    caloriesApprox: calories,
    proteinApprox: protein,
    carbsApprox: carbs,
    fatApprox: fat,
    isHomemade: true,
    scaleModeUsed: true,
    notes: `Planned option logged: ${portionDesc}`
  });
}

/**
 * Delete a food log entry
 */
export async function deleteFoodLogEntry(id: number): Promise<void> {
  await db.foodLogs.delete(id);
}

/**
 * Add a custom food log entry
 */
export async function addCustomFoodLog(entry: {
  date: string;
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  foodName: string;
  weightGrams: number;
  caloriesApprox: number;
  proteinApprox: number;
  carbsApprox: number;
  fatApprox: number;
  notes?: string;
}): Promise<void> {
  await db.foodLogs.add({
    date: entry.date,
    mealType: entry.mealType,
    foodName: entry.foodName,
    state: 'COOKED/READY-TO-EAT',
    weightGrams: entry.weightGrams,
    caloriesApprox: entry.caloriesApprox,
    proteinApprox: entry.proteinApprox,
    carbsApprox: entry.carbsApprox,
    fatApprox: entry.fatApprox,
    isHomemade: true,
    scaleModeUsed: true,
    notes: entry.notes || 'Custom food entry'
  });
}

/**
 * Copy all food logs from yesterday to today
 */
export async function copyYesterdayFoodLogs(currentDateStr: string): Promise<number> {
  const parts = currentDateStr.split('-');
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  d.setDate(d.getDate() - 1);
  const yesterdayStr = getLocalDateString(d);

  const prevLogs = await db.foodLogs.where('date').equals(yesterdayStr).toArray();
  if (prevLogs.length === 0) return 0;

  for (const log of prevLogs) {
    await db.foodLogs.add({
      date: currentDateStr,
      mealType: log.mealType,
      foodName: log.foodName,
      state: log.state,
      weightGrams: log.weightGrams,
      caloriesApprox: log.caloriesApprox,
      proteinApprox: log.proteinApprox,
      carbsApprox: log.carbsApprox,
      fatApprox: log.fatApprox,
      isHomemade: log.isHomemade,
      scaleModeUsed: log.scaleModeUsed,
      notes: `Copied from ${yesterdayStr}`
    });
  }

  return prevLogs.length;
}

/**
 * Log exercise session into Dexie DB
 */
export async function logExerciseActivity(entry: {
  date: string;
  title: string;
  durationMins: number;
  caloriesBurned: number;
  method: string;
  feeling?: 'restorative' | 'comfortable' | 'energized' | 'tired';
  notes?: string;
}): Promise<void> {
  await db.activityLogs.add({
    date: entry.date,
    title: entry.title,
    durationMins: entry.durationMins,
    perceivedEffortRpe: 3,
    isTreadmill: entry.title.toLowerCase().includes('treadmill'),
    feeling: entry.feeling || 'comfortable',
    notes: `${entry.caloriesBurned} kcal estimated via ${entry.method}. ${entry.notes || ''}`
  });
}
