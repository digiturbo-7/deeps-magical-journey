// Comprehensive Type Definitions for DEEPS MAGICAL JOURNEY ❤️

export type FoodState = 'RAW/DRY' | 'COOKED/READY-TO-EAT';

export interface UserProfile {
  id?: number;
  name: string;
  age: number; // 25
  heightCm: number; // 158 cm (confirmed)
  weightKg: number; // 86.2 kg (current latest saved weight)
  initialWeightKg: number; // 88.5 kg (starting baseline)
  goals: string[]; // ['improve fitness', 'gradually reduce body fat', 'improve stamina', 'build sustainable habits', 'feel healthier & confident']
  experience: 'beginner' | 'intermediate';
  exerciseLocation: 'home' | 'outdoors' | 'gym';
  equipment: string[]; // ['none mandatory', 'treadmill']
  treadmillSettings: {
    available: boolean;
    speedKmh: number; // 5
    inclinePct: number; // 2
    comfortableDurationMins: number; // 13
  };
  foodPreference: 'non-veg-indian' | 'veg-indian' | 'eggetarian';
  cuisineRegion: string; // 'South Indian / Bengaluru'
  allergies: string[];
  dislikedFoods: string[];
  usualMealTimes: {
    breakfast: string;
    lunch: string;
    snack: string;
    dinner: string;
  };
  journeyLengthDays: number; // 240
  startDate: string; // '2026-10-24'
  currentDay: number; // 1
  isPaused: boolean;
  menstrualStartDate: string; // '2026-10-24'
  menstrualConfirmedDay1: boolean;
  cycleLengthDays?: number; // default 28
  partnerName: string; // e.g. "Your Partner"
  assistantName: string; // "Rosy — Your Wellness Companion ❤️"
}

export interface UserPreferences {
  id?: number;
  enableWeightTracking: boolean;
  enableCalorieTracking: boolean;
  enableMoodTracking: boolean;
  enableMenstrualTracking: boolean;
  enablePartnerSharing: boolean; // OFF by default
  appLockPin?: string;
  isAppLocked: boolean;
  theme: 'warm-cream' | 'soft-rose' | 'deep-plum';
  reminderSettings: {
    quietHoursStart: string; // '22:00'
    quietHoursEnd: string; // '07:30'
    hydrationReminder: boolean;
    mealReminder: boolean;
    movementReminder: boolean;
    sleepReminder: boolean;
    loveMessageReminder: boolean;
  };
}

export interface JourneyPhase {
  phaseNumber: number;
  title: string;
  tagline: string;
  dayRange: [number, number];
  description: string;
  focusAreas: string[];
  mindsetNote: string;
}

export interface FoodItem {
  id: string;
  name: string;
  kannadaName?: string;
  category: 'grain' | 'dal_protein' | 'meat_egg' | 'vegetable' | 'dairy' | 'snack_fruit';
  isVegetarian: boolean;
  isEgg: boolean;
  defaultPortionGrams: number;
  state: FoodState;
  cookedYieldRatio: number; // e.g. 1g raw rice -> 2.8g cooked rice; 1g raw chicken -> 0.75g cooked meat
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fibrePer100g?: number;
  description: string;
  scaleTip: string;
  isBudgetFriendly?: boolean;
}

export interface FoodLog {
  id?: number;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  foodName: string;
  state: FoodState;
  weightGrams: number;
  caloriesApprox: number;
  proteinApprox: number;
  carbsApprox: number;
  fatApprox: number;
  isHomemade: boolean;
  scaleModeUsed: boolean;
  notes?: string;
}

export interface MealOption {
  title: string;
  description: string;
  rawPortionGuide: string;
  cookedPortionGuide: string;
  approxCalories: number;
  approxProteinG: number;
  isVeg: boolean;
  budgetFriendly: boolean;
  recipeIngredients?: { name: string; state: FoodState; rawGrams: number; cookedGramsApprox: number }[];
}

export interface DailyMealPlan {
  id?: number;
  day: number;
  breakfast: MealOption;
  lunch: MealOption;
  snack: MealOption;
  dinner: MealOption;
  quickLeftoverTip: string;
}

export interface MealAlternative {
  id: string; // 'opt-1', 'opt-2', 'opt-3'
  title: string;
  description: string;
  isVeg: boolean;
  portionRaw: string;
  portionCooked: string;
  approxCalories: number;
  approxProteinG: number;
  scaleTip: string;
  substitutions: string;
  meatEdibleNote?: string; // clarifies boneless vs bone-in
}

