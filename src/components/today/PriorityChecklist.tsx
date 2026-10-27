import React, { useState } from 'react';
import { CheckCircle2, Circle, Sparkles, Award } from 'lucide-react';

interface PriorityItem {
  id: string;
  text: string;
  category: string;
  completed: boolean;
}

export const PriorityChecklist: React.FC = () => {
  const [items, setItems] = useState<PriorityItem[]>([
    { id: '1', text: 'Gentle hydration: drink water whenever thirsty', category: 'Hydration', completed: true },
    { id: '2', text: 'Gentle 10-min movement or cozy rest for period care', category: 'Movement', completed: false },
    { id: '3', text: 'Balanced home meal with vegetables/palya and protein', category: 'Food', completed: false },
    { id: '4', text: 'Evening wind-down: 10 mins screen-free before bed', category: 'Sleep', completed: false },
  ]);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const completedCount = items.filter(i => i.completed).length;

  return (
    <div className="rounded-3xl bg-white/90 p-5 sm:p-6 border border-cream-300 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-sageCare-100 text-sageCare-600 rounded-2xl">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-base text-plum-950">
              Today\'s Gentle Priorities
            </h4>
            <span className="text-xs text-plum-500">
              Forgiving daily steps • Every small action counts
            </span>
          </div>
        </div>

        <span className="text-xs font-bold text-sageCare-700 bg-sageCare-50 px-2.5 py-1 rounded-full border border-sageCare-200">
          {completedCount} / {items.length} done
        </span>
      </div>

      <div className="space-y-2 mt-2">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`flex items-center space-x-3 p-3 rounded-2xl cursor-pointer transition-all ${
              item.completed
                ? 'bg-sageCare-50/70 border border-sageCare-200 text-plum-700'
                : 'bg-cream-50 hover:bg-cream-100 border border-cream-200 text-plum-800'
            }`}
          >
            {item.completed ? (
              <CheckCircle2 className="w-5 h-5 text-sageCare-600 shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-plum-400 shrink-0" />
            )}

            <div className="flex-1 text-xs sm:text-sm">
              <span className={`leading-snug ${item.completed ? 'line-through text-plum-400 font-normal' : 'font-medium'}`}>
                {item.text}
              </span>
            </div>

            <span className="text-[10px] font-semibold text-plum-600 bg-white px-2 py-0.5 rounded-md border border-cream-200">
              {item.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
