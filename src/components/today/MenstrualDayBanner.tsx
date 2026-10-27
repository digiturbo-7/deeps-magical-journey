import React, { useState } from 'react';
import { Heart, Sparkles, Bed, Flower2, ChevronRight, Check } from 'lucide-react';

interface MenstrualDayBannerProps {
  onStartRoutine: (routineId: string) => void;
  onSetRestDay: () => void;
  cycleDay?: number;
  formattedDate?: string;
}

export const MenstrualDayBanner: React.FC<MenstrualDayBannerProps> = ({
  onStartRoutine,
  onSetRestDay,
  cycleDay = 1,
  formattedDate
}) => {
  const [restMarked, setRestMarked] = useState(false);

  const handleRestClick = () => {
    setRestMarked(true);
    onSetRestDay();
  };

  const isDay2 = cycleDay === 2;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-roseDust-100/90 via-cream-100 to-lavenderSoft-100/70 p-5 sm:p-6 border border-roseDust-200 shadow-soft">
      <div className="absolute top-0 right-0 w-36 h-36 bg-roseDust-300/20 rounded-full blur-2xl pointer-events-none" />

      {/* Badge */}
      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/90 text-roseDust-700 text-xs font-bold border border-roseDust-200 mb-3 shadow-2xs">
        <Flower2 className="w-3.5 h-3.5 text-roseDust-500 animate-pulse" />
        <span>Cycle Day {cycleDay} • Menstrual Comfort & Rest</span>
      </div>

      {/* Main Quote from Spec */}
      <h3 className="font-serif font-bold text-lg sm:text-xl text-plum-950 leading-snug mb-2">
        “You don’t have to push yourself today. Your body deserves care, patience and rest. Choose what feels comfortable — even resting is a valid choice. ❤️”
      </h3>

      <p className="text-xs sm:text-sm text-plum-700 mb-4 leading-relaxed font-sans">
        Today is about honoring your bleed day. We have tailored a gentle 10–15 minute restorative sequence (slow walking, shoulder rolls, standing side stretch, cat-cow & relaxed belly breathing) — or you can choose 100% peaceful rest with zero guilt.
      </p>

      {/* Routine Quick List */}
      <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3.5 border border-roseDust-200/70 mb-4 text-xs space-y-1.5 text-plum-800">
        <div className="font-bold text-roseDust-800 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-roseDust-500" />
          <span>Gentle Care Options for Today:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-plum-700">
          <div>• 3–5 minutes easy indoor stroll</div>
          <div>• Gentle shoulder & neck rolls</div>
          <div>• Seated or standing side reaches</div>
          <div>• Cat-cow or seated spinal waves</div>
          <div>• Relaxed belly breathing & warm pack</div>
          <div>• Optional rest whenever needed</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <button
          onClick={() => onStartRoutine(isDay2 ? 'day-2-period-gentle-flow' : 'day-1-period-comfort')}
          className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-roseDust-500 to-roseDust-600 hover:from-roseDust-600 hover:to-roseDust-700 text-white rounded-2xl text-xs sm:text-sm font-semibold shadow-soft hover:shadow-md transition-all active:scale-98"
        >
          <span>Start Gentle Care Flow (Day {cycleDay})</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={handleRestClick}
          disabled={restMarked}
          className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-semibold border transition-all ${
            restMarked
              ? 'bg-sageCare-100 text-sageCare-700 border-sageCare-300'
              : 'bg-white/90 hover:bg-white text-plum-800 border-cream-300 active:scale-98'
          }`}
        >
          {restMarked ? (
            <>
              <Check className="w-4 h-4 text-sageCare-600" />
              <span>Rest Day Honored ❤️</span>
            </>
          ) : (
            <>
              <Bed className="w-4 h-4 text-roseDust-500" />
              <span>I Prefer Pure Rest Today</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
