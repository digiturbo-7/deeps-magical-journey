import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Award, Download, FileSpreadsheet, Plus, 
  Trash2, Heart, Scale, Flame, Activity, ShieldCheck, 
  HelpCircle, Calendar, Sparkles, CheckCircle2 
} from 'lucide-react';
import { NonScaleWin, WeightEntry, UserProfile, FoodLog, ActivityLog } from '../../types';
import { db } from '../../db';
import { getLocalDateString, formatDisplayDate } from '../../utils/dateUtils';
import { exportAllUserData, exportActivityCSV } from '../../services/exportService';
import confetti from 'canvas-confetti';

interface ProgressViewProps {
  profile: UserProfile;
  onAskAI: (prompt: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ profile, onAskAI }) => {
  const [nonScaleWins, setNonScaleWins] = useState<NonScaleWin[]>([]);
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [allFoodLogs, setAllFoodLogs] = useState<FoodLog[]>([]);
  const [allActivityLogs, setAllActivityLogs] = useState<ActivityLog[]>([]);
  
  // New Weight Entry modal / form state
  const [newWeightKg, setNewWeightKg] = useState<number | ''>(profile.weightKg || 86.2);
  const [newWeightDate, setNewWeightDate] = useState(getLocalDateString());
  const [newWeightNotes, setNewWeightNotes] = useState('');
  const [isPeriodWeight, setIsPeriodWeight] = useState(false);
  const [newWaistInches, setNewWaistInches] = useState<string>('');

  // New Non-Scale Victory Form state
  const [newWinTitle, setNewWinTitle] = useState('');
  const [newWinCategory, setNewWinCategory] = useState<'stamina' | 'sleep' | 'mood' | 'clothes' | 'consistency'>('stamina');
  const [isAddingWin, setIsAddingWin] = useState(false);

  useEffect(() => {
    loadAllProgressData();
  }, []);

  const loadAllProgressData = async () => {
    const wins = await db.nonScaleWins.toArray();
    setNonScaleWins(wins.reverse());
    
    const weightList = await db.weightLogs.toArray();
    setWeights(weightList.sort((a, b) => b.date.localeCompare(a.date)));

    const foods = await db.foodLogs.toArray();
    setAllFoodLogs(foods);

    const acts = await db.activityLogs.toArray();
    setAllActivityLogs(acts);
  };

  // Add Weight Log without overwriting previous history
  const handleSaveWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newWeightKg === '') return;

    const w = Number(newWeightKg);
    const entry: WeightEntry = {
      date: newWeightDate,
      weightKg: w,
      isPeriodWeek: isPeriodWeight,
      notes: `${newWeightNotes} ${newWaistInches ? `| Waist: ${newWaistInches} in` : ''}`.trim()
    };

    await db.weightLogs.add(entry);

    // Update profile current weight if latest date
    if (newWeightDate >= getLocalDateString()) {
      await db.profiles.update(1, { weightKg: w });
    }

    setNewWeightNotes('');
    setNewWaistInches('');
    await loadAllProgressData();
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    alert(`Weight logged for ${newWeightDate}: ${w} kg. Historical logs preserved.`);
  };

  // Add Non-Scale Win
  const handleAddWin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWinTitle.trim()) return;

    await db.nonScaleWins.add({
      date: getLocalDateString(),
      category: newWinCategory,
      title: newWinTitle.trim(),
      description: 'Honored in Deep\'s Magical Journey ❤️'
    });

    setNewWinTitle('');
    setIsAddingWin(false);
    await loadAllProgressData();
    confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 } });
  };

  // Computed metrics
  const startingWeight = profile.initialWeightKg || 88.5;
  const currentWeight = weights.length > 0 ? weights[0].weightKg : (profile.weightKg || 86.2);
  const netWeightChange = Math.round((currentWeight - startingWeight) * 10) / 10;

  // Calculate rolling weekly average (most recent 7 weigh-ins)
  const recent7 = weights.slice(0, 7);
  const weeklyAverageWeight = recent7.length > 0
    ? Math.round((recent7.reduce((s, w) => s + w.weightKg, 0) / recent7.length) * 10) / 10
    : currentWeight;

  // Calculate average daily calories from logged days
  const loggedDates = Array.from(new Set(allFoodLogs.map(f => f.date)));
  const totalCalsAll = allFoodLogs.reduce((s, f) => s + (f.caloriesApprox || 0), 0);
  const avgDailyCals = loggedDates.length > 0 ? Math.round(totalCalsAll / loggedDates.length) : 0;

  // Download real Excel workbook
  const handleDownloadExcel = () => {
    const link = document.createElement('a');
    link.href = '/HER_JOURNEY_240_BODY_MIND_US_TRACKER.xlsx';
    link.download = 'HER_JOURNEY_240_BODY_MIND_US_TRACKER.xlsx';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 pb-24 animate-fadeIn max-w-4xl mx-auto px-4 pt-3 font-sans">
      
      {/* Header & Excel Download Spotlight */}
      <div className="rounded-3xl bg-gradient-to-br from-plum-950 via-plum-900 to-roseDust-950 text-white p-5 sm:p-6 shadow-soft-lg border border-plum-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-roseDust-300">
              Transformational Journey
            </span>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-white mt-0.5">
              Progress, Trends & Real Excel Tracker
            </h2>
            <p className="text-xs text-cream-300 mt-1">
              Holistic wellness • Non-scale victories • Downloadable master 240-day workbook
            </p>
          </div>

          {/* Master Excel Download Button */}
          <button
            onClick={handleDownloadExcel}
            className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-soft transition-all active:scale-95 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Real Excel Workbook (.xlsx)</span>
          </button>
        </div>

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] uppercase font-bold text-cream-300">Starting Weight</span>
            <div className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
              {startingWeight} <span className="text-xs font-sans text-cream-300">kg</span>
            </div>
            <span className="text-[10px] text-cream-300 block mt-0.5">Oct 24, 2026 Baseline</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] uppercase font-bold text-cream-300">Current Weight</span>
            <div className="text-xl sm:text-2xl font-bold font-serif text-roseDust-300 mt-1">
              {currentWeight} <span className="text-xs font-sans text-cream-300">kg</span>
            </div>
            <span className="text-[10px] text-cream-300 block mt-0.5">Latest Check-in</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] uppercase font-bold text-cream-300">Total Change</span>
            <div className="text-xl sm:text-2xl font-bold font-serif text-emerald-300 mt-1">
              {netWeightChange <= 0 ? `${netWeightChange} kg` : `+${netWeightChange} kg`}
            </div>
            <span className="text-[10px] text-cream-300 block mt-0.5">Gentle, safe fat loss</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] uppercase font-bold text-cream-300">Rolling Weekly Avg</span>
            <div className="text-xl sm:text-2xl font-bold font-serif text-amber-200 mt-1">
              {weeklyAverageWeight} <span className="text-xs font-sans text-cream-300">kg</span>
            </div>
            <span className="text-[10px] text-cream-300 block mt-0.5">Smoothed trend</span>
          </div>
        </div>

        {/* Backups row */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-cream-300 text-[11px]">
            <span>Avg Daily Intake: <strong className="text-white">{avgDailyCals} kcal</strong></span>
            <span>•</span>
            <span>Workouts Logged: <strong className="text-white">{allActivityLogs.length}</strong></span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => exportAllUserData()}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-white transition-all flex items-center space-x-1"
              title="Export complete backup as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup JSON</span>
            </button>
            <button
              onClick={() => exportActivityCSV()}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-white transition-all flex items-center space-x-1"
              title="Export logs as CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* EXCEL WORKBOOK DESCRIPTION CARD */}
      <div className="rounded-3xl bg-white p-5 border border-cream-300 shadow-soft">
        <div className="flex items-center space-x-2.5 mb-2">
          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
          <h3 className="font-serif font-bold text-base text-plum-950">
            Real 9-Sheet Master Excel Workbook Included (.xlsx)
          </h3>
        </div>
        <p className="text-xs text-plum-600 leading-relaxed mb-3">
          This project includes a real, fully automated Excel workbook formatted with formulas (SUMIFS, AVERAGEIFS, IFERROR), conditional formatting, and Openpyxl charts:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-plum-800">
          <div className="p-2.5 bg-cream-50 rounded-xl border border-cream-200">
            <strong>Sheet 1: Setup</strong> • Profile, Mifflin-St Jeor formula, baseline multiplier, target calories.
          </div>
          <div className="p-2.5 bg-cream-50 rounded-xl border border-cream-200">
            <strong>Sheet 2: Daily Diet Plan</strong> • All 240 days, 3 options per meal, macros, costs, cooking notes.
          </div>
          <div className="p-2.5 bg-cream-50 rounded-xl border border-cream-200">
            <strong>Sheet 3: Workout Plan</strong> • Walking routines, strict REST DAY markers, YouTube video links.
          </div>
          <div className="p-2.5 bg-cream-50 rounded-xl border border-cream-200">
            <strong>Sheet 4: Actual Food Log</strong> • Prepopulated logs + custom food diary entries.
          </div>
          <div className="p-2.5 bg-cream-50 rounded-xl border border-cream-200">
            <strong>Sheet 5: Exercise Log</strong> • MET calculation logs & wearable overrides.
          </div>
          <div className="p-2.5 bg-cream-50 rounded-xl border border-cream-200">
            <strong>Sheet 6: Calorie Summary</strong> • Real formulas for consumed, TDEE, and daily deficit.
          </div>
          <div className="p-2.5 bg-cream-50 rounded-xl border border-cream-200">
            <strong>Sheet 7: Weight & Waist</strong> • Rolling averages, change from start, cycle notes.
          </div>
          <div className="p-2.5 bg-cream-50 rounded-xl border border-cream-200">
            <strong>Sheet 8: Grocery List</strong> • Affordable Bengaluru staples, prices in INR.
          </div>
          <div className="p-2.5 bg-cream-50 rounded-xl border border-cream-200">
            <strong>Sheet 9: Dashboard</strong> • Real charts for Weight, Calories vs Target, Deficit, and Protein.
          </div>
        </div>
      </div>

      {/* WEIGHT & WAIST TRACKING (SECTION 9) */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 border border-cream-300 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <Scale className="w-5 h-5 text-roseDust-600" />
            <h3 className="font-serif font-bold text-base sm:text-lg text-plum-950">
              Weight & Body Measurement Log
            </h3>
          </div>
          <span className="text-[11px] text-plum-500 font-medium">
            Weigh once weekly or optionally daily in consistent morning conditions
          </span>
        </div>

        {/* Compassionate Fluctuations Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs leading-relaxed mb-4">
          <strong className="text-amber-950 block mb-0.5">Scientific Fluid Fluctuation Note:</strong>
          Daily weight fluctuates 1–2 kg due to menstrual phase, hydration, sodium, and digestion. A higher morning weight never means instant fat gain. We look at the 7-day rolling average trend! ❤️
        </div>

        {/* Log Weight Form */}
        <form onSubmit={handleSaveWeight} className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-3 text-xs mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="font-bold text-plum-800 block mb-1">Date</label>
              <input
                type="date"
                required
                value={newWeightDate}
                onChange={(e) => setNewWeightDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-cream-300 text-plum-900 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-plum-800 block mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                required
                value={newWeightKg}
                onChange={(e) => setNewWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-white border border-cream-300 text-plum-900 font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-plum-800 block mb-1">Waist (Inches, optional)</label>
              <input
                type="text"
                placeholder="e.g. 34.5 in"
                value={newWaistInches}
                onChange={(e) => setNewWaistInches(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-cream-300 text-plum-900 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-plum-800 block mb-1">Period / Water Retention?</label>
              <select
                value={isPeriodWeight ? 'yes' : 'no'}
                onChange={(e) => setIsPeriodWeight(e.target.value === 'yes')}
                className="w-full p-2.5 rounded-xl bg-white border border-cream-300 text-plum-900 font-medium"
              >
                <option value="no">Normal / Clear</option>
                <option value="yes">Period / Fluid Retention</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-plum-800 block mb-1">Check-in Notes / Non-Scale Feeling</label>
            <input
              type="text"
              placeholder="e.g. Slept 8 hours, felt light & energetic"
              value={newWeightNotes}
              onChange={(e) => setNewWeightNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-cream-300 text-plum-900 font-medium"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2 bg-plum-900 hover:bg-plum-950 text-white font-bold rounded-xl shadow-soft"
            >
              Record Weight Check-in
            </button>
          </div>
        </form>

        {/* History of Weight Logs */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-plum-500 block">
            Recent Check-ins (Historical records preserved):
          </span>
          <div className="divide-y divide-cream-100">
            {weights.map((w) => (
              <div key={w.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-plum-900">{formatDisplayDate(w.date)}</span>
                  {w.isPeriodWeek && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-roseDust-100 text-roseDust-700">
                      Period Week
                    </span>
                  )}
                  <p className="text-[11px] text-plum-500 mt-0.5">{w.notes || 'Routine check-in'}</p>
                </div>

                <div className="text-right">
                  <span className="font-bold text-sm text-plum-950">{w.weightKg} kg</span>
                  <span className="text-[11px] text-plum-500 block">
                    {Math.round((w.weightKg - startingWeight) * 10) / 10} kg from start
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NON-SCALE VICTORIES WALL */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 border border-cream-300 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif font-bold text-base sm:text-lg text-plum-950">
              Non-Scale Victories & Life Wins
            </h3>
          </div>

          <button
            onClick={() => setIsAddingWin(!isAddingWin)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-roseDust-50 hover:bg-roseDust-100 text-roseDust-700 rounded-xl text-xs font-bold border border-roseDust-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Win</span>
          </button>
        </div>

        {isAddingWin && (
          <form onSubmit={handleAddWin} className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-3 text-xs mb-4 animate-scaleUp">
            <div>
              <label className="font-bold text-plum-800 block mb-1">What made you proud today?</label>
              <input
                type="text"
                required
                placeholder="e.g. Climbed stairs without breathless fatigue, loved home cooked meal"
                value={newWinTitle}
                onChange={(e) => setNewWinTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-cream-300"
              />
            </div>

            <div className="flex items-center justify-between">
              <select
                value={newWinCategory}
                onChange={(e) => setNewWinCategory(e.target.value as any)}
                className="p-2 rounded-xl bg-white border border-cream-300 text-xs font-medium"
              >
                <option value="stamina">Stamina & Fitness</option>
                <option value="sleep">Deep Restful Sleep</option>
                <option value="consistency">Consistency & Self-love</option>
                <option value="clothes">Clothes Fitting Better</option>
                <option value="mood">Joyful Radiant Mood</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2 bg-roseDust-500 hover:bg-roseDust-600 text-white font-bold rounded-xl shadow-2xs"
              >
                Save Victory
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {nonScaleWins.map((win) => (
            <div key={win.id} className="p-3.5 rounded-2xl bg-gradient-to-r from-cream-50 to-roseDust-50/40 border border-cream-200 text-xs">
              <div className="flex items-center justify-between text-[10px] text-plum-500 uppercase font-bold mb-1">
                <span>{win.category}</span>
                <span>{formatDisplayDate(win.date)}</span>
              </div>
              <h4 className="font-bold text-plum-950 text-sm">{win.title}</h4>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
