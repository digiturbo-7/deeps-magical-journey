import React, { useState } from 'react';
import { X, Heart, Check, Utensils } from 'lucide-react';
import { db } from '../../db';
import { FoodLog, FoodState } from '../../types';
import { getLocalDateString } from '../../utils/dateUtils';

interface GuiltFreeLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMealType?: string;
  onLoggedSuccess: () => void;
}

export const GuiltFreeLogModal: React.FC<GuiltFreeLogModalProps> = ({
  isOpen,
  onClose,
  defaultMealType = 'lunch',
  onLoggedSuccess
}) => {
  const [mealType, setMealType] = useState(defaultMealType);
  const [foodName, setFoodName] = useState('');
  const [portionGrams, setPortionGrams] = useState<number | ''>('');
  const [foodState, setFoodState] = useState<FoodState>('COOKED/READY-TO-EAT');
  const [satisfaction, setSatisfaction] = useState('Satisfying & Nourishing');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    setIsSaving(true);
    const newLog: FoodLog = {
      date: getLocalDateString(),
      mealType: mealType as any,
      foodName: foodName.trim(),
      state: foodState,
      weightGrams: Number(portionGrams) || 0,
      caloriesApprox: 300, // Safe estimate
      proteinApprox: 12,
      carbsApprox: 40,
      fatApprox: 8,
      isHomemade: true,
      scaleModeUsed: portionGrams !== '',
      notes: notes ? `${notes} (${satisfaction})` : satisfaction
    };

    await db.foodLogs.add(newLog);
    setIsSaving(false);
    onLoggedSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-plum-950/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-roseDust-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-plum-400 hover:text-plum-900 rounded-full hover:bg-cream-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 text-roseDust-500 mb-3">
          <div className="p-2 bg-roseDust-100 rounded-2xl">
            <Heart className="w-5 h-5 fill-roseDust-400" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-plum-900 leading-tight">
              Log What You Actually Ate ❤️
            </h3>
            <p className="text-xs text-roseDust-600 font-medium">
              Zero guilt • No cheat meals • Just real life
            </p>
          </div>
        </div>

        <p className="text-xs text-plum-600 mb-4 leading-relaxed font-sans">
          Plans change, family gathers, and cravings happen. Record your real food with self-respect and move forward effortlessly.
        </p>

        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-plum-800 block mb-1">
              Meal Time
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {['breakfast', 'lunch', 'snack', 'dinner'].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setMealType(type)}
                  className={`py-1.5 text-xs font-semibold rounded-xl capitalize transition-all ${
                    mealType === type
                      ? 'bg-plum-900 text-white shadow-2xs'
                      : 'bg-cream-100 text-plum-700 hover:bg-cream-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-plum-800 block mb-1">
              What did you enjoy?
            </label>
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g., Chicken Biryani with Raita, or Masala Dosa"
              required
              className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm text-plum-900 focus:outline-none focus:border-roseDust-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-plum-800 block mb-1">
                Portion (Optional)
              </label>
              <input
                type="number"
                value={portionGrams}
                onChange={(e) => setPortionGrams(e.target.value ? Number(e.target.value) : '')}
                placeholder="Grams (e.g. 180)"
                className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl text-xs text-plum-900 focus:outline-none focus:border-roseDust-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-plum-800 block mb-1">
                State
              </label>
              <select
                value={foodState}
                onChange={(e) => setFoodState(e.target.value as FoodState)}
                className="w-full px-2.5 py-2 bg-cream-50 border border-cream-300 rounded-xl text-xs text-plum-900 focus:outline-none focus:border-roseDust-400"
              >
                <option value="COOKED/READY-TO-EAT">Cooked on plate</option>
                <option value="RAW/DRY">Raw / Dry weight</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-plum-800 block mb-1">
              How did it make you feel?
            </label>
            <select
              value={satisfaction}
              onChange={(e) => setSatisfaction(e.target.value)}
              className="w-full px-3 py-2 bg-cream-50 border border-cream-300 rounded-xl text-xs text-plum-900 focus:outline-none focus:border-roseDust-400"
            >
              <option value="Satisfying & Nourishing">Satisfying & Nourishing</option>
              <option value="Joyful celebration meal">Joyful celebration meal</option>
              <option value="Ate a bit fast, but enjoyed it">Ate a bit fast, but enjoyed it</option>
              <option value="A little heavy, will sip warm water">A little heavy, will sip warm water</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving || !foodName.trim()}
              className="w-full py-3 bg-gradient-to-r from-roseDust-500 to-roseDust-600 hover:from-roseDust-600 hover:to-roseDust-700 text-white font-semibold text-xs sm:text-sm rounded-2xl shadow-soft transition-all active:scale-95 disabled:opacity-50"
            >
              Save Meal & Continue with Peace ❤️
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
