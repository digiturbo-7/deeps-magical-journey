import React from 'react';
import { Utensils, Scale, RefreshCw, PlusCircle, ArrowRight, Sparkles } from 'lucide-react';
import { DailyMealPlan, MealOption } from '../../types';

interface MealSnippetCardProps {
  plan: DailyMealPlan | null;
  onOpenScaleGuide: () => void;
  onOpenGuiltFreeLogger: (mealType: string) => void;
  onOpenFoodTab: () => void;
  onAskAIForMeal: (mealName: string) => void;
}

export const MealSnippetCard: React.FC<MealSnippetCardProps> = ({
  plan,
  onOpenScaleGuide,
  onOpenGuiltFreeLogger,
  onOpenFoodTab,
  onAskAIForMeal
}) => {
  if (!plan) return null;

  const meals: { key: keyof DailyMealPlan; label: string; iconTime: string; data: MealOption }[] = [
    { key: 'breakfast', label: 'Breakfast', iconTime: 'Morning • 9:00 AM', data: plan.breakfast },
    { key: 'lunch', label: 'Lunch', iconTime: 'Midday • 1:30 PM', data: plan.lunch },
    { key: 'snack', label: 'Afternoon Refresher', iconTime: 'Evening • 5:30 PM', data: plan.snack },
    { key: 'dinner', label: 'Nourishing Dinner', iconTime: 'Night • 8:30 PM', data: plan.dinner },
  ];

  return (
    <div className="rounded-3xl bg-white/90 p-5 sm:p-6 border border-cream-300 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-roseDust-100 text-roseDust-600 rounded-2xl">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-plum-950">
              Today\'s Nourishing Meals
            </h3>
            <p className="text-xs text-plum-500">
              South Indian home food • Balanced portions & scale awareness
            </p>
          </div>
        </div>

        <button
          onClick={onOpenScaleGuide}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-cream-100 hover:bg-cream-200 text-plum-700 text-xs font-semibold rounded-xl border border-cream-300 transition-all active:scale-95"
          title="How to weigh raw vs cooked foods"
        >
          <Scale className="w-3.5 h-3.5 text-roseDust-500" />
          <span className="hidden sm:inline">Scale Guide</span>
        </button>
      </div>

      {/* Meals Grid */}
      <div className="space-y-3">
        {meals.map((item) => (
          <div
            key={item.key}
            className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200/90 hover:border-roseDust-200 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-roseDust-600 block">
                  {item.label} • <span className="text-plum-500 font-normal">{item.iconTime}</span>
                </span>
                <h4 className="font-bold text-plum-900 text-sm mt-0.5">
                  {item.data.title}
                </h4>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onAskAIForMeal(item.label)}
                  className="p-1.5 text-plum-400 hover:text-roseDust-600 hover:bg-roseDust-50 rounded-lg transition-colors"
                  title={`Ask Rosy to modify ${item.label}`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onOpenGuiltFreeLogger(item.key as string)}
                  className="text-[11px] font-semibold text-plum-600 hover:text-plum-900 px-2 py-1 rounded-lg hover:bg-cream-200 transition-colors"
                  title="I ate something different"
                >
                  Log different
                </button>
              </div>
            </div>

            <p className="text-xs text-plum-600 mt-1 line-clamp-2">
              {item.data.description}
            </p>

            {/* Badges for Raw vs Cooked scale guides */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
              {item.data.rawPortionGuide && item.data.rawPortionGuide !== 'N/A' && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Dry/Raw: {item.data.rawPortionGuide}</span>
                </span>
              )}

              {item.data.cookedPortionGuide && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-sageCare-50 text-sageCare-700 border border-sageCare-200 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-sageCare-500" />
                  <span>On Plate: {item.data.cookedPortionGuide}</span>
                </span>
              )}

              <span className="text-plum-400 text-[10px] ml-auto">
                ~{item.data.approxCalories} kcal • ~{item.data.approxProteinG}g protein
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Leftover Tip & Explore button */}
      <div className="mt-4 pt-3 border-t border-cream-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="text-plum-600 italic text-[11px]">
          💡 <span className="font-medium text-plum-800">Smart Leftover Tip:</span> {plan.quickLeftoverTip}
        </div>
        <button
          onClick={onOpenFoodTab}
          className="flex items-center space-x-1 text-roseDust-600 hover:text-roseDust-700 font-bold shrink-0 text-xs"
        >
          <span>Open Food Planner</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
