import React from 'react';
import { Activity, Play, ZapOff, Sparkles, Bed, Timer, ShieldCheck, ArrowRight } from 'lucide-react';
import { WorkoutRoutine } from '../../types';

interface WorkoutSnippetCardProps {
  routine: WorkoutRoutine;
  onStartWorkout: (routineId: string) => void;
  onMakeEasier: () => void;
  onRestDay: () => void;
  onOpenMovementTab: () => void;
}

export const WorkoutSnippetCard: React.FC<WorkoutSnippetCardProps> = ({
  routine,
  onStartWorkout,
  onMakeEasier,
  onRestDay,
  onOpenMovementTab
}) => {
  return (
    <div className="rounded-3xl bg-white/90 p-5 sm:p-6 border border-cream-300 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-lavenderSoft-100 text-lavenderSoft-500 rounded-2xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-plum-950">
              Today\'s Movement Plan for Deep
            </h3>
            <p className="text-xs text-plum-500">
              Gentle home movement • Comfort first
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-lavenderSoft-50 text-lavenderSoft-500 border border-lavenderSoft-200">
          {routine.durationMins} Mins
        </span>
      </div>

      {/* Routine Detail Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cream-50 to-roseDust-50/40 border border-cream-200 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-1.5 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-plum-500">
                Suggested Routine
              </span>
              {(routine.id === 'living-room-rhythm-walk' || routine.id === 'indoor-step-touch-cardio' || routine.id === 'outdoor-balcony-walk') && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sageCare-100 text-sageCare-800 border border-sageCare-200">
                  🏠 Treadmill Alternative
                </span>
              )}
            </div>
            <h4 className="font-bold text-plum-900 text-sm sm:text-base mt-0.5">
              {routine.title}
            </h4>
          </div>
          <div className="flex items-center space-x-1 text-xs text-plum-500 shrink-0 ml-2">
            <Timer className="w-4 h-4 text-roseDust-500" />
            <span>{routine.durationMins}m</span>
          </div>
        </div>

        <p className="text-xs text-plum-600 mt-2 font-sans">
          {routine.warmupNotes}
        </p>

        <div className="mt-3 flex items-center space-x-2 text-xs text-plum-700 bg-white/80 p-2.5 rounded-xl border border-cream-200">
          <span className="font-bold text-plum-900">Effort Scale:</span>
          <span>{routine.rpeEffort}</span>
        </div>
      </div>

      {/* Exercise items preview */}
      <div className="space-y-2 mb-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-plum-500">
          Includes:
        </div>
        {routine.exercises.slice(0, 3).map((ex, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs text-plum-700 py-1 border-b border-cream-100 last:border-0">
            <span className="font-medium">• {ex.name}</span>
            <span className="text-plum-400 text-[11px]">{ex.durationOrReps}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <button
          onClick={() => onStartWorkout(routine.id)}
          className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-plum-900 to-plum-950 hover:from-plum-950 hover:to-black text-white rounded-2xl text-xs sm:text-sm font-semibold shadow-soft hover:shadow-md transition-all active:scale-98"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Start Workout Session</span>
        </button>

        <button
          onClick={onMakeEasier}
          className="flex items-center justify-center space-x-1.5 py-3 px-3 bg-cream-100 hover:bg-cream-200 text-plum-800 rounded-2xl text-xs font-semibold border border-cream-300 transition-all active:scale-98"
          title="Switch to lighter 7-min movement"
        >
          <Sparkles className="w-3.5 h-3.5 text-lavenderSoft-400" />
          <span>Make it easier</span>
        </button>

        <button
          onClick={onRestDay}
          className="flex items-center justify-center space-x-1.5 py-3 px-3 bg-white hover:bg-roseDust-50 text-roseDust-600 rounded-2xl text-xs font-semibold border border-roseDust-200 transition-all active:scale-98"
          title="Mark today as a rest day"
        >
          <Bed className="w-3.5 h-3.5" />
          <span>Rest Day</span>
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-plum-500">
        <span className="flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-sageCare-500" />
          <span>Talk-test friendly: Always comfortable</span>
        </span>
        <button
          onClick={onOpenMovementTab}
          className="text-roseDust-600 font-bold hover:underline flex items-center space-x-1"
        >
          <span>All Routines</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
