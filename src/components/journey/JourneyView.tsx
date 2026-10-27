import React, { useState } from 'react';
import { 
  Compass, Pause, Play, Sparkles, CheckCircle2, 
  Calendar, Award, MessageSquare, Info, Heart 
} from 'lucide-react';
import { UserProfile, JourneyPhase } from '../../types';
import { JOURNEY_PHASES, getPhaseForDay } from '../../data/phases';
import { db } from '../../db';

interface JourneyViewProps {
  profile: UserProfile;
  onUpdateDay: (newDay: number) => void;
  onTogglePause: () => void;
  onAskAI: (prompt: string) => void;
}

export const JourneyView: React.FC<JourneyViewProps> = ({
  profile,
  onUpdateDay,
  onTogglePause,
  onAskAI
}) => {
  const [selectedDay, setSelectedDay] = useState(profile.currentDay);
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [reflectionEasier, setReflectionEasier] = useState('');
  const [reflectionObstacle, setReflectionObstacle] = useState('');
  const [reflectionChange, setReflectionChange] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const currentPhase = getPhaseForDay(profile.currentDay);
  const viewingPhase = getPhaseForDay(selectedDay);

  const pct = Math.min(100, Math.round((profile.currentDay / profile.journeyLengthDays) * 100));

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    setReflectionSaved(true);
    setTimeout(() => {
      setReflectionSaved(false);
      setShowReflectionModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-24 animate-fadeIn max-w-4xl mx-auto px-4 pt-3">
      
      {/* Overview Card */}
      <div className="rounded-3xl bg-white/95 p-5 sm:p-6 border border-roseDust-200 shadow-soft">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-roseDust-100 text-roseDust-600 rounded-2xl">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-plum-950">
                Your 240-Day Flexible Wellness Journey
              </h2>
              <p className="text-xs sm:text-sm text-plum-500 font-sans">
                Day {profile.currentDay} of 240 • {currentPhase.title.split(':')[0]}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onTogglePause}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center space-x-1.5 ${
                profile.isPaused
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-cream-100 hover:bg-cream-200 text-plum-700 border-cream-200'
              }`}
            >
              {profile.isPaused ? <Play className="w-3.5 h-3.5 fill-amber-700" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{profile.isPaused ? 'Resume Plan' : 'Pause Plan'}</span>
            </button>

            <button
              onClick={() => setShowReflectionModal(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-roseDust-500 to-roseDust-600 text-white rounded-xl text-xs font-bold shadow-soft transition-all active:scale-95 flex items-center space-x-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Weekly Reflection</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs font-bold text-plum-800">
            <span>Overall Journey Completion</span>
            <span>{pct}% ({profile.currentDay} / 240 Days)</span>
          </div>
          <div className="w-full bg-cream-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-roseDust-400 via-roseDust-500 to-softCoral-400 h-3 rounded-full transition-all duration-500 shadow-rose-glow"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Day Selector Slider / Input */}
        <div className="p-3 bg-cream-50 rounded-2xl border border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-plum-900">Jump / Preview Day:</span>
            <input
              type="number"
              min="1"
              max="240"
              value={selectedDay}
              onChange={(e) => {
                const val = Math.max(1, Math.min(240, Number(e.target.value) || 1));
                setSelectedDay(val);
              }}
              className="w-20 px-2 py-1 bg-white border border-cream-300 rounded-lg font-bold text-plum-900 text-center"
            />
          </div>

          <div className="flex items-center space-x-2">
            {selectedDay !== profile.currentDay && (
              <button
                onClick={() => onUpdateDay(selectedDay)}
                className="px-3 py-1 bg-plum-900 text-white rounded-lg font-bold text-[11px] active:scale-95"
              >
                Set as Active Day
              </button>
            )}
            <span className="text-plum-500 text-[11px]">
              {selectedDay === profile.currentDay ? 'Viewing today\'s phase' : `Viewing Phase for Day ${selectedDay}`}
            </span>
          </div>
        </div>
      </div>

      {/* Routine Clinician Reminder */}
      <div className="p-4 rounded-3xl bg-cream-100/80 border border-cream-300 text-xs text-plum-700 flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-roseDust-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Routine Health Check Reminder:</strong> We encourage scheduling a calm, routine check-in with your clinician or gynecologist before major activity changes, especially if you have chronic concerns, unusual symptoms, or have been inactive for a prolonged time.
        </p>
      </div>

      {/* Phase Curriculum Cards */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-plum-950">
          The 6 Compassionate Journey Phases
        </h3>

        {JOURNEY_PHASES.map((phase) => {
          const isCurrent = currentPhase.phaseNumber === phase.phaseNumber;
          const isPassed = profile.currentDay > phase.dayRange[1];

          return (
            <div
              key={phase.phaseNumber}
              className={`p-5 rounded-3xl border transition-all ${
                isCurrent
                  ? 'bg-gradient-to-r from-cream-50 to-roseDust-50/70 border-roseDust-300 shadow-soft ring-1 ring-roseDust-300'
                  : 'bg-white border-cream-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-roseDust-600">
                      Days {phase.dayRange[0]}–{phase.dayRange[1]}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] bg-roseDust-500 text-white font-bold px-2 py-0.5 rounded-full">
                        Current Phase
                      </span>
                    )}
                    {isPassed && (
                      <span className="text-[10px] bg-sageCare-100 text-sageCare-700 font-bold px-2 py-0.5 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-base sm:text-lg text-plum-950 mt-0.5">
                    {phase.title}
                  </h4>
                  <span className="text-xs text-plum-500 font-medium italic block">
                    {phase.tagline}
                  </span>
                </div>
              </div>

              <p className="text-xs text-plum-700 leading-relaxed font-sans mb-3">
                {phase.description}
              </p>

              {/* Focus points */}
              <div className="space-y-1 mb-3 text-xs text-plum-700">
                <span className="font-bold text-plum-900 block text-[11px] uppercase tracking-wider">
                  Key Focus Areas:
                </span>
                {phase.focusAreas.map((f, i) => (
                  <div key={i} className="flex items-start space-x-2 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-roseDust-500 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Mindset Note */}
              <div className="p-2.5 bg-white rounded-xl border border-cream-200 text-xs text-plum-700 flex items-center space-x-2">
                <Heart className="w-3.5 h-3.5 text-roseDust-500 shrink-0" />
                <span className="italic">{phase.mindsetNote}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Reflection Modal */}
      {showReflectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-plum-950/50 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-cream-300">
            <h3 className="font-serif font-bold text-lg text-plum-950 mb-1">
              Weekly Gentle Reflection
            </h3>
            <p className="text-xs text-plum-500 mb-4">
              Celebrating effort, learning, and self-compassion — never just a number.
            </p>

            <form onSubmit={handleSaveReflection} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-plum-900 block mb-1">
                  1. What felt a little easier or more comfortable this week?
                </label>
                <textarea
                  rows={2}
                  value={reflectionEasier}
                  onChange={(e) => setReflectionEasier(e.target.value)}
                  placeholder="e.g., Comfortable 13 mins walk, drank more water, slept earlier..."
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-roseDust-400"
                />
              </div>

              <div>
                <label className="font-bold text-plum-900 block mb-1">
                  2. What got in the way or felt challenging?
                </label>
                <textarea
                  rows={2}
                  value={reflectionObstacle}
                  onChange={(e) => setReflectionObstacle(e.target.value)}
                  placeholder="e.g., Period cramps on Day 1, busy afternoon work..."
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-roseDust-400"
                />
              </div>

              <div>
                <label className="font-bold text-plum-900 block mb-1">
                  3. What do I want to change or keep gentle next week?
                </label>
                <textarea
                  rows={2}
                  value={reflectionChange}
                  onChange={(e) => setReflectionChange(e.target.value)}
                  placeholder="e.g., Keep walking easy, ask partner to chop dinner veggies..."
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl focus:outline-none focus:border-roseDust-400"
                />
              </div>

              {reflectionSaved && (
                <div className="text-sageCare-600 font-bold text-center py-1">
                  Reflection saved with love! ❤️
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReflectionModal(false)}
                  className="flex-1 py-2.5 bg-cream-100 hover:bg-cream-200 text-plum-700 rounded-xl font-bold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-plum-900 hover:bg-plum-950 text-white rounded-xl font-bold"
                >
                  Save Reflection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
