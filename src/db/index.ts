import Dexie, { type EntityTable } from 'dexie';
import {
  UserProfile,
  UserPreferences,
  FoodLog,
  ActivityLog,
  MenstrualLog,
  MoodEntry,
  HydrationLog,
  SleepLog,
  NonScaleWin,
  WeightEntry,
  SharedActivity,
  AIMessage,
  DailyMealPlan,
  DailyPersonalizedDietPlan
} from '../types';
import { SHARED_ACTIVITIES } from '../data/loveMessages';
import { getLocalDateString } from '../utils/dateUtils';

export class HerJourneyDB extends Dexie {
  profiles!: EntityTable<UserProfile, 'id'>;
  preferences!: EntityTable<UserPreferences, 'id'>;
  foodLogs!: EntityTable<FoodLog, 'id'>;
  activityLogs!: EntityTable<ActivityLog, 'id'>;
  menstrualLogs!: EntityTable<MenstrualLog, 'id'>;
  moodLogs!: EntityTable<MoodEntry, 'id'>;
  hydrationLogs!: EntityTable<HydrationLog, 'id'>;
  sleepLogs!: EntityTable<SleepLog, 'id'>;
  nonScaleWins!: EntityTable<NonScaleWin, 'id'>;
  weightLogs!: EntityTable<WeightEntry, 'id'>;
  sharedActivities!: EntityTable<SharedActivity, 'id'>;
  aiMessages!: EntityTable<AIMessage, 'id'>;
  dailyPlans!: EntityTable<DailyMealPlan, 'id'>;
  personalizedDietPlans!: EntityTable<DailyPersonalizedDietPlan, 'id'>;

  constructor() {
    super('HerJourney240DB');
    this.version(1).stores({
      profiles: '++id, name, currentDay, startDate',
      preferences: '++id',
      foodLogs: '++id, date, mealType, foodName',
      activityLogs: '++id, date, title, feeling',
      menstrualLogs: '++id, date, isPeriodDay',
      moodLogs: '++id, date',
      hydrationLogs: '++id, date',
      sleepLogs: '++id, date',
      nonScaleWins: '++id, date, category',
      weightLogs: '++id, date',
      sharedActivities: 'id, category, completed',
      aiMessages: 'id, timestamp, sender',
      dailyPlans: '++id, day'
    });
    this.version(2).stores({
      personalizedDietPlans: '++id, date, day'
    });
  }
}

export const db = new HerJourneyDB();

// Initial profile data according to user specification
export const INITIAL_USER_PROFILE: UserProfile = {
  id: 1,
  name: 'Deep',
  age: 25,
  heightCm: 158, // Confirmed 158 cm (approx 5 ft 2 in)
  weightKg: 86.2, // Current updated weight
  initialWeightKg: 88.5, // Starting baseline weight preserved
  goals: [
    'Improve everyday fitness & stamina',
    'Gradually and safely reduce body fat',
    'Build sustainable home-cooked eating habits',
    'Feel healthier, radiant and more confident'
  ],
  experience: 'beginner',
  exerciseLocation: 'home',
  equipment: ['No gym membership required', 'Home / Outdoor Walking (Treadmill currently paused)'],
  treadmillSettings: {
    available: false, // Treadmill temporarily unavailable at this time
    speedKmh: 5.0,
    inclinePct: 2.0,
    comfortableDurationMins: 13
  },
  foodPreference: 'non-veg-indian',
  cuisineRegion: 'South Indian / Bengaluru',
  allergies: [],
  dislikedFoods: [],
  usualMealTimes: {
    breakfast: '09:00',
    lunch: '13:30',
    snack: '17:30',
    dinner: '20:30'
  },
  journeyLengthDays: 240,
  startDate: '2026-10-24',
  currentDay: 1,
  isPaused: false,
  menstrualStartDate: '2026-10-24',
  menstrualConfirmedDay1: true,
  cycleLengthDays: 28,
  partnerName: 'Your Loving Partner',
  assistantName: 'Rosy — Your Wellness Companion ❤️'
};

export const INITIAL_USER_PREFERENCES: UserPreferences = {
  id: 1,
  enableWeightTracking: true,
  enableCalorieTracking: false, // Focus on scale portions & balance by default
  enableMoodTracking: true,
  enableMenstrualTracking: true,
  enablePartnerSharing: false, // STRICT PRIVACY DEFAULT
  isAppLocked: false,
  theme: 'warm-cream',
  reminderSettings: {
    quietHoursStart: '22:00',
    quietHoursEnd: '07:30',
    hydrationReminder: true,
    mealReminder: true,
    movementReminder: true,
    sleepReminder: true,
    loveMessageReminder: true
  }
};