export interface MealSlotPlan {
  name: 'Breakfast' | 'Lunch' | 'Evening Snack' | 'Dinner';
  timeSuggestion: string; // e.g. "09:00 AM"
  selectedOptionId: string;
  options: MealAlternative[];
  isCompleted: boolean;
  userNotes?: string;
}

export interface DailyPersonalizedDietPlan {
  id?: number;
  date: string; // 'YYYY-MM-DD'
  day: number; // Journey day
  heading: string; // "❤️ Today's Diet Plan — Day X 🥗✨"
  greeting: string;
  targetCaloriesApprox: string; // "1450 - 1550 kcal"
  targetProteinApprox: string; // "75 - 85g"
  breakfast: MealSlotPlan;
  lunch: MealSlotPlan;
  snack: MealSlotPlan;
  dinner: MealSlotPlan;
  hydrationGuidance: string;
  movementGuidance: string;
  periodSupportNote?: string;
  closingLoveMessage: string;
  whatsappMessageText: string;
  createdAt: string;
}

export interface ExerciseItem {
  name: string;
  durationOrReps: string;
  demonstrationNotes: string;
  chairModifiedOption: string;
  safetyCheck: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  category: 'mobility' | 'walking' | 'treadmill' | 'period_care' | 'gentle_strength';
  targetEnergyLevel: 'low_energy' | 'normal' | 'feeling_good';
  durationMins: number;
  rpeEffort: string; // e.g. "RPE 2-3 (Comfortable talking)"
  isPeriodDay1Suitable: boolean;
  exercises: ExerciseItem[];
  warmupNotes: string;
  cooldownNotes: string;
}

export interface ActivityLog {
  id?: number;
  date: string;
  title: string;
  durationMins: number;
  perceivedEffortRpe: number; // 1-10
  isTreadmill: boolean;
  treadmillSpeed?: number;
  treadmillIncline?: number;
  feeling: 'restorative' | 'comfortable' | 'energized' | 'tired';
  notes?: string;
  caloriesBurned?: number;
  method?: string;
}

export interface MenstrualLog {
  id?: number;
  date: string;
  isPeriodDay: boolean;
  dayOfCycle?: number;
  flow?: 'spotting' | 'light' | 'medium' | 'heavy';
  crampsLevel?: 1 | 2 | 3 | 4 | 5;
  bloatingLevel?: 1 | 2 | 3 | 4 | 5;
  energyLevel?: 1 | 2 | 3 | 4 | 5;
  symptoms: string[];
  notes?: string;
}

export interface MoodEntry {
  id?: number;
  date: string;
  moodEmoji: string;
  moodLabel: string;
  energyRating: number; // 1-5
  stressRating: number; // 1-5
  gratitudeNote?: string;
  reflection?: string;
}

export interface HydrationLog {
  id?: number;
  date: string;
  glasses: number;
  targetGlasses: number; // 8-10 glasses (sensible, non-coercive)
}

export interface SleepLog {
  id?: number;
  date: string;
  hoursSlept: number;
  quality: 'peaceful' | 'restless' | 'deep' | 'short';
  windDownCompleted: boolean;
}

export interface NonScaleWin {
  id?: number;
  date: string;
  category: 'stamina' | 'sleep' | 'mood' | 'clothes' | 'consistency' | 'food_relationship';
  title: string;
  description: string;
}

export interface WeightEntry {
  id?: number;
  date: string;
  weightKg: number;
  isPeriodWeek?: boolean;
  notes?: string;
}

export interface SharedActivity {
  id: string;
  title: string;
  category: 'walk_together' | 'cook_meal' | 'grocery_plan' | 'restful_evening' | 'check_in';
  durationMins: number;
  description: string;
  completed: boolean;
  dateCompleted?: string;
}

export interface AIAction {
  id: string;
  type: 'UPDATE_MEAL' | 'UPDATE_WORKOUT' | 'LOG_WATER' | 'SWITCH_MINIMUM_DAY' | 'SET_REST_DAY' | 'TOGGLE_TRACKING' | 'NAVIGATE' | 'GENERATE_SHOPPING_LIST' | 'APPLY_RESET_PLAN';
  summary: string;
  details: string;
  isHighRisk: boolean;
  payload: any;
}

export interface LoveMessage {
  id?: number;
  day: number;
  title: string;
  message: string;
  partnerActionSuggestion: string;
  conversationPrompt: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: AIAction;
  actionStatus?: 'pending' | 'applied' | 'dismissed';
  safetyAlert?: string;
}
