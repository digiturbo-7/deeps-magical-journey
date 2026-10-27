import React, { useState, useEffect } from 'react';
import { 
  Smile, Wind, Moon, BookHeart, Heart, Sparkles, 
  Play, Pause, RotateCcw, Check, Phone, ShieldCheck 
} from 'lucide-react';
import { db } from '../../db';
import { getLocalDateString } from '../../utils/dateUtils';

export const MindView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'breathe' | 'journal' | 'sleep' | 'crisis'>('breathe');

  // Breathing state
  const [breathePattern, setBreathePattern] = useState<'box' | 'relax' | 'belly'>('box');
  const [isBreatheActive, setIsBreatheActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathTimer, setBreathTimer] = useState(4);

  // Journal state
  const [journalPrompt, setJournalPrompt] = useState('What is one small kindness you showed yourself today?');
  const [journalText, setJournalText] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);

  // Breathing interval loop
  useEffect(() => {
    let timer: any = null;
    if (isBreatheActive) {
      timer = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            // Transition phase
            if (breathePattern === 'box') {
              if (breathPhase === 'Inhale') { setBreathPhase('Hold'); return 4; }
              if (breathPhase === 'Hold') { setBreathPhase('Exhale'); return 4; }
              if (breathPhase === 'Exhale') { setBreathPhase('Rest'); return 4; }
              if (breathPhase === 'Rest') { setBreathPhase('Inhale'); return 4; }
            } else if (breathePattern === 'relax') { // 4-7-8
              if (breathPhase === 'Inhale') { setBreathPhase('Hold'); return 7; }
              if (breathPhase === 'Hold') { setBreathPhase('Exhale'); return 8; }
              if (breathPhase === 'Exhale') { setBreathPhase('Inhale'); return 4; }
            } else { // belly 5-5
              if (breathPhase === 'Inhale') { setBreathPhase('Exhale'); return 5; }
              if (breathPhase === 'Exhale') { setBreathPhase('Inhale'); return 5; }
            }
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreatheActive, breathPhase, breathePattern]);

  const handleSaveJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalText.trim()) return;

    await db.moodLogs.add({
      date: getLocalDateString(),
      moodEmoji: '🌸',
      moodLabel: 'Reflective',
      energyRating: 3,
      stressRating: 2,
      gratitudeNote: journalText,
      reflection: journalPrompt
    });

    setJournalSaved(true);
    setTimeout(() => setJournalSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-24 animate-fadeIn max-w-4xl mx-auto px-4 pt-3">
      
      {/* Header */}
      <div className="rounded-3xl bg-white/95 p-5 sm:p-6 border border-lavenderSoft-300 shadow-soft">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2.5 bg-lavenderSoft-100 text-lavenderSoft-500 rounded-2xl">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-plum-950">
              Mind, Mood & Emotional Peace
            </h2>
            <p className="text-xs sm:text-sm text-plum-500 font-sans">
              Gentle breathing • Self-compassion journaling • Sleep wind-down
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex space-x-1.5 p-1 bg-cream-100 rounded-2xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('breathe')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'breathe' ? 'bg-white text-plum-900 shadow-sm' : 'text-plum-600'
            }`}
          >
            Breathing Pacer
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'journal' ? 'bg-white text-plum-900 shadow-sm' : 'text-plum-600'
            }`}
          >
            Gratitude Journal
          </button>
          <button
            onClick={() => setActiveTab('sleep')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'sleep' ? 'bg-white text-plum-900 shadow-sm' : 'text-plum-600'
            }`}
          >
            Sleep Wind-Down
          </button>
          <button
            onClick={() => setActiveTab('crisis')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'crisis' ? 'bg-white text-plum-900 shadow-sm' : 'text-plum-600'
            }`}
          >
            Support Lines
          </button>
        </div>
      </div>

      {/* Tab: Breathing Pacer */}
      {activeTab === 'breathe' && (
        <div className="rounded-3xl bg-white/95 p-6 border border-cream-300 shadow-soft text-center space-y-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-plum-950">
              Guided Nervous-System Reset
            </h3>
            <p className="text-xs text-plum-500">
              Lowers stress hormones, relaxes lower pelvic muscles, and calms racing thoughts.
            </p>
          </div>

          {/* Pattern selector */}
          <div className="flex justify-center space-x-2">
            {[
              { id: 'box', label: 'Box Breathing (4-4-4-4)', desc: 'Grounding' },
              { id: 'relax', label: '4-7-8 Sleep Breath', desc: 'Deep Calm' },
              { id: 'belly', label: 'Belly Breath (5-5)', desc: 'Cramp Relief' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setBreathePattern(p.id as any);
                  setIsBreatheActive(false);
                  setBreathPhase('Inhale');
                  setBreathTimer(4);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  breathePattern === p.id
                    ? 'bg-plum-900 text-white shadow-2xs'
                    : 'bg-cream-100 hover:bg-cream-200 text-plum-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Animated Circle */}
          <div className="py-6">
            <div className={`relative w-48 h-48 mx-auto rounded-full bg-gradient-to-tr from-roseDust-200 via-lavenderSoft-200 to-cream-100 border-8 border-white shadow-xl flex flex-col items-center justify-center transition-all duration-1000 ${
              isBreatheActive && (breathPhase === 'Inhale' || breathPhase === 'Hold') ? 'scale-110' : 'scale-90'
            }`}>
              <span className="text-xs font-bold uppercase tracking-widest text-plum-600 mb-1">
                {isBreatheActive ? breathPhase : 'Ready'}
              </span>
              <span className="font-serif font-bold text-4xl text-plum-950">
                {isBreatheActive ? breathTimer : 'Breathe'}
              </span>
              <span className="text-[10px] text-plum-500 mt-1">
                {isBreatheActive ? (breathPhase === 'Inhale' ? 'Fill gently' : breathPhase === 'Hold' ? 'Rest gently' : 'Let go softly') : 'Tap start below'}
              </span>
            </div>
          </div>

          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setIsBreatheActive(!isBreatheActive)}
              className="px-6 py-3 bg-gradient-to-r from-roseDust-500 to-roseDust-600 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-soft hover:shadow-md transition-all active:scale-95 flex items-center space-x-2"
            >
              {isBreatheActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isBreatheActive ? 'Pause Guide' : 'Begin Breathing'}</span>
            </button>

            <button
              onClick={() => {
                setIsBreatheActive(false);
                setBreathPhase('Inhale');
                setBreathTimer(4);
              }}
              className="p-3 bg-cream-100 text-plum-700 hover:bg-cream-200 rounded-2xl transition-all"
              title="Reset timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab: Gratitude Journal */}
      {activeTab === 'journal' && (
        <div className="rounded-3xl bg-white/95 p-5 sm:p-6 border border-cream-300 shadow-soft space-y-4">
          <div className="flex items-center space-x-2 text-roseDust-600">
            <BookHeart className="w-5 h-5" />
            <h3 className="font-serif font-bold text-base sm:text-lg text-plum-950">
              Gentle Self-Compassion Journal
            </h3>
          </div>

          <p className="text-xs text-plum-600 leading-relaxed font-sans">
            Writing your thoughts without judgment untangles mental stress and reinforces self-trust.
          </p>

          <form onSubmit={handleSaveJournal} className="space-y-3">
            <div className="p-3 bg-cream-50 rounded-2xl border border-cream-200 text-xs">
              <span className="font-bold text-plum-900 block mb-1">Today\'s Reflection Prompt:</span>
              <p className="text-plum-700 italic">“{journalPrompt}”</p>
            </div>

            <textarea
              rows={4}
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Write freely here... Even two sentences about your day or a warm cup of tea count."
              className="w-full p-3.5 bg-white border border-cream-300 rounded-2xl text-xs sm:text-sm text-plum-900 focus:outline-none focus:border-roseDust-400 shadow-2xs font-sans"
            />

            {journalSaved && (
              <div className="p-2 bg-sageCare-100 text-sageCare-700 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5">
                <Check className="w-4 h-4 text-sageCare-600" />
                <span>Journal entry saved peacefully! ❤️</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!journalText.trim()}
              className="w-full py-3 bg-plum-900 hover:bg-plum-950 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-soft transition-all active:scale-95 disabled:opacity-40"
            >
              Save to Private Journal
            </button>
          </form>
        </div>
      )}

      {/* Tab: Sleep Wind-Down */}
      {activeTab === 'sleep' && (
        <div className="rounded-3xl bg-white/95 p-5 sm:p-6 border border-cream-300 shadow-soft space-y-4">
          <div className="flex items-center space-x-2 text-plum-900">
            <Moon className="w-5 h-5 text-lavenderSoft-500" />
            <h3 className="font-serif font-bold text-base sm:text-lg">
              Cozy Night-Time Sleep Wind-Down
            </h3>
          </div>

          <p className="text-xs text-plum-600 leading-relaxed font-sans">
            High quality sleep balances hunger hormones (ghrelin and leptin), eases inflammation, and restores emotional energy for tomorrow.
          </p>

          <div className="space-y-2.5 text-xs text-plum-800">
            <div className="p-3 bg-cream-50 rounded-2xl border border-cream-200 flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-lavenderSoft-200 text-lavenderSoft-800 font-bold flex items-center justify-center shrink-0">1</span>
              <div>
                <strong className="block text-plum-950">Dim the Bright Overhead Lights (9:30 PM)</strong>
                <span className="text-plum-600">Switch to warm bedside lamps to signal natural melatonin release.</span>
              </div>
            </div>

            <div className="p-3 bg-cream-50 rounded-2xl border border-cream-200 flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-lavenderSoft-200 text-lavenderSoft-800 font-bold flex items-center justify-center shrink-0">2</span>
              <div>
                <strong className="block text-plum-950">Sip Warm Fluid</strong>
                <span className="text-plum-600">A warm cup of ginger water or chamomile tea soothes the nervous system.</span>
              </div>
            </div>

            <div className="p-3 bg-cream-50 rounded-2xl border border-cream-200 flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-lavenderSoft-200 text-lavenderSoft-800 font-bold flex items-center justify-center shrink-0">3</span>
              <div>
                <strong className="block text-plum-950">Phone to Night Shift / Bedside Table</strong>
                <span className="text-plum-600">Set alarms and let your eyes rest from endless scrolling.</span>
              </div>
            </div>

            <div className="p-3 bg-cream-50 rounded-2xl border border-cream-200 flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-lavenderSoft-200 text-lavenderSoft-800 font-bold flex items-center justify-center shrink-0">4</span>
              <div>
                <strong className="block text-plum-950">3 Minutes of Slow Exhales</strong>
                <span className="text-plum-600">Lie down, place hands on belly, and take slow, unhurried breaths.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Crisis Support Lines */}
      {activeTab === 'crisis' && (
        <div className="rounded-3xl bg-white/95 p-5 sm:p-6 border border-cream-300 shadow-soft space-y-4">
          <div className="flex items-center space-x-2 text-roseDust-600">
            <Heart className="w-5 h-5 fill-roseDust-500" />
            <h3 className="font-serif font-bold text-base sm:text-lg text-plum-950">
              Emotional Support & Emergency Guidance
            </h3>
          </div>

          <p className="text-xs text-plum-700 leading-relaxed font-sans">
            If you ever feel overwhelmed, deeply anxious, or in emotional distress, please know that you are not alone. Kind, confidential human support is available 24/7.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200">
              <strong className="block font-bold text-plum-900">Tele-MANAS (Govt of India)</strong>
              <span className="text-plum-600 block text-[11px] mb-1">Free 24/7 National Mental Health Helpline</span>
              <a href="tel:14416" className="text-roseDust-600 font-bold text-sm hover:underline">
                📞 14416 / 1800-891-4416
              </a>
            </div>

            <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200">
              <strong className="block font-bold text-plum-900">Vandrevala Foundation</strong>
              <span className="text-plum-600 block text-[11px] mb-1">24/7 Free Mental Health & Crisis Counselling</span>
              <a href="tel:9999666555" className="text-roseDust-600 font-bold text-sm hover:underline">
                📞 9999 666 555
              </a>
            </div>

            <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200">
              <strong className="block font-bold text-plum-900">KIRAN Helpline</strong>
              <span className="text-plum-600 block text-[11px] mb-1">Ministry of Social Justice Mental Health Helpline</span>
              <a href="tel:18005990019" className="text-roseDust-600 font-bold text-sm hover:underline">
                📞 1800-599-0019
              </a>
            </div>

            <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200">
              <strong className="block font-bold text-plum-900">AASRA Support</strong>
              <span className="text-plum-600 block text-[11px] mb-1">Crisis Prevention & Active Listening</span>
              <a href="tel:919820466726" className="text-roseDust-600 font-bold text-sm hover:underline">
                📞 91-9820466726
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Encouragement Quote Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-roseDust-50 to-cream-50 border border-roseDust-200 text-center space-y-1">
        <Heart className="w-5 h-5 text-roseDust-500 fill-roseDust-400 mx-auto mb-1" />
        <h4 className="font-serif font-bold text-plum-950 text-sm sm:text-base">
          “One difficult day does not erase your progress.”
        </h4>
        <p className="text-xs text-plum-600 font-sans">
          You are building a lifelong foundation of self-care, not passing a test. Be gentle with yourself.
        </p>
      </div>

    </div>
  );
};