// Seed initial database
export async function initializeDatabase(): Promise<void> {
  const profileCount = await db.profiles.count();
  if (profileCount === 0) {
    await db.profiles.put(INITIAL_USER_PROFILE);
    await db.preferences.put(INITIAL_USER_PREFERENCES);

    // Starting baseline weight log (October 24, 2026)
    await db.weightLogs.add({
      date: '2026-10-24',
      weightKg: 88.5,
      isPeriodWeek: true,
      notes: 'Starting baseline weight (88.5 kg). Period Day 1 fluid retention present.'
    });

    // Current updated weight check-in (86.2 kg)
    await db.weightLogs.add({
      date: '2026-10-25',
      weightKg: 86.2,
      isPeriodWeek: false,
      notes: 'Current updated weight check-in (86.2 kg). Sustainable progress ❤️'
    });

    // Menstrual log for Day 1
    await db.menstrualLogs.add({
      date: '2026-10-24',
      isPeriodDay: true,
      dayOfCycle: 1,
      flow: 'medium',
      crampsLevel: 2,
      bloatingLevel: 3,
      energyLevel: 2,
      symptoms: ['Mild lower abdomen cramps', 'Bloating', 'Low morning energy'],
      notes: 'Day 1 of bleeding confirmed. Prioritizing gentle care, warm water, and rest.'
    });

    // Seed initial daily plan for Day 1
    await db.dailyPlans.add({
      day: 1,
      breakfast: {
        title: 'Steamed Idlis with Coconut Chutney & 1 Boiled Egg',
        description: 'Light steamed comfort with high-bioavailability egg protein to nourish the body.',
        rawPortionGuide: '50g urad-rice dry batter equivalent',
        cookedPortionGuide: '2 idlis (100g) + 1 large boiled egg (50g)',
        approxCalories: 215,
        approxProteinG: 11,
        isVeg: false,
        budgetFriendly: true
      },
      lunch: {
        title: 'Cooked Sona Masoori Rice + Toor Dal Sambar + Beans Palya',
        description: 'Warm comfort plate: easily digested carbohydrates, plant protein, and high-fibre green beans.',
        rawPortionGuide: '50g raw rice, 30g dry toor dal',
        cookedPortionGuide: '140g cooked rice on scale + 1 katori sambar (180g) + 100g beans palya',
        approxCalories: 330,
        approxProteinG: 10,
        isVeg: true,
        budgetFriendly: true
      },
      snack: {
        title: 'Tender Coconut Water & Handful of Roasted Chana',
        description: 'Natural electrolytes for cramp ease, plus crunchy high-protein Puri Kadale.',
        rawPortionGuide: 'N/A',
        cookedPortionGuide: '1 cup tender coconut water (240ml) + 30g roasted chana',
        approxCalories: 155,
        approxProteinG: 6,
        isVeg: true,
        budgetFriendly: true
      },
      dinner: {
        title: '2 Soft Whole Wheat Chapatis with Home Chicken Curry (or Paneer)',
        description: 'Nourishing iron-rich chicken curry or fresh paneer cubes with tender chapatis and sliced cucumber.',
        rawPortionGuide: 'Atta 60g dry, Raw chicken 140g (or paneer 80g)',
        cookedPortionGuide: '2 medium chapatis (~75g) + chicken curry 150g edible meat with gravy',
        approxCalories: 410,
        approxProteinG: 28,
        isVeg: false,
        budgetFriendly: true
      },
      quickLeftoverTip: 'Cook extra chicken curry or sambar tonight so tomorrow\'s lunch is ready in 2 minutes!'
    });

    // Initial Hydration
    await db.hydrationLogs.add({
      date: '2026-10-24',
      glasses: 4,
      targetGlasses: 8
    });

    // Initial Mood & Energy
    await db.moodLogs.add({
      date: '2026-10-24',
      moodEmoji: '🌸',
      moodLabel: 'Peaceful & Gentle',
      energyRating: 3,
      stressRating: 2,
      gratitudeNote: 'Grateful for embarking on Deep\'s Magical Journey with patience and care.',
      reflection: 'Honoring my body today and taking things one slow step at a time.'
    });

    // Non-scale win
    await db.nonScaleWins.add({
      date: '2026-10-24',
      category: 'consistency',
      title: 'Embraced Day 1 with Self-Love',
      description: 'Started Deep\'s 240-day magical journey by honoring my body and resting during period day 1.'
    });

    // Seed shared activities
    for (const act of SHARED_ACTIVITIES) {
      await db.sharedActivities.put(act);
    }

    // Welcome AI Message
    await db.aiMessages.add({
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Namaste Deep! Welcome to DEEPS MAGICAL JOURNEY ❤️ I am Rosy, your personal wellness companion. I am right here by your side for all 240 days.\n\nToday is Saturday, October 24, 2026 — Day 1 of your journey and Day 1 of your period. You never have to push or prove anything. Today is all about warmth, hydration, gentle comfort, and feeling cared for.\n\nHow is your body feeling right now?',
      timestamp: new Date().toISOString()
    });
    // Migration: ensure user name is 'Deep', assistant is 'Rosy', weight is 86.2 kg, height is 158 cm, treadmill unavailable
    const existing = await db.profiles.get(1);
    if (existing) {
      let shouldUpdate = false;
      const updates: Partial<UserProfile> = {};
      if (existing.name === 'Her Journey' || !existing.name) {
        updates.name = 'Deep';
        shouldUpdate = true;
      }
      if (!existing.assistantName || existing.assistantName.includes('Mira')) {
        updates.assistantName = 'Rosy — Your Wellness Companion ❤️';
        shouldUpdate = true;
      }
      if (existing.weightKg !== 86.2) {
        updates.weightKg = 86.2;
        updates.initialWeightKg = existing.initialWeightKg || 88.5;
        shouldUpdate = true;
      }
      if (existing.heightCm !== 158) {
        updates.heightCm = 158;
        shouldUpdate = true;
      }
      if (existing.age !== 25) {
        updates.age = 25;
        shouldUpdate = true;
      }
      if (existing.treadmillSettings && existing.treadmillSettings.available) {
        updates.treadmillSettings = {
          ...existing.treadmillSettings,
          available: false
        };
        shouldUpdate = true;
      }
      if (shouldUpdate) {
        await db.profiles.update(1, updates);
      }
    }

    // Ensure 86.2 kg is recorded in weightLogs without overwriting historical logs
    const existing862 = await db.weightLogs.where('weightKg').equals(86.2).first();
    if (!existing862) {
      await db.weightLogs.add({
        date: getLocalDateString(),
        weightKg: 86.2,
        isPeriodWeek: false,
        notes: 'Current updated weight check-in (86.2 kg). Sustainable progress ❤️'
      });
    }
  }
}
