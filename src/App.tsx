import React, { useState, useEffect, lazy, Suspense } from 'react';
import { 
  UserProfile, UserPreferences, DailyMealPlan, WorkoutRoutine, 
  MoodEntry, LoveMessage 
} from './types';
import { db, initializeDatabase, INITIAL_USER_PROFILE, INITIAL_USER_PREFERENCES } from './db';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { TodayView } from './components/today/TodayView';
import { FloatingAIAssistant } from './components/ai/FloatingAIAssistant';
import { ChatDrawer } from './components/ai/ChatDrawer';
import { RedFlagAlertModal } from './components/common/RedFlagAlertModal';
import { WORKOUT_ROUTINES } from './data/exercises';
import { getLoveMessageForDay } from './data/loveMessages';
import { useCurrentDate } from './hooks/useCurrentDate';
import { calculateJourneyDay, calculateCycleDay } from './utils/dateUtils';

// Code-split secondary views for near-instant initial render
const DietView = lazy(() => import('./components/diet/DietView').then(m => ({ default: m.DietView })));
const WorkoutView = lazy(() => import('./components/workout/WorkoutView').then(m => ({ default: m.WorkoutView })));
const ProgressView = lazy(() => import('./components/progress/ProgressView').then(m => ({ default: m.ProgressView })));
const SettingsView = lazy(() => import('./components/settings/SettingsView').then(m => ({ default: m.SettingsView })));
const JourneyView = lazy(() => import('./components/journey/JourneyView').then(m => ({ default: m.JourneyView })));
const CycleView = lazy(() => import('./components/cycle/CycleView').then(m => ({ default: m.CycleView })));
const DetoxView = lazy(() => import('./components/detox/DetoxView').then(m => ({ default: m.DetoxView })));
const MindView = lazy(() => import('./components/mind/MindView').then(m => ({ default: m.MindView })));
const LoveView = lazy(() => import('./components/love/LoveView').then(m => ({ default: m.LoveView })));

const ViewLoadingFallback = () => (
  <div className="p-8 text-center animate-pulse">
    <div className="w-7 h-7 rounded-full border-2 border-roseDust-400 border-t-transparent animate-spin mx-auto mb-2" />
    <span className="text-xs text-plum-500 font-medium">Loading section...</span>
  </div>
);

