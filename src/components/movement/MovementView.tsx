import React, { useState } from 'react';
import { 
  Activity, Play, Sparkles, ShieldAlert, Timer, Bed, 
  Settings2, Heart, Check, Info, ArrowRight, Gauge,
  Home, Wind, AlertCircle, RefreshCw, Footprints, Flame, CheckCircle2
} from 'lucide-react';
import { WorkoutRoutine, UserProfile } from '../../types';
import { WORKOUT_ROUTINES } from '../../data/exercises';
import { WorkoutPlayer } from './WorkoutPlayer';

interface MovementViewProps {
  profile: UserProfile;
  onUpdateProfile?: (updated: UserProfile) => void;
  onOpenSafetyGuide: () => void;
  onAskAI: (prompt: string) => void;
}

export const MovementView: React.FC<MovementViewProps> = ({
  profile,
  onUpdateProfile,
  onOpenSafetyGuide,
  onAskAI
}) => {
  const [energyLevel, setEnergyLevel] = useState<'low_energy' | 'normal' | 'feeling_good'>('low_energy');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'alternatives' | 'period_care' | 'gentle_strength' | 'treadmill'>('all');
  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  // Walking mode: 'home_alternatives' is active while treadmill is unavailable
  const isTreadmillAvailable = profile.treadmillSettings?.available ?? false;
  const [walkingMode, setWalkingMode] = useState<'home_alternatives' | 'treadmill'>(
    isTreadmillAvailable ? 'treadmill' : 'home_alternatives'
  );

  // Living room walk custom duration
  const [homeWalkDuration, setHomeWalkDuration] = useState<number>(13);
  const [homeWalkSaved, setHomeWalkSaved] = useState<boolean>(false);

  // Treadmill customizer states
  const [treadmillSpeed, setTreadmillSpeed] = useState(profile.treadmillSettings?.speedKmh || 5.0);
  const [treadmillIncline, setTreadmillIncline] = useState(profile.treadmillSettings?.inclinePct || 2.0);
  const [treadmillDuration, setTreadmillDuration] = useState(profile.treadmillSettings?.comfortableDurationMins || 13);
  const [treadmillSaved, setTreadmillSaved] = useState(false);

  // Find specific routines by ID
  const livingRoomRoutine = WORKOUT_ROUTINES.find(r => r.id === 'living-room-rhythm-walk') || WORKOUT_ROUTINES[2];
  const stepCardioRoutine = WORKOUT_ROUTINES.find(r => r.id === 'indoor-step-touch-cardio') || WORKOUT_ROUTINES[3];
  const outdoorWalkRoutine = WORKOUT_ROUTINES.find(r => r.id === 'outdoor-balcony-walk') || WORKOUT_ROUTINES[4];
  const treadmillRoutine = WORKOUT_ROUTINES.find(r => r.id === 'treadmill-beginner-custom') || WORKOUT_ROUTINES[5];

  const filteredRoutines = WORKOUT_ROUTINES.filter(r => {
    // Energy level filter
    if (energyLevel === 'low_energy' && r.targetEnergyLevel !== 'low_energy') return false;
    if (energyLevel === 'normal' && (r.targetEnergyLevel !== 'normal' && r.targetEnergyLevel !== 'low_energy')) return false;

    // Category filter
    if (selectedCategory === 'alternatives') {
      return r.id === 'living-room-rhythm-walk' || r.id === 'indoor-step-touch-cardio' || r.id === 'outdoor-balcony-walk';
    }
    if (selectedCategory === 'period_care') return r.category === 'period_care';
    if (selectedCategory === 'gentle_strength') return r.category === 'gentle_strength';
    if (selectedCategory === 'treadmill') return r.category === 'treadmill';

    return true;
  });

  const handleLaunchRoutine = (routine: WorkoutRoutine) => {
    setSelectedRoutine(routine);
    setIsPlayerOpen(true);
  };

  const handleToggleTreadmillAvailability = () => {
    const nextAvailability = !isTreadmillAvailable;
    const newWalkingMode = nextAvailability ? 'treadmill' : 'home_alternatives';
    setWalkingMode(newWalkingMode);

    if (onUpdateProfile) {
      const updated: UserProfile = {
        ...profile,
        treadmillSettings: {
          ...profile.treadmillSettings,
          available: nextAvailability
        }
      };
      onUpdateProfile(updated);
    }
  };

  const handleSaveTreadmillSettings = () => {
    setTreadmillSaved(true);
    setTimeout(() => setTreadmillSaved(false), 2500);
  };

  const handleSaveHomeWalkSettings = () => {
    setHomeWalkSaved(true);
    setTimeout(() => setHomeWalkSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-24 animate-fadeIn max-w-4xl mx-auto px-4 pt-3">
      
      {/* Header Card */}
      <div className="rounded-3xl bg-white/95 p-5 sm:p-6 border border-cream-300 shadow-soft">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-lavenderSoft-100 text-lavenderSoft-500 rounded-2xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-plum-950">
                Movement, Walking & Cardio Sanctuary
              </h2>
              <p className="text-xs sm:text-sm text-plum-500 font-sans">
                Comfort first • No gym needed • Talk-test intensity
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSafetyGuide}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-softCoral-50 hover:bg-softCoral-100 text-softCoral-600 rounded-xl border border-softCoral-200 text-xs font-bold transition-all shrink-0"
          >
            <ShieldAlert className="w-4 h-4 text-softCoral-500" />
            <span>Safety Red Flags</span>
          </button>
        </div>

        {/* Energy Level Selector */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-plum-500 block mb-2">
            How is Deep\'s physical energy today?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'low_energy', label: 'Very Low / Gentle', desc: '3–10 min comfort' },
              { id: 'normal', label: 'Normal Day', desc: '12–15 min rhythm walk' },
              { id: 'feeling_good', label: 'Feeling Energized', desc: '15–20 min active flow' },
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setEnergyLevel(lvl.id as any)}
                className={`p-3 rounded-2xl text-left transition-all ${
                  energyLevel === lvl.id
                    ? 'bg-plum-900 text-white shadow-soft scale-[1.02]'
                    : 'bg-cream-50 hover:bg-cream-100 text-plum-800 border border-cream-200'
                }`}
              >
                <span className="block text-xs font-bold leading-tight">
                  {lvl.label}
                </span>
                <span className={`block text-[10px] mt-0.5 ${energyLevel === lvl.id ? 'text-cream-300' : 'text-plum-500'}`}>
                  {lvl.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Equipment Status Banner: Treadmill Unavailable Notification */}
      <div className={`p-4 rounded-3xl border transition-all ${
        !isTreadmillAvailable
          ? 'bg-gradient-to-r from-amber-50/90 via-cream-50 to-roseDust-50/60 border-amber-300 shadow-soft'
          : 'bg-white/95 border-cream-300 shadow-soft'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-2xl shrink-0 mt-0.5 ${
              !isTreadmillAvailable ? 'bg-amber-100 text-amber-800' : 'bg-sageCare-100 text-sageCare-700'
            }`}>
              {!isTreadmillAvailable ? (
                <Home className="w-5 h-5 text-amber-700" />
              ) : (
                <Footprints className="w-5 h-5 text-sageCare-700" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  !isTreadmillAvailable ? 'bg-amber-200/80 text-amber-900' : 'bg-sageCare-200 text-sageCare-900'
                }`}>
                  {!isTreadmillAvailable ? 'Treadmill Unavailable • Home Alternatives Active' : 'Treadmill Active'}
                </span>
              </div>
              <h3 className="font-serif font-bold text-base text-plum-950 mt-1">
                {!isTreadmillAvailable
                  ? 'Home Walking Alternatives Activated for Deep'
                  : 'Treadmill & Walking Routines'}
              </h3>
              <p className="text-xs text-plum-600 mt-0.5 leading-relaxed font-sans max-w-xl">
                {!isTreadmillAvailable
                  ? 'Since the treadmill is unavailable right now, your consistency continues uninterrupted! These zero-equipment indoor and outdoor alternatives deliver the identical gentle calorie burn and stamina benefits as your 13-minute, 5.0 km/h baseline.'
                  : 'Your personal treadmill baseline (Speed 5.0 km/h, Incline 2%) is ready, with home walk alternatives always on standby.'}
              </p>
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={handleToggleTreadmillAvailability}
            className="w-full sm:w-auto shrink-0 px-3.5 py-2 bg-white hover:bg-cream-100 text-plum-800 text-xs font-bold rounded-xl border border-cream-300 shadow-2xs transition-all active:scale-95 flex items-center justify-center space-x-1.5"
            title="Toggle treadmill availability"
          >
            <RefreshCw className="w-3.5 h-3.5 text-plum-500" />
            <span>
              {!isTreadmillAvailable ? 'Treadmill Ready? Switch to Treadmill' : 'Treadmill Unavailable? Switch to Home Walks'}
            </span>
          </button>
        </div>

        {/* Walking Mode Switcher Tabs */}
        <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-cream-200/80">
          <button
            onClick={() => setWalkingMode('home_alternatives')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              walkingMode === 'home_alternatives'
                ? 'bg-plum-900 text-white shadow-xs'
                : 'bg-white/80 hover:bg-cream-100 text-plum-700 border border-cream-200'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>🏠 Home Walk Alternatives ({!isTreadmillAvailable ? 'Active' : 'Standby'})</span>
          </button>

          <button
            onClick={() => setWalkingMode('treadmill')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              walkingMode === 'treadmill'
                ? 'bg-plum-900 text-white shadow-xs'
                : 'bg-white/80 hover:bg-cream-100 text-plum-700 border border-cream-200'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>🏃 Treadmill Settings ({isTreadmillAvailable ? 'Ready' : 'Paused'})</span>
          </button>
        </div>
      </div>

      {/* Mode A: Home Walking Alternatives Hub (Featured when Treadmill is unavailable) */}
      {walkingMode === 'home_alternatives' && (
        <div className="rounded-3xl bg-gradient-to-br from-cream-50 via-white to-roseDust-50/50 p-5 sm:p-6 border border-roseDust-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-roseDust-100 text-roseDust-600 rounded-2xl">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-plum-950">
                  Featured Alternative: 13-Min Living Room Rhythm Walk
                </h3>
                <p className="text-xs text-plum-500">
                  Equivalent to Speed 5.0 km/h • Zero Equipment • Talk-Test Comfort
                </p>
              </div>
            </div>

            {homeWalkSaved && (
              <span className="text-xs text-sageCare-600 font-bold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </span>
            )}
          </div>

          <p className="text-xs text-plum-600 font-sans leading-relaxed">
            Designed specifically to replace your 13-minute treadmill walk while the machine is unavailable. Continuous steady pacing across your living room or corridor at ~115 steps/min with relaxed arm swings burns the same energy with zero joint impact!
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-white p-2.5 rounded-2xl border border-cream-200">
              <span className="text-[10px] font-bold uppercase text-plum-500 block">Duration</span>
              <span className="text-base font-serif font-bold text-plum-900">{homeWalkDuration} mins</span>
              <span className="text-[10px] text-sageCare-600 block font-medium">Matches baseline</span>
            </div>
            <div className="bg-white p-2.5 rounded-2xl border border-cream-200">
              <span className="text-[10px] font-bold uppercase text-plum-500 block">Cadence</span>
              <span className="text-base font-serif font-bold text-plum-900">~115 bpm</span>
              <span className="text-[10px] text-plum-500 block">Brisk room stroll</span>
            </div>
            <div className="bg-white p-2.5 rounded-2xl border border-cream-200">
              <span className="text-[10px] font-bold uppercase text-plum-500 block">Intensity</span>
              <span className="text-base font-serif font-bold text-plum-900">RPE 3–4</span>
              <span className="text-[10px] text-roseDust-600 block font-medium">Can talk easily</span>
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <label className="text-[11px] font-bold text-plum-700 block mb-1.5">
              Select Target Duration for Today:
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {[10, 13, 15, 20].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setHomeWalkDuration(mins)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    homeWalkDuration === mins
                      ? 'bg-plum-900 text-white shadow-xs'
                      : 'bg-white hover:bg-cream-100 text-plum-800 border border-cream-200'
                  }`}
                >
                  {mins} Minutes {mins === 13 && '⭐ (Deep\'s Baseline)'}
                </button>
              ))}
            </div>
          </div>

          {/* Action launcher */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
            <button
              onClick={handleSaveHomeWalkSettings}
              className="w-full sm:w-auto px-4 py-2 bg-cream-200 hover:bg-cream-300 text-plum-800 rounded-xl text-xs font-bold transition-all"
            >
              Save Preferred Walking Baseline
            </button>

            <button
              onClick={() => handleLaunchRoutine({
                ...livingRoomRoutine,
                durationMins: homeWalkDuration
              })}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-roseDust-500 to-roseDust-600 hover:from-roseDust-600 hover:to-roseDust-700 text-white rounded-xl text-xs font-bold shadow-soft transition-all active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch Living Room Walk Session ({homeWalkDuration} mins)</span>
            </button>
          </div>

          {/* Additional Walking Alternative Cards */}
          <div className="pt-3 border-t border-cream-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-plum-500 block mb-2">
              Other Zero-Equipment Home & Outdoor Walk Options:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Step Touch Cardio */}
              <div className="p-3 bg-white rounded-2xl border border-cream-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-plum-900">
                    12-Min Step & Sway Cardio
                  </h4>
                  <p className="text-[11px] text-plum-500">
                    Side-step touches, front reach, easy on knees
                  </p>
                </div>
                <button
                  onClick={() => handleLaunchRoutine(stepCardioRoutine)}
                  className="px-3 py-1.5 bg-plum-100 hover:bg-plum-200 text-plum-900 rounded-xl text-xs font-bold transition-all shrink-0 ml-2"
                >
                  Start
                </button>
              </div>

              {/* Outdoor Stroll */}
              <div className="p-3 bg-white rounded-2xl border border-cream-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-plum-900">
                    15-Min Balcony / Terrace Walk
                  </h4>
                  <p className="text-[11px] text-plum-500">
                    Fresh oxygen, natural light, calm pacing
                  </p>
                </div>
                <button
                  onClick={() => handleLaunchRoutine(outdoorWalkRoutine)}
                  className="px-3 py-1.5 bg-plum-100 hover:bg-plum-200 text-plum-900 rounded-xl text-xs font-bold transition-all shrink-0 ml-2"
                >
                  Start
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode B: Treadmill Customizer Card (Accessible or when machine is ready) */}
      {walkingMode === 'treadmill' && (
        <div className="rounded-3xl bg-gradient-to-br from-cream-50 via-white to-roseDust-50/40 p-5 sm:p-6 border border-roseDust-200 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-roseDust-100 text-roseDust-600 rounded-2xl">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-plum-950">
                  Deep\'s Treadmill Settings (Tried & Tested)
                </h3>
                <p className="text-xs text-plum-500">
                  Speed 5.0 km/h • Incline 2% • 13 Minutes
                </p>
              </div>
            </div>

            {treadmillSaved && (
              <span className="text-xs text-sageCare-600 font-bold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </span>
            )}
          </div>

          <p className="text-xs text-plum-600 mb-4 font-sans leading-relaxed">
            Deep previously completed 13 minutes at speed 5 and incline 2 comfortably. You can customize these baseline values anytime without pressure to increase speed.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-white p-3 rounded-2xl border border-cream-200">
              <label className="text-[11px] font-bold text-plum-600 block mb-1">
                Speed (km/h)
              </label>
              <input
                type="number"
                step="0.5"
                min="2"
                max="10"
                value={treadmillSpeed}
                onChange={(e) => setTreadmillSpeed(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl bg-cream-50 border border-cream-300 text-sm font-bold text-plum-900"
              />
              <span className="text-[10px] text-plum-500 mt-0.5 block">Comfortable brisk pace</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-cream-200">
              <label className="text-[11px] font-bold text-plum-600 block mb-1">
                Incline (%)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="10"
                value={treadmillIncline}
                onChange={(e) => setTreadmillIncline(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl bg-cream-50 border border-cream-300 text-sm font-bold text-plum-900"
              />
              <span className="text-[10px] text-plum-500 mt-0.5 block">Gentle slope, easy on knees</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-cream-200">
              <label className="text-[11px] font-bold text-plum-600 block mb-1">
                Target Duration (mins)
              </label>
              <input
                type="number"
                step="1"
                min="5"
                max="45"
                value={treadmillDuration}
                onChange={(e) => setTreadmillDuration(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl bg-cream-50 border border-cream-300 text-sm font-bold text-plum-900"
              />
              <span className="text-[10px] text-plum-500 mt-0.5 block">Proven comfortable baseline</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <button
              onClick={handleSaveTreadmillSettings}
              className="w-full sm:w-auto px-4 py-2 bg-cream-200 hover:bg-cream-300 text-plum-800 rounded-xl text-xs font-bold transition-all"
            >
              Update Saved Treadmill Baseline
            </button>

            <button
              onClick={() => handleLaunchRoutine(treadmillRoutine)}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-roseDust-500 to-roseDust-600 hover:from-roseDust-600 hover:to-roseDust-700 text-white rounded-xl text-xs font-bold shadow-soft transition-all active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch Treadmill Timer ({treadmillDuration} mins)</span>
            </button>
          </div>
        </div>
      )}

      {/* Perceived Effort / Talk-Test Guide */}
      <div className="p-4 rounded-3xl bg-white border border-cream-300 shadow-soft">
        <div className="flex items-center space-x-2 text-plum-900 mb-2">
          <Gauge className="w-5 h-5 text-roseDust-500" />
          <h4 className="font-serif font-bold text-base">
            The Talk-Test Guide (RPE 1 to 10)
          </h4>
        </div>
        <p className="text-xs text-plum-600 leading-relaxed mb-3">
          We never require heart rate monitors or obsess over calories burned. Use the simple, gold-standard talk test:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 bg-sageCare-50 rounded-2xl border border-sageCare-200">
            <span className="font-bold text-sageCare-900 block">RPE 1–3: Gentle / Easy</span>
            <span className="text-sageCare-700 text-[11px]">Can easily sing or talk continuously. Ideal for Day 1 bleed days and warmups.</span>
          </div>
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <span className="font-bold text-amber-900 block">RPE 3–5: Moderate (Target!)</span>
            <span className="text-amber-800 text-[11px]">Can speak in full sentences comfortably. Deep\'s daily sweet spot for sustainable fat loss.</span>
          </div>
          <div className="p-3 bg-softCoral-50 rounded-2xl border border-softCoral-200">
            <span className="font-bold text-softCoral-900 block">RPE 7+: Heavy / Gasping</span>
            <span className="text-softCoral-800 text-[11px]">Gasping for breath. Not required or encouraged for beginner consistency. Slow down!</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-serif font-bold text-lg text-plum-950">
            Available Routines for Deep
          </h3>
          <span className="text-xs text-plum-500">
            {filteredRoutines.length} routines available
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {[
            { id: 'all', label: 'All Routines' },
            { id: 'alternatives', label: '🏠 Home Walk Alternatives' },
            { id: 'period_care', label: '🌸 Period Care & Rest' },
            { id: 'gentle_strength', label: '🪑 Living Room Strength' },
            { id: 'treadmill', label: '🏃 Treadmill' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-plum-900 text-white shadow-xs'
                  : 'bg-white hover:bg-cream-100 text-plum-700 border border-cream-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Routine Cards List */}
      <div className="space-y-3">
        {filteredRoutines.map((routine) => {
          const isAlternative = routine.id === 'living-room-rhythm-walk' || routine.id === 'indoor-step-touch-cardio' || routine.id === 'outdoor-balcony-walk';
          const isTreadmill = routine.category === 'treadmill';

          return (
            <div
              key={routine.id}
              className={`p-5 rounded-3xl bg-white border transition-all ${
                isAlternative
                  ? 'border-roseDust-200 hover:border-roseDust-400 shadow-soft'
                  : 'border-cream-200 hover:border-cream-300 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h4 className="font-serif font-bold text-plum-950 text-base">
                      {routine.title}
                    </h4>

                    {isAlternative && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sageCare-100 text-sageCare-800 border border-sageCare-200">
                        Zero Equipment Alternative
                      </span>
                    )}

                    {routine.isPeriodDay1Suitable && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-roseDust-100 text-roseDust-700 border border-roseDust-200">
                        Period Day 1 Safe
                      </span>
                    )}

                    {isTreadmill && !isTreadmillAvailable && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        Machine Paused
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-plum-500 font-medium block mt-1">
                    Duration: ~{routine.durationMins} minutes • {routine.rpeEffort}
                  </span>
                </div>

                <button
                  onClick={() => handleLaunchRoutine(routine)}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-plum-900 to-plum-950 hover:from-plum-950 text-white rounded-xl text-xs font-bold shadow-soft transition-all active:scale-95 shrink-0 ml-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start</span>
                </button>
              </div>

              <p className="text-xs text-plum-600 mt-2 font-sans">
                {routine.warmupNotes}
              </p>

              <div className="mt-3 pt-3 border-t border-cream-100 flex flex-wrap items-center gap-2 text-[11px] text-plum-600">
                <span className="font-bold text-plum-800">Exercises:</span>
                {routine.exercises.map((e, idx) => (
                  <span key={idx} className="bg-cream-100 px-2 py-0.5 rounded-md">
                    {e.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Workout Player Modal */}
      {selectedRoutine && (
        <WorkoutPlayer
          routine={selectedRoutine}
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          onComplete={() => {
            alert('Workout successfully saved to Deep\'s journey history! ❤️');
          }}
          onOpenSafetyGuide={onOpenSafetyGuide}
        />
      )}

    </div>
  );
};
