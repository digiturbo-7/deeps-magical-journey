import React from 'react';
import { Home, Utensils, Music, TrendingUp, Settings } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const navItems = [
    { id: 'today', label: 'Today', icon: Home },
    { id: 'diet', label: 'Diet & Meals', icon: Utensils },
    { id: 'workout', label: 'Zumba & Dance', icon: Music },
    { id: 'progress', label: 'Progress & Excel', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-cream-300 pb-safe pt-2 shadow-soft-lg"
      aria-label="Main Navigation"
    >
      <div className="max-w-md mx-auto flex items-center justify-around px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id || (item.id === 'diet' && currentTab === 'food') || (item.id === 'workout' && currentTab === 'movement');
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all duration-200 relative min-w-[58px] ${
                isActive
                  ? 'text-roseDust-600 scale-105'
                  : 'text-plum-600 hover:text-plum-900 active:scale-95'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={`p-1.5 rounded-xl transition-all ${
                isActive ? 'bg-roseDust-100/90 text-roseDust-600 shadow-sm' : ''
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${
                isActive ? 'font-bold text-roseDust-700' : 'font-medium text-plum-600'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-roseDust-500 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
