import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Info, CheckCircle2, Heart, ArrowRight } from 'lucide-react';
import { DETOX_RESET_PLANS, DetoxResetPlan } from '../../data/detoxResets';

interface DetoxViewProps {
  onAskAI: (prompt: string) => void;
}

export const DetoxView: React.FC<DetoxViewProps> = ({ onAskAI }) => {
  const [selectedPlan, setSelectedPlan] = useState<DetoxResetPlan>(DETOX_RESET_PLANS[0]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  const handleActivate = (plan: DetoxResetPlan) => {
    setActivePlanId(plan.id);
    alert(`“${plan.name}” activated! Take things gently today.`);
  };

  return (
    <div className="space-y-6 pb-24 animate-fadeIn max-w-4xl mx-auto px-4 pt-3">
      
      {/* Header */}
      <div className="rounded-3xl bg-white/90 p-5 sm:p-6 border border-sageCare-200 shadow-soft">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2.5 bg-sageCare-100 text-sageCare-600 rounded-2xl">
            <Sparkles className="w-6 h-6 text-sageCare-500" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-plum-950">
              Safe & Science-Backed “Detox & Reset”
            </h2>
            <p className="text-xs sm:text-sm text-plum-500 font-sans">
              No starvation • No cleanses • Pure biological care
            </p>
          </div>
        </div>

        {/* Science Truth Box */}
        <div className="p-4 bg-gradient-to-r from-sageCare-50 to-cream-100 rounded-2xl border border-sageCare-200 text-xs text-plum-800 leading-relaxed space-y-2">
          <div className="flex items-center space-x-2 font-bold text-sageCare-800 text-sm">
            <ShieldCheck className="w-4 h-4 text-sageCare-600" />
            <span>How Your Body Truly "Detoxes" Naturally:</span>
          </div>
          <p>
            Your <strong>liver and kidneys</strong> work 24 hours a day, 7 days a week to break down and filter waste metabolites with extraordinary efficiency. You never need juice cleanses, laxatives, diet pills, or starvation to "cleanse" your system.
          </p>
          <p>
            The healthiest reset is simply providing your organs with <strong>clean hydration, balanced whole foods with gentle plant fibre, and restorative sleep</strong>.
          </p>
        </div>
      </div>

      {/* Scale Fluctuations Reality Check */}
      <div className="p-4 rounded-3xl bg-white border border-roseDust-200 shadow-soft text-xs text-plum-800 space-y-2">
        <div className="flex items-center space-x-2 font-bold text-roseDust-700 text-sm">
          <Info className="w-4 h-4 text-roseDust-500" />
          <span>Scale Fluctuation Reality Check (Water vs Fat):</span>
        </div>
        <p className="leading-relaxed">
          Did the scale suddenly fluctuate by 0.5 kg to 2.0 kg overnight? <strong>It is physically impossible to gain 1 kg of body fat overnight.</strong> Short-term scale changes are almost entirely temporary water retention from sodium, digestion, or menstrual cycle hormone shifts. Be kind to yourself!
        </p>
      </div>

      {/* Plan Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {DETOX_RESET_PLANS.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlan(plan)}
            className={`p-3 rounded-2xl text-left transition-all ${
              selectedPlan.id === plan.id
                ? 'bg-plum-900 text-white shadow-soft scale-[1.02]'
                : 'bg-white hover:bg-cream-100 text-plum-800 border border-cream-200'
            }`}
          >
            <span className="block text-[10px] uppercase font-bold tracking-wider opacity-75 mb-0.5">
              {plan.durationLabel}
            </span>
            <span className="block text-xs font-bold leading-tight">
              {plan.name}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Plan Details Card */}
      <div className="rounded-3xl bg-white/95 p-5 sm:p-6 border border-cream-300 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-cream-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sageCare-600">
              {selectedPlan.durationLabel} Plan
            </span>
            <h3 className="font-serif font-bold text-lg sm:text-xl text-plum-950">
              {selectedPlan.name}
            </h3>
            <span className="text-xs text-plum-500 font-medium">
              {selectedPlan.tagline}
            </span>
          </div>

          <button
            onClick={() => handleActivate(selectedPlan)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
              activePlanId === selectedPlan.id
                ? 'bg-sageCare-100 text-sageCare-700 border border-sageCare-300'
                : 'bg-gradient-to-r from-sageCare-500 to-sageCare-600 hover:from-sageCare-600 text-white active:scale-95'
            }`}
          >
            {activePlanId === selectedPlan.id ? '✓ Currently Active' : 'Activate This Reset'}
          </button>
        </div>

        <p className="text-xs text-plum-700 leading-relaxed font-sans">
          {selectedPlan.scienceExplanation}
        </p>

        {/* Guidelines */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-plum-800 mb-2">
            Gentle Guidelines:
          </h4>
          <ul className="space-y-1.5 text-xs text-plum-700">
            {selectedPlan.guidelines.map((g, i) => (
              <li key={i} className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-sageCare-500 shrink-0 mt-0.5" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sample Balanced Meals */}
        <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 space-y-2 text-xs">
          <span className="font-bold text-plum-900 block">
            Sample Comfort Meal Blueprint:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-plum-700">
            <div>• <strong>Breakfast:</strong> {selectedPlan.sampleMeals.breakfast}</div>
            <div>• <strong>Lunch:</strong> {selectedPlan.sampleMeals.lunch}</div>
            <div>• <strong>Snack:</strong> {selectedPlan.sampleMeals.snack}</div>
            <div>• <strong>Dinner:</strong> {selectedPlan.sampleMeals.dinner}</div>
          </div>
        </div>

        <div className="p-3 bg-roseDust-50/70 rounded-2xl border border-roseDust-200 text-xs text-roseDust-900 flex items-center space-x-2">
          <Heart className="w-4 h-4 text-roseDust-500 shrink-0" />
          <span>{selectedPlan.reassuranceNote}</span>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => onAskAI(`Can you give me a personalized ${selectedPlan.name}?`)}
            className="text-xs font-bold text-roseDust-600 hover:text-roseDust-700 flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Rosy to tailor this reset to my fridge</span>
          </button>
        </div>
      </div>

    </div>
  );
};