export function App() {
  const { todayStr, formattedDate } = useCurrentDate();

  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [preferences, setPreferences] = useState<UserPreferences>(INITIAL_USER_PREFERENCES);
  const [currentTab, setCurrentTab] = useState<string>('today');
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [specificSafetyAlert, setSpecificSafetyAlert] = useState<string | undefined>(undefined);

  // App data states
  const [todayMealPlan, setTodayMealPlan] = useState<DailyMealPlan | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutRoutine>(WORKOUT_ROUTINES[0]);
  const [hydrationCount, setHydrationCount] = useState<number>(0);
  const [currentMood, setCurrentMood] = useState<MoodEntry | null>(null);
  const [loveNote, setLoveNote] = useState<LoveMessage>(getLoveMessageForDay(1));
  const [isDbLoaded, setIsDbLoaded] = useState<boolean>(false);

  // Computed cycle day based on local todayStr
  const currentCycleDay = calculateCycleDay(
    profile.menstrualStartDate || '2026-10-24',
    todayStr,
    profile.cycleLengthDays || 28
  );

  const refreshAllData = async (targetDateStr: string = todayStr) => {
    const prof = await db.profiles.get(1);
    let activeDay = prof?.currentDay || 1;
    if (prof) {
      if (prof.startDate) {
        const computedDay = calculateJourneyDay(prof.startDate, targetDateStr);
        if (computedDay !== prof.currentDay) {
          await db.profiles.update(1, { currentDay: computedDay });
          prof.currentDay = computedDay;
        }
        activeDay = computedDay;
      }
      setProfile(prof);
    }

    const prefs = await db.preferences.get(1);
    if (prefs) setPreferences(prefs);

    // Fetch meal plan with fallback to Day 1
    let meal = await db.dailyPlans.where('day').equals(activeDay).first();
    if (!meal) {
      meal = await db.dailyPlans.where('day').equals(1).first();
    }
    if (meal) setTodayMealPlan(meal);

    // Automatically adapt workout to current cycle day unless custom
    const calculatedCycleDay = calculateCycleDay(
      prof?.menstrualStartDate || '2026-10-24',
      targetDateStr,
      prof?.cycleLengthDays || 28
    );
    if (calculatedCycleDay === 1) {
      const d1 = WORKOUT_ROUTINES.find(r => r.id === 'day-1-period-comfort');
      if (d1) setCurrentWorkout(d1);
    } else if (calculatedCycleDay === 2) {
      const d2 = WORKOUT_ROUTINES.find(r => r.id === 'day-2-period-gentle-flow');
      if (d2) setCurrentWorkout(d2);
    } else {
      const walk = WORKOUT_ROUTINES.find(r => r.id === 'living-room-rhythm-walk') || WORKOUT_ROUTINES[0];
      setCurrentWorkout(walk);
    }

    const hyd = await db.hydrationLogs.where('date').equals(targetDateStr).first();
    setHydrationCount(hyd ? hyd.glasses : 0);

    const mood = await db.moodLogs.where('date').equals(targetDateStr).first();
    setCurrentMood(mood || null);

    setLoveNote(getLoveMessageForDay(activeDay));
  };

  // Initialize DB on mount with safety timer fallback
  useEffect(() => {
    let isMounted = true;
    
    // Safety fallback: if anything delays IndexedDB, guarantee UI renders in <=600ms
    const safetyTimer = setTimeout(() => {
      if (isMounted) setIsDbLoaded(true);
    }, 600);

    async function loadApp() {
      try {
        await initializeDatabase();
        await refreshAllData(todayStr);
      } catch (err) {
        console.warn('Initial data load note:', err);
      } finally {
        clearTimeout(safetyTimer);
        if (isMounted) setIsDbLoaded(true);
      }
    }
    loadApp();

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, []);

  // Automatically refresh whenever local calendar date changes
  useEffect(() => {
    if (isDbLoaded) {
      refreshAllData(todayStr);
      if (!selectedDateStr) setSelectedDateStr(todayStr);
    }
  }, [todayStr]);

  const handleAskAIWithPrompt = (prompt?: string) => {
    setIsAIOpen(true);
  };

  const handleUpdateDay = async (newDay: number) => {
    await db.profiles.update(1, { currentDay: newDay });
    setProfile(prev => ({ ...prev, currentDay: newDay }));
    setLoveNote(getLoveMessageForDay(newDay));
  };

  const handleTogglePause = async () => {
    const nextPaused = !profile.isPaused;
    await db.profiles.update(1, { isPaused: nextPaused });
    setProfile(prev => ({ ...prev, isPaused: nextPaused }));
  };

  const handleUpdateProfile = async (updated: UserProfile) => {
    await db.profiles.put(updated);
    setProfile(updated);
  };

  if (!isDbLoaded) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-roseDust-400 border-t-transparent animate-spin mx-auto" />
          <h2 className="font-serif font-bold text-plum-950 text-lg">
            HER JOURNEY 240 — BODY, MIND & US ❤️
          </h2>
          <p className="text-xs text-plum-600 font-sans">
            Preparing Deep's private wellness sanctuary...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 text-plum-900 flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        profile={profile}
        currentTab={currentTab}
        todayFormatted={formattedDate}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenAI={() => setIsAIOpen(true)}
        onOpenEmergency={() => {
          setSpecificSafetyAlert(undefined);
          setIsEmergencyOpen(true);
        }}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full max-w-4xl mx-auto">
        {/* 1. TODAY SECTION */}
        {currentTab === 'today' && (
          <TodayView
            profile={profile}
            todayStr={todayStr}
            selectedDateStr={selectedDateStr || todayStr}
            onChangeSelectedDate={(d) => setSelectedDateStr(d)}
            onOpenDietTab={() => setCurrentTab('diet')}
            onOpenWorkoutTab={() => setCurrentTab('workout')}
            onOpenProgressTab={() => setCurrentTab('progress')}
            onAskAI={handleAskAIWithPrompt}
          />
        )}

        {/* 2. LAZY-LOADED SECONDARY SECTIONS */}
        <Suspense fallback={<ViewLoadingFallback />}>
          {(currentTab === 'diet' || currentTab === 'food') && (
            <DietView
              profile={profile}
              selectedDateStr={selectedDateStr || todayStr}
              onChangeSelectedDate={(d) => setSelectedDateStr(d)}
              onAskAI={handleAskAIWithPrompt}
            />
          )}

          {(currentTab === 'workout' || currentTab === 'movement') && (
            <WorkoutView
              profile={profile}
              selectedDateStr={selectedDateStr || todayStr}
              onChangeSelectedDate={(d) => setSelectedDateStr(d)}
              onAskAI={handleAskAIWithPrompt}
            />
          )}

          {currentTab === 'progress' && (
            <ProgressView
              profile={profile}
              onAskAI={handleAskAIWithPrompt}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              profile={profile}
              preferences={preferences}
              onUpdateProfile={(up) => setProfile(up)}
              onUpdatePreferences={(up) => setPreferences(up)}
              onResetAllData={() => refreshAllData(todayStr)}
            />
          )}

          {currentTab === 'journey' && (
            <JourneyView
              profile={profile}
              onUpdateDay={handleUpdateDay}
              onTogglePause={handleTogglePause}
              onAskAI={handleAskAIWithPrompt}
            />
          )}

          {currentTab === 'cycle' && (
            <CycleView
              profile={profile}
              todayStr={todayStr}
              formattedDate={formattedDate}
              onStartRoutine={() => setCurrentTab('workout')}
              onAskAI={handleAskAIWithPrompt}
            />
          )}

          {currentTab === 'detox' && (
            <DetoxView
              onAskAI={handleAskAIWithPrompt}
            />
          )}

          {currentTab === 'mind' && (
            <MindView />
          )}

          {currentTab === 'love' && (
            <LoveView />
          )}
        </Suspense>
      </main>

      {/* Floating AI Companion Trigger Button */}
      <FloatingAIAssistant
        onOpen={() => setIsAIOpen(true)}
      />

      {/* Persistent AI Chat Companion Drawer */}
      <ChatDrawer
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        profile={profile}
        isPeriod={currentCycleDay <= 2}
        onActionExecuted={() => refreshAllData(todayStr)}
      />

      {/* Urgent Medical Safety & Red Flag Modal */}
      <RedFlagAlertModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        specificAlert={specificSafetyAlert}
      />

      {/* Mobile-first Bottom Navigation Bar (5 Primary Sections) */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
      />

    </div>
  );
}

export default App;
