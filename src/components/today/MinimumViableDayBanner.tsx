import React from 'react';
import { ShieldCheck, Heart, Sparkles, X } from 'lucide-react';

interface MinimumViableDayBannerProps {
  isActive: boolean;
  onDeactivate: () => void;
}

export const MinimumViableDayBanner: React.FC<MinimumViableDayBannerProps> = ({
  isActive,
  onDeactivate
}) => {
  if (!isActive) return null;

  return (
    <div className="rounded-3xl bg-lavenderSoft-100/90 border border-lavenderSoft-300 p-5 shadow-soft animate-fadeIn relative">
      <button
        onClick={onDeactivate}
        className="absolute top-4 right-4 p-1.5 text-lavenderSoft-500 hover:text-plum-900 rounded-full hover:bg-lavenderSoft-200 transition-colors"
        title="Exit minimum viable day mode"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center space-x-2 text-lavenderSoft-500 mb-2">
        <Sparkles className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">
          Minimum Viable Day Active • Zero Pressure
        </span>
      </div>

      <h3 className="font-serif font-bold text-base sm:text-lg text-plum-950 mb-1">
        Taking care of yourself simply and gently today.
      </h3>

      <p className="text-xs text-plum-700 leading-relaxed mb-3">
        When energy is low or life is demanding, we reduce targets to three kind essentials. No failing, no broken streaks.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="bg-white/80 p-3 rounded-2xl border border-lavenderSoft-200">
          <span className="font-bold text-plum-900 block mb-1">1. Regular Meals</span>
          <span className="text-plum-600 text-[11px]">Eat comforting home food without restricting or skipping.</span>
        </div>
        <div className="bg-white/80 p-3 rounded-2xl border border-lavenderSoft-200">
          <span className="font-bold text-plum-900 block mb-1">2. 5-Min Stroll or Rest</span>
          <span className="text-plum-600 text-[11px]">A few deep breaths and slow steps, or cozy rest on the sofa.</span>
        </div>
        <div className="bg-white/80 p-3 rounded-2xl border border-lavenderSoft-200">
          <span className="font-bold text-plum-900 block mb-1">3. Self-Kindness</span>
          <span className="text-plum-600 text-[11px]">Acknowledge that showing up in small ways is more than enough.</span>
        </div>
      </div>
    </div>
  );
};
