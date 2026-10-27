import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface FloatingAIAssistantProps {
  onOpen: () => void;
  unreadCount?: number;
}

export const FloatingAIAssistant: React.FC<FloatingAIAssistantProps> = ({ onOpen, unreadCount }) => {
  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-30">
      <button
        id="floating-ask-ai-button"
        onClick={onOpen}
        className="group relative flex items-center space-x-2 bg-gradient-to-tr from-roseDust-500 via-roseDust-400 to-softCoral-400 text-white pl-3.5 pr-4 py-3 rounded-full shadow-rose-glow hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 border border-white/30"
        aria-label="Open Rosy AI Companion"
      >
        <div className="relative">
          <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Heart className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cream-100 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
        </div>

        <div className="text-left">
          <span className="block text-xs font-serif font-bold tracking-tight text-white leading-none">
            Ask Rosy
          </span>
          <span className="block text-[10px] text-roseDust-100 font-medium leading-tight">
            AI Companion
          </span>
        </div>

        <Sparkles className="w-4 h-4 text-cream-200 ml-0.5 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};
