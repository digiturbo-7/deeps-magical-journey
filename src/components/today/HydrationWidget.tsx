import React from 'react';
import { Droplet, Plus, Minus, Sparkles } from 'lucide-react';

interface HydrationWidgetProps {
  glasses: number;
  targetGlasses: number;
  onUpdateGlasses: (newCount: number) => void;
}

export const HydrationWidget: React.FC<HydrationWidgetProps> = ({
  glasses,
  targetGlasses,
  onUpdateGlasses
}) => {
  const handleAdd = () => {
    onUpdateGlasses(Math.min(14, glasses + 1));
  };

  const handleMinus = () => {
    onUpdateGlasses(Math.max(0, glasses - 1));
  };

  const pct = Math.min(100, Math.round((glasses / targetGlasses) * 100));

  return (
    <div className="rounded-3xl bg-white/90 p-5 border border-cream-300 shadow-soft flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-sky-100 text-sky-600 rounded-2xl">
            <Droplet className="w-4 h-4 fill-sky-400" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-plum-950">
              Gentle Hydration
            </h4>
            <span className="text-[11px] text-plum-500">
              Sip according to natural thirst
            </span>
          </div>
        </div>

        <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
          {glasses} / {targetGlasses} glasses
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-cream-200 rounded-full h-2.5 mb-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-sky-400 to-sky-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-plum-600">
          ~{glasses * 250} ml (room temp / warm water)
        </span>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleMinus}
            disabled={glasses <= 0}
            className="p-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-plum-700 disabled:opacity-30 border border-cream-300 transition-all active:scale-95"
            aria-label="Remove glass"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
            aria-label="Add glass of water"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+1 Glass</span>
          </button>
        </div>
      </div>
    </div>
  );
};
