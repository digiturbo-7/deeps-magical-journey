import React, { useState } from 'react';
import { 
  Settings, User, Flame, Download, Upload, Trash2, 
  Check, AlertTriangle, ShieldCheck, HelpCircle, Sparkles, 
  FileSpreadsheet, RefreshCw 
} from 'lucide-react';
import { UserProfile, UserPreferences } from '../../types';
import { db } from '../../db';
import { calculateMifflinBmr, calculateBaselineTdee } from '../../services/plan240Service';
import { getLocalDateString } from '../../utils/dateUtils';
import { exportAllUserData } from '../../services/exportService';
import confetti from 'canvas-confetti';

interface SettingsViewProps {
  profile: UserProfile;
  preferences: UserPreferences;
  onUpdateProfile: (updated: UserProfile) => void;
  onUpdatePreferences: (updated: UserPreferences) => void;
  onResetAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  preferences,
  onUpdateProfile,
  onUpdatePreferences,
  onResetAllData
}) => {
  // Profile Fields
  const [name, setName] = useState(profile.name || 'Deep');
  const [age, setAge] = useState(profile.age || 25);
  const [heightCm, setHeightCm] = useState(profile.heightCm || 158);
  const [isHeightConfirmed, setIsHeightConfirmed] = useState(true);
  const [weightKg, setWeightKg] = useState(profile.weightKg || 86.2);
  const [location, setLocation] = useState(profile.cuisineRegion || 'Bengaluru, Karnataka, India');
  const [foodPreference, setFoodPreference] = useState(profile.foodPreference || 'non-veg-indian');
  const [exerciseLevel, setExerciseLevel] = useState('Comfortable walking; no current gym routine');
  const [startDate, setStartDate] = useState(profile.startDate || '2026-10-24');
  const [journeyLength, setJourneyLength] = useState(profile.journeyLengthDays || 240);

  // Calorie Calculator Assumptions
  const [activityMultiplier, setActivityMultiplier] = useState(1.20); // 1.20 sedentary baseline
  const [deficitTarget, setDeficitTarget] = useState(350); // 350 kcal moderate deficit
  const [proteinMultiplier, setProteinMultiplier] = useState(1.0); // 1.0 g per kg

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Computed Interactive Calorie Calculator Values
  const currentBmr = calculateMifflinBmr(Number(weightKg) || 86.2, Number(heightCm) || 158, Number(age) || 25);
  const currentMaintenance = calculateBaselineTdee(currentBmr, activityMultiplier);
  const targetCalories = Math.max(1200, currentMaintenance - deficitTarget);
  const targetProteinG = Math.round((Number(weightKg) || 86.2) * proteinMultiplier);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const newWeight = Number(weightKg) || 86.2;
    const newHeight = Number(heightCm) || 158;

    const updatedProf: UserProfile = {
      ...profile,
      name,
      age: Number(age) || 25,
      heightCm: newHeight,
      weightKg: newWeight,
      initialWeightKg: profile.initialWeightKg || 88.5, // PRESERVE HISTORICAL BASELINE
      foodPreference,
      cuisineRegion: location,
      startDate,
      journeyLengthDays: Number(journeyLength) || 240
    };

    await db.profiles.put(updatedProf);
    onUpdateProfile(updatedProf);

    // If current weight changed, record an entry into weightLogs so history is preserved
    if (newWeight !== profile.weightKg) {
      await db.weightLogs.add({
        date: getLocalDateString(),
        weightKg: newWeight,
        isPeriodWeek: false,
        notes: 'Profile settings update check-in ❤️'
      });
    }

    setSavedSuccess(true);
    confetti({ particleCount: 40, spread: 45, origin: { y: 0.6 } });
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Safe JSON Import Restoration
  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (data.profile && Array.isArray(data.profile)) {
        await db.profiles.bulkPut(data.profile);
      }
      if (data.foodLogs && Array.isArray(data.foodLogs)) {
        await db.foodLogs.bulkPut(data.foodLogs);
      }
      if (data.activityLogs && Array.isArray(data.activityLogs)) {
        await db.activityLogs.bulkPut(data.activityLogs);
      }
      if (data.weightLogs && Array.isArray(data.weightLogs)) {
        await db.weightLogs.bulkPut(data.weightLogs);
      }
      if (data.nonScaleWins && Array.isArray(data.nonScaleWins)) {
        await db.nonScaleWins.bulkPut(data.nonScaleWins);
      }

      setImportStatus('Backup restored successfully! Refreshing data...');
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      setTimeout(() => {
        setImportStatus(null);
        onResetAllData();
      }, 1500);
    } catch (err: any) {
      alert(`Import failed: ${err.message}. Please select a valid JSON backup.`);
    }
  };

  // Download real Excel workbook
  const handleDownloadExcel = () => {
    const link = document.createElement('a');
    link.href = '/HER_JOURNEY_240_BODY_MIND_US_TRACKER.xlsx';
    link.download = 'HER_JOURNEY_240_BODY_MIND_US_TRACKER.xlsx';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Dual Confirmation Safe Erase
  const handleDeleteAll = async () => {
    if (confirm('Are you sure you want to completely erase all your saved logs and reset to fresh state? This cannot be undone.')) {
      if (confirm('Please confirm once more: Permanently delete all local health records?')) {
        await db.foodLogs.clear();
        await db.activityLogs.clear();
        await db.weightLogs.clear();
        await db.nonScaleWins.clear();
        onResetAllData();
        alert('All local activity and food logs have been safely reset.');
      }
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fadeIn max-w-4xl mx-auto px-4 pt-3 font-sans">
      
      {/* Header Card */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 border border-cream-300 shadow-soft">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-roseDust-100 text-roseDust-600 rounded-2xl">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-plum-950">
              Personal Profile & Calorie Calculator
            </h2>
            <p className="text-xs sm:text-sm text-plum-500">
              HER JOURNEY 240 — BODY, MIND & US ❤️ • Private on-device settings
            </p>
          </div>
        </div>
      </div>

      {/* HEIGHT CONFIRMATION ALERT (SECTION 1 REQUIREMENT) */}
      <div className="rounded-3xl bg-amber-50 border border-amber-200 p-4 sm:p-5 text-xs text-amber-950 space-y-2">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <h3 className="font-bold text-sm text-amber-950">
            Height Confirmation & Initial Profile Verification
          </h3>
        </div>
        <p className="leading-relaxed">
          Your initial height is set to <strong>158 cm (~5 feet 2 inches)</strong> and weight to <strong>86.2 kg</strong>. Please verify or update your exact height below. Your BMR and calorie estimates update automatically based on your confirmed inputs!
        </p>
      </div>

      {/* 1. HER PROFILE EDITABLE FORM */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 border border-cream-300 shadow-soft">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-cream-200">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-roseDust-600" />
            <h3 className="font-serif font-bold text-base sm:text-lg text-plum-950">
              1. Her Profile Details
            </h3>
          </div>

          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full animate-fadeIn">
              ✓ Settings Saved Successfully!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-plum-800 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-plum-800 block mb-1">Age (Years)</label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-plum-800 block mb-1">
                Height (cm) — <span className="text-roseDust-600">Please confirm</span>
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-roseDust-300 font-bold"
              />
              <span className="text-[10px] text-plum-500 mt-0.5 block">
                {heightCm ? `Approx ${Math.floor(heightCm / 30.48)} ft ${Math.round((heightCm % 30.48) / 2.54)} in` : ''}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-plum-800 block mb-1">Current Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                required
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300 font-bold"
              />
              <span className="text-[10px] text-plum-500 mt-0.5 block">
                Baseline starting weight preserved: {profile.initialWeightKg || 88.5} kg
              </span>
            </div>

            <div>
              <label className="font-bold text-plum-800 block mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-plum-800 block mb-1">Food Preference</label>
              <select
                value={foodPreference}
                onChange={(e) => setFoodPreference(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300 font-medium"
              >
                <option value="non-veg-indian">Non-Vegetarian (with veg alternatives)</option>
                <option value="veg-indian">Strictly Vegetarian</option>
                <option value="eggetarian">Eggetarian</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-plum-800 block mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-plum-800 block mb-1">Journey Duration</label>
              <input
                type="number"
                required
                value={journeyLength}
                onChange={(e) => setJourneyLength(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300 font-medium"
              />
              <span className="text-[10px] text-plum-500 mt-0.5 block">
                240 Days: Oct 24, 2026 – Jun 20, 2027
              </span>
            </div>

            <div>
              <label className="font-bold text-plum-800 block mb-1">Current Exercise Level</label>
              <input
                type="text"
                value={exerciseLevel}
                onChange={(e) => setExerciseLevel(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300 font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-plum-900 hover:bg-plum-950 text-white font-bold rounded-2xl shadow-soft transition-all active:scale-95"
            >
              Save Profile Updates
            </button>
          </div>
        </form>
      </div>

      {/* 2. CALORIE TARGET AND DEFICIT CALCULATOR (SECTION 4) */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 border border-cream-300 shadow-soft">
        <div className="flex items-center space-x-2.5 mb-3 pb-2 border-b border-cream-200">
          <Flame className="w-5 h-5 text-amber-500" />
          <h3 className="font-serif font-bold text-base sm:text-lg text-plum-950">
            2. Calorie Target & Deficit Calculator (Mifflin–St Jeor)
          </h3>
        </div>

        <p className="text-xs text-plum-600 leading-relaxed mb-4">
          Uses the scientifically validated <strong>Mifflin–St Jeor equation</strong> for women to estimate Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE). Adjust assumptions below:
        </p>

        {/* Assumptions Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-cream-50 border border-cream-200 text-xs mb-4">
          <div>
            <label className="font-bold text-plum-900 block mb-1">
              Baseline Activity Multiplier:
            </label>
            <select
              value={activityMultiplier}
              onChange={(e) => setActivityMultiplier(Number(e.target.value))}
              className="w-full p-2 rounded-xl bg-white border border-cream-300 font-medium"
            >
              <option value={1.20}>1.20 — Sedentary (Desk work, exercise logged separately)</option>
              <option value={1.30}>1.30 — Light activity (Daily walking & chores)</option>
              <option value={1.375}>1.375 — Moderately active</option>
            </select>
            <span className="text-[10px] text-plum-500 mt-1 block">
              Energy Model Rule: Baseline excludes exercise. Logged exercise is added to prevent double-counting!
            </span>
          </div>

          <div>
            <label className="font-bold text-plum-900 block mb-1">
              Planned Deficit: <strong>{deficitTarget} kcal</strong>
            </label>
            <input
              type="range"
              min="200"
              max="500"
              step="25"
              value={deficitTarget}
              onChange={(e) => setDeficitTarget(Number(e.target.value))}
              className="w-full accent-roseDust-600"
            />
            <span className="text-[10px] text-plum-500 mt-1 block">
              300–400 kcal is a moderate, safe deficit that protects energy and hormone balance.
            </span>
          </div>

          <div>
            <label className="font-bold text-plum-900 block mb-1">
              Protein Target: <strong>{proteinMultiplier.toFixed(1)} g/kg</strong> ({targetProteinG}g)
            </label>
            <input
              type="range"
              min="0.8"
              max="1.4"
              step="0.1"
              value={proteinMultiplier}
              onChange={(e) => setProteinMultiplier(Number(e.target.value))}
              className="w-full accent-roseDust-600"
            />
            <span className="text-[10px] text-plum-500 mt-1 block">
              ~1.0 g/kg preserves lean tissue and maximizes fullness.
            </span>
          </div>
        </div>

        {/* Live Calculated Output Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200">
            <span className="text-[10px] font-bold text-plum-500 uppercase">Mifflin BMR</span>
            <div className="text-xl font-bold font-serif text-plum-950 mt-1">
              {currentBmr} <span className="text-xs font-sans font-normal text-plum-500">kcal</span>
            </div>
            <span className="text-[10px] text-plum-500">Body at rest</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200">
            <span className="text-[10px] font-bold text-plum-500 uppercase">Baseline TDEE</span>
            <div className="text-xl font-bold font-serif text-plum-950 mt-1">
              {currentMaintenance} <span className="text-xs font-sans font-normal text-plum-500">kcal</span>
            </div>
            <span className="text-[10px] text-plum-500">Maintenance (excl. ex.)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-roseDust-50 border border-roseDust-200">
            <span className="text-[10px] font-bold text-roseDust-700 uppercase">Target Intake</span>
            <div className="text-xl font-bold font-serif text-roseDust-800 mt-1">
              {targetCalories} <span className="text-xs font-sans font-normal text-roseDust-600">kcal</span>
            </div>
            <span className="text-[10px] text-roseDust-600">Nourishing plan</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-800 uppercase">Daily Deficit</span>
            <div className="text-xl font-bold font-serif text-emerald-900 mt-1">
              {deficitTarget} <span className="text-xs font-sans font-normal text-emerald-700">kcal</span>
            </div>
            <span className="text-[10px] text-emerald-700">Safe, non-starvation</span>
          </div>
        </div>

        {/* Scientific Uncertainty Note */}
        <div className="mt-4 p-3 bg-cream-50 rounded-2xl text-[11px] text-plum-600 space-y-1 border border-cream-200">
          <p>• <strong>Deficit Formula:</strong> Estimated Calorie Deficit = Estimated Total Daily Expenditure − Actual Calories Consumed.</p>
          <p>• <strong>Uncertainty Note:</strong> Human metabolism is dynamic. Calorie formulas provide reliable estimates, not absolute guarantees. We adjust based on hunger, energy, and recovery over several weeks.</p>
        </div>
      </div>

      {/* 3. EXCEL WORKBOOK & DATA BACKUP / RESTORE */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 border border-cream-300 shadow-soft">
        <h3 className="font-serif font-bold text-base sm:text-lg text-plum-950 mb-3 pb-2 border-b border-cream-200">
          3. Excel Download & Data Management
        </h3>

        {importStatus && (
          <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold animate-fadeIn">
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
          <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-plum-950 text-sm">Download Real Excel Tracker (.xlsx)</h4>
              <p className="text-plum-600 mt-1">
                Download the complete 240-day workbook with all 9 sheets, SUMIFS formulas, and Openpyxl charts.
              </p>
            </div>
            <button
              onClick={handleDownloadExcel}
              className="mt-3 flex items-center justify-center space-x-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-2xs"
            >
              <Download className="w-4 h-4" />
              <span>Download Excel (.xlsx)</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-plum-950 text-sm">Safe JSON Backup & Restore</h4>
              <p className="text-plum-600 mt-1">
                Save an exact snapshot of your health records or restore a previous backup without losing any data.
              </p>
            </div>
            <div className="mt-3 flex items-center space-x-2">
              <button
                onClick={() => exportAllUserData()}
                className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-white hover:bg-cream-100 text-plum-800 font-bold rounded-xl border border-cream-300"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
              
              <label className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-white hover:bg-cream-100 text-plum-800 font-bold rounded-xl border border-cream-300 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Restore JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Safe Erase logs */}
        <div className="pt-3 border-t border-cream-200 flex items-center justify-between">
          <span className="text-[11px] text-plum-500">
            Clear all logged entries and reset to fresh state (requires confirmation)
          </span>
          <button
            onClick={handleDeleteAll}
            className="flex items-center space-x-1 px-3 py-1.5 text-softCoral-600 hover:text-softCoral-700 hover:bg-softCoral-50 rounded-xl text-xs font-bold transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Logs</span>
          </button>
        </div>
      </div>

    </div>
  );
};
