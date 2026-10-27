import React, { useState, useEffect } from 'react';
import { 
  X, Play, Pause, RotateCcw, CheckCircle2, 
  ChevronRight, ChevronLeft, ShieldAlert, Heart, Volume2 
} from 'lucide-react';
import { WorkoutRoutine, ExerciseItem } from '../../types';
import { db } from '../../db';
import { getLocalDateString } from '../../utils/dateUtils';
import confetti from 'canvas-confetti';

interface WorkoutPlayerProps {
  routine: WorkoutRoutine;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onOpenSafetyGuide: () => void;
}

export const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({
  routine,
  isOpen,
  onClose,
  onComplete,
  onOpenSafetyGuide
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(120); // 2 mins per exercise default
  const [isActive, setIsActive] = useState(false);
  const [showChairOption, setShowChairOption] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentExercise: ExerciseItem = routine.exercises[currentIdx] || routine.exercises[0];

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      // Auto advance or complete
      if (currentIdx < routine.exercises.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setSecondsLeft(120);
      } else {
        setIsActive(false);
        setIsFinished(true);
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, currentIdx, routine.exercises.length]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleFinish = async () => {
    await db.activityLogs.add({
      date: getLocalDateString(),
      title: routine.title,
      durationMins: routine.durationMins,
      perceivedEffortRpe: 3,
      isTreadmill: routine.category === 'treadmill',
      treadmillSpeed: routine.category === 'treadmill' ? 5.0 : undefined,
      treadmillIncline: routine.category === 'treadmill' ? 2.0 : undefined,
      feeling: 'comfortable',
      notes: 'Completed session with comfort and patience.'
    });

    onComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-plum-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-cream-50 rounded-3xl p-6 shadow-2xl border border-cream-300 flex flex-col max-h-[92vh] overflow-y-auto">
        
        {/* Top bar */}
        <div className="flex items-center justify-between pb-3 border-b border-cream-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-roseDust-600">
              Active Movement Session
            </span>
            <h3 className="font-serif font-bold text-base text-plum-950">
              {routine.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-plum-400 hover:text-plum-900 rounded-full hover:bg-cream-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Urgent symptom stop warning */}
        <div className="my-3 p-2.5 bg-softCoral-50 rounded-xl border border-softCoral-200 flex items-center justify-between text-xs text-softCoral-800">
          <div className="flex items-center space-x-1.5 font-medium">
            <ShieldAlert className="w-4 h-4 text-softCoral-600 shrink-0" />
            <span>Stop if dizzy, chest pain, or breathlessness occurs.</span>
          </div>
          <button
            onClick={onOpenSafetyGuide}
            className="underline font-bold text-[11px] shrink-0 ml-2"
          >
            Safety Guide
          </button>
        </div>

        {!isFinished ? (
          <div className="space-y-4 my-auto">
            {/* Step Counter */}
            <div className="flex items-center justify-between text-xs text-plum-500 font-semibold">
              <span>Exercise {currentIdx + 1} of {routine.exercises.length}</span>
              <span>{currentExercise.durationOrReps}</span>
            </div>

            {/* Exercise Card */}
            <div className="p-5 rounded-3xl bg-white border border-roseDust-200 shadow-soft text-center">
              <h2 className="font-serif font-bold text-lg sm:text-xl text-plum-950 mb-2">
                {currentExercise.name}
              </h2>

              <p className="text-xs sm:text-sm text-plum-700 font-sans leading-relaxed mb-4">
                {showChairOption ? currentExercise.chairModifiedOption : currentExercise.demonstrationNotes}
              </p>

              {/* Timer circle display */}
              <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-tr from-roseDust-50 to-lavenderSoft-100 border-4 border-roseDust-300 flex flex-col items-center justify-center shadow-inner my-2">
                <span className="font-serif font-bold text-2xl text-plum-950">
                  {formatTime(secondsLeft)}
                </span>
                <span className="text-[10px] text-plum-500 uppercase tracking-widest font-semibold">
                  Remaining
                </span>
              </div>

              {/* Safety tip for exercise */}
              <div className="p-2.5 bg-cream-50 rounded-xl text-[11px] text-plum-600 border border-cream-200 mt-2">
                💡 <span className="font-bold">Form cue:</span> {currentExercise.safetyCheck}
              </div>
            </div>

            {/* Chair modification toggle */}
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setShowChairOption(!showChairOption)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  showChairOption
                    ? 'bg-plum-900 text-white border-plum-900 shadow-xs'
                    : 'bg-white text-plum-700 border-cream-300 hover:bg-cream-100'
                }`}
              >
                {showChairOption ? '✓ Showing Chair-Supported Version' : 'Show Chair-Supported Version'}
              </button>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => {
                  if (currentIdx > 0) {
                    setCurrentIdx(prev => prev - 1);
                    setSecondsLeft(120);
                  }
                }}
                disabled={currentIdx === 0}
                className="p-3 rounded-2xl bg-white text-plum-700 border border-cream-300 disabled:opacity-30 hover:bg-cream-100 transition-all active:scale-95"
                title="Previous exercise"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsActive(!isActive)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-roseDust-500 to-roseDust-600 hover:from-roseDust-600 hover:to-roseDust-700 text-white font-bold text-sm shadow-soft transition-all active:scale-95 flex items-center space-x-2"
              >
                {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                <span>{isActive ? 'Pause' : 'Start Timer'}</span>
              </button>

              <button
                onClick={() => {
                  if (currentIdx < routine.exercises.length - 1) {
                    setCurrentIdx(prev => prev + 1);
                    setSecondsLeft(120);
                  } else {
                    setIsFinished(true);
                  }
                }}
                className="p-3 rounded-2xl bg-white text-plum-700 border border-cream-300 hover:bg-cream-100 transition-all active:scale-95"
                title="Next exercise"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-sageCare-100 text-sageCare-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-2xl text-plum-950 mb-1">
                Beautifully Done, My Love! ❤️
              </h3>
              <p className="text-xs sm:text-sm text-plum-600 font-sans max-w-sm mx-auto leading-relaxed">
                You moved with care, patience, and comfort today. That is what true consistency looks like.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-cream-200 text-xs text-plum-700 max-w-sm mx-auto">
              <span className="font-bold text-plum-900 block mb-1">Cooldown Advice:</span>
              <span>{routine.cooldownNotes}</span>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3.5 bg-gradient-to-r from-plum-900 to-plum-950 text-white rounded-2xl font-bold text-sm shadow-soft hover:shadow-md transition-all active:scale-95"
            >
              Save Session & Celebrate Win
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
