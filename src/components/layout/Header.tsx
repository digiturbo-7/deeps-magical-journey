import React from 'react';
import { Heart, Sparkles, Shield, AlertTriangle, Moon, Settings as SettingsIcon, Calendar } from 'lucide-react';
import { UserProfile } from '../../types';

interface HeaderProps {
  profile: UserProfile;
  currentTab: string;
  todayFormatted?: string;
  onSelectTab: (tab: string) => void;
  onOpenAI: () => void;
  onOpenEmergency: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  currentTab,
  todayFormatted,
  onSelectTab,
  onOpenAI,
  onOpenEmergency
}) => {
  return (
    <header className="sticky top-0 z-40 bg-cream-100/90 backdrop-blur-md border-b border-cream-300/80 px-4 py-3 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand & Day Badge */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => onSelectTab('today')}
        >
          <div className="relative w-10 h-10 rounded-2xl overflow-hidden shadow-soft border border-roseDust-200 bg-white flex items-center justify-center p-0.5">
            <img 
              src="/app-icon.jpg" 
              alt="Deeps Magical Journey Logo" 
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                // Fallback if image fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <Heart className="w-5 h-5 text-roseDust-500 fill-roseDust-400 absolute" />
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-serif font-bold text-base md:text-lg text-plum-900 tracking-tight leading-tight">
                DEEPS MAGICAL JOURNEY
              </span>
              <span className="text-roseDust-500 text-xs">❤️</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-plum-600 font-medium">
              <span className="bg-roseDust-100/80 text-roseDust-700 px-2 py-0.5 rounded-full font-semibold">
                Day {profile.currentDay} of {profile.journeyLengthDays}
              </span>
              <span className="text-cream-500">•</span>
              <span>{todayFormatted || 'Today'}</span>
            </div>
          </div>
        </div>

        {/* Quick Action Badges */}
        <div className="flex items-center space-x-2">
          {/* Ask AI button in header */}
          <button
            id="header-ask-ai-button"
            onClick={onOpenAI}
            className="hidden sm:flex items-center space-x-1.5 bg-gradient-to-r from-roseDust-500 to-lavenderSoft-400 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-rose-glow hover:opacity-95 transition-all active:scale-95"
            aria-label="Ask Rosy AI Companion"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Rosy</span>
          </button>

          {/* Menstrual quick comfort link */}
          <button
            onClick={() => onSelectTab('cycle')}
            className={`p-2 rounded-xl transition-all ${
              currentTab === 'cycle'
                ? 'bg-roseDust-200 text-roseDust-800'
                : 'bg-white/80 hover:bg-roseDust-50 text-plum-700 border border-cream-300'
            }`}
            title="Cycle & Comfort Care"
            aria-label="Cycle & Comfort"
          >
            <span className="relative flex h-2 w-2 mb-[-6px] ml-auto">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-roseDust-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-roseDust-500"></span>
            </span>
            <Calendar className="w-4 h-4 text-roseDust-600" />
          </button>

          {/* Settings button */}
          <button
            onClick={() => onSelectTab('settings')}
            className={`p-2 rounded-xl transition-all ${
              currentTab === 'settings'
                ? 'bg-plum-800 text-white'
                : 'bg-white/80 hover:bg-cream-200 text-plum-700 border border-cream-300'
            }`}
            title="Settings & Privacy"
            aria-label="Settings and Privacy"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Medical Safety quick button */}
          <button
            onClick={onOpenEmergency}
            className="p-2 rounded-xl bg-softCoral-50 hover:bg-softCoral-100 text-softCoral-500 border border-softCoral-300 transition-all"
            title="Urgent Health Safety & Crisis Guide"
            aria-label="Urgent Health Safety"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
