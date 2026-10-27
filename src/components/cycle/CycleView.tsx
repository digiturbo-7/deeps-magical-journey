import React, { useState, useEffect } from 'react';
import { 
  Flower2, Calendar, ShieldCheck, Heart, Sparkles, 
  AlertCircle, Bed, Droplet, Plus, Check, Trash2 
} from 'lucide-react';
import { MenstrualLog, UserProfile } from '../../types';
import { db } from '../../db';
import { getLocalDateString, calculateCycleDay, formatDisplayDate } from '../../utils/dateUtils';

interface CycleViewProps {
  profile: UserProfile;
  onStartRoutine: (routineId: string) => void;
  onAskAI: (prompt: string) => void;
  todayStr?: string;
  formattedDate?: string;
}

export const CycleView: React.FC<CycleViewProps> = ({
  profile,
  onStartRoutine,
  onAskAI,
  todayStr,
  formattedDate
}) => {
  const effectiveTodayStr = todayStr || getLocalDateString();
  const effectiveFormattedDate = formattedDate || formatDisplayDate(effectiveTodayStr);
  const currentCycleDay = calculateCycleDay(
    profile.menstrualStartDate || '2026-10-24',
    effectiveTodayStr,
    profile.cycleLengthDays || 28
  );
  const [logs, setLogs] = useState<MenstrualLog[]>([]);
  const [isDay1Confirmed, setIsDay1Confirmed] = useState(profile.menstrualConfirmedDay1);
  const [flow, setFlow] = useState<'light' | 'medium' | 'heavy' | 'spotting'>('medium');
  const [crampsLevel, setCrampsLevel] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [bloatingLevel, setBloatingLevel] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [symptoms, setSymptoms] = useState<string[]>(['Mild lower abdomen cramps', 'Bloating']);
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadCycleLogs();
  }, []);

  const loadCycleLogs = async () => {
    const list = await db.menstrualLogs.toArray();
    setLogs(list);
  };

  const handleToggleSymptom = (sym: string) => {
    setSymptoms(prev => 
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
  };

  const handleSaveLog = async (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: MenstrualLog = {
      date: effectiveTodayStr,
      isPeriodDay: currentCycleDay <= 5,
      dayOfCycle: currentCycleDay,
      flow,
      crampsLevel,
      bloatingLevel,
      symptoms,
      notes
    };
    await db.menstrualLogs.add(newLog);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    loadCycleLogs();
  };

  return (
    <div className="space-y-6 pb-24 animate-fadeIn max-w-4xl mx-auto px-4 pt-3">
      
      {/* Header */}
      <div className="rounded-3xl bg-white/90 p-5 sm:p-6 border border-roseDust-200 shadow-soft">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-roseDust-100 text-roseDust-600 rounded-2xl">
              <Flower2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-plum-950">
                Cycle & Comfort Care
              </h2>
              <p className="text-xs sm:text-sm text-plum-500 font-sans">
                Gentle tracking • Zero pressure • Private by default
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-cream-100 rounded-xl text-xs font-semibold text-plum-700 border border-cream-200">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Partner Access: OFF (Strictly Private)</span>
          </div>
        </div>

        <p className="text-xs text-plum-600 font-sans leading-relaxed">
          Cycle predictions are respectful estimates, not medical guarantees. Your body’s energy fluctuates naturally with hormonal shifts — rest is always an honored choice.
        </p>
      </div>

      {/* Dynamic Cycle Day Focus Protocol */}
      <div className="rounded-3xl bg-gradient-to-br from-roseDust-100 via-white to-lavenderSoft-100 p-5 sm:p-6 border border-roseDust-300 shadow-soft">
        <div className="flex items-center space-x-2 text-roseDust-700 mb-2 font-bold text-xs uppercase">
          <Sparkles className="w-4 h-4" />
          <span>TODAY’S FOCUS: CYCLE DAY {currentCycleDay} ({effectiveFormattedDate.toUpperCase()})</span>
        </div>

        <h3 className="font-serif font-bold text-lg sm:text-xl text-plum-950 leading-snug mb-3">
          {currentCycleDay === 1
            ? "“You don’t have to push yourself today. Your body deserves care, patience and rest. Choose what feels comfortable — even resting is a valid choice. ❤️”"
            : currentCycleDay === 2
            ? "“Take it gently today. If cramps or fatigue linger, prioritize restorative pacing, gentle sips of warm water, and plenty of rest. ❤️”"
            : "“Honor your body's natural energy rhythm today. Rest when you feel tired, hydrate with care, and move only as feels joyful. ❤️”"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-xs text-plum-800">
          <div className="p-3.5 bg-white/90 rounded-2xl border border-roseDust-200 space-y-1.5">
            <span className="font-bold text-roseDust-800 block text-xs">
              Cycle Day {currentCycleDay} Movement Menu:
            </span>
            <div>• 3–8 minutes of calm, slow indoor walking or gentle rest</div>
            <div>• Gentle shoulder and upper back rolls</div>
            <div>• Standing or seated gentle side reaches</div>
            <div>• Cat-cow or seated spinal releases</div>
            <div>• Diaphragmatic relaxed belly breathing</div>
            <div className="text-[11px] text-plum-500 italic mt-1">
              Adjustable down to zero if cramping is active.
            </div>
          </div>

          <div className="p-3.5 bg-white/90 rounded-2xl border border-roseDust-200 space-y-1.5">
            <span className="font-bold text-roseDust-800 block text-xs">
              Comfort & Nutrition for Cycle Day {currentCycleDay}:
            </span>
            <div>• Warm hot water pack on lower belly if cramping</div>
            <div>• Tender coconut water (rich in electrolytes)</div>
            <div>• Iron-nourishing warm dal or chicken soup</div>
            <div>• Loose cotton clothing and comfortable slippers</div>
            <div>• Probiotic curd to ease digestion</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <button
            onClick={() => onStartRoutine(currentCycleDay === 2 ? 'day-2-period-gentle-flow' : 'day-1-period-comfort')}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-roseDust-500 to-roseDust-600 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-soft hover:shadow-md transition-all active:scale-95"
          >
            Launch Day {currentCycleDay <= 2 ? currentCycleDay : 'Gentle'} Comfort Sequence
          </button>

          <button
            onClick={() => onAskAI('My cramps are bad today. What should I do?')}
            className="w-full sm:w-auto px-4 py-2.5 bg-white text-roseDust-700 rounded-2xl text-xs sm:text-sm font-bold border border-roseDust-300 hover:bg-roseDust-50 transition-all active:scale-95 flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-roseDust-500" />
            <span>Ask Rosy for Cramp Comfort</span>
          </button>
        </div>
      </div>

      {/* Next Day Preview Protocol */}
      <div className="rounded-3xl bg-white/90 p-4 sm:p-5 border border-cream-300 shadow-soft">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-plum-900 flex items-center space-x-1.5">
            <Calendar className="w-4 h-4 text-plum-500" />
            <span>Looking Ahead: Cycle Day {currentCycleDay >= (profile.cycleLengthDays || 28) ? 1 : currentCycleDay + 1} Protocol (Tomorrow)</span>
          </span>
          <span className="text-[11px] bg-cream-100 text-plum-600 px-2 py-0.5 rounded-full font-semibold">
            Planned
          </span>
        </div>
        <p className="text-xs text-plum-600 leading-relaxed font-sans">
          If comfortable tomorrow: 5–10 minutes easy walking, 3–5 minutes gentle mobility. Optional 15–20 minute stroll if energy is lifted and symptoms are mild. If symptoms feel heavy, return to pure rest.
        </p>
      </div>

      {/* Daily Symptom & Flow Logger Form */}
      <div className="rounded-3xl bg-white/95 p-5 sm:p-6 border border-cream-300 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif font-bold text-base sm:text-lg text-plum-950">
            Log Today’s Symptoms & Comfort Level
          </h3>
          {savedSuccess && (
            <span className="text-xs text-sageCare-600 font-bold flex items-center space-x-1">
              <Check className="w-3.5 h-3.5" />
              <span>Saved!</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveLog} className="space-y-4">
          {/* Flow selector */}
          <div>
            <label className="text-xs font-bold text-plum-800 block mb-1.5">
              Bleeding Flow
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'spotting', label: 'Spotting' },
                { id: 'light', label: 'Light' },
                { id: 'medium', label: 'Medium' },
                { id: 'heavy', label: 'Heavy' },
              ].map((f) => (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => setFlow(f.id as any)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    flow === f.id
                      ? 'bg-roseDust-500 text-white shadow-soft'
                      : 'bg-cream-100 hover:bg-cream-200 text-plum-700 border border-cream-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cramp Intensity */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-plum-800">
                Cramps & Discomfort Level: {crampsLevel} / 5
              </label>
              <span className="text-[11px] text-plum-500">
                {crampsLevel === 1 && 'Barely noticeable'}
                {crampsLevel === 2 && 'Mild ache'}
                {crampsLevel === 3 && 'Noticeable cramps'}
                {crampsLevel === 4 && 'Strong discomfort, need rest'}
                {crampsLevel === 5 && 'Severe pain'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setCrampsLevel(lvl as any)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    crampsLevel === lvl
                      ? 'bg-roseDust-500 text-white shadow-2xs'
                      : 'bg-cream-100 hover:bg-cream-200 text-plum-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Common Symptoms Checklist */}
          <div>
            <label className="text-xs font-bold text-plum-800 block mb-1.5">
              Check Any Experiencing:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Mild lower abdomen cramps',
                'Bloating',
                'Tender breasts',
                'Lower back ache',
                'Fatigue / Sleepiness',
                'Headache',
                'Food cravings',
                'Emotional tenderness'
              ].map((sym) => {
                const isChecked = symptoms.includes(sym);
                return (
                  <button
                    type="button"
                    key={sym}
                    onClick={() => handleToggleSymptom(sym)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isChecked
                        ? 'bg-roseDust-100 text-roseDust-800 border border-roseDust-300 font-semibold'
                        : 'bg-cream-100 hover:bg-cream-200 text-plum-700 border border-cream-200'
                    }`}
                  >
                    {isChecked ? '✓ ' : '+ '}{sym}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-plum-800 block mb-1">
              Personal Notes & Sensations
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Felt much better after warm tea and ginger..."
              className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs text-plum-900 focus:outline-none focus:border-roseDust-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-plum-900 hover:bg-plum-950 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-soft transition-all active:scale-95"
          >
            Save Cycle Log
          </button>
        </form>
      </div>

      {/* Clinical Care Reminder Box */}
      <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
        <div className="flex items-center space-x-2 font-bold text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>When to Consult a Qualified Doctor:</span>
        </div>
        <p className="leading-relaxed">
          Severe or worsening menstrual pain not relieved by simple measures, fainting, unusually heavy bleeding (soaking multiple pads in an hour), or symptoms that severely disrupt daily life warrant prompt medical evaluation by your gynecologist or physician.
        </p>
      </div>

    </div>
  );
};
