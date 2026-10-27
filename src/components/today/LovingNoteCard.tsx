import React, { useState } from 'react';
import { Heart, MessageCircleHeart, Sparkles } from 'lucide-react';
import { LoveMessage } from '../../types';

interface LovingNoteCardProps {
  loveNote: LoveMessage;
  onOpenLoveTab: () => void;
}

export const LovingNoteCard: React.FC<LovingNoteCardProps> = ({ loveNote, onOpenLoveTab }) => {
  const [loved, setLoved] = useState(false);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-roseDust-50/90 via-white to-softCoral-50/70 p-5 sm:p-6 border border-roseDust-200/80 shadow-soft relative overflow-hidden">
      <div className="absolute top-0 right-0 w-28 h-28 bg-roseDust-300/15 rounded-full blur-xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-roseDust-100 text-roseDust-600 rounded-2xl">
            <Heart className="w-4 h-4 fill-roseDust-500 text-roseDust-500" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-plum-950">
              Love & Partner Support ❤️
            </h4>
            <span className="text-[11px] text-roseDust-700 font-medium">
              Daily Affirmation
            </span>
          </div>
        </div>

        <button
          onClick={() => setLoved(!loved)}
          className={`p-2 rounded-2xl transition-all ${
            loved ? 'bg-roseDust-500 text-white shadow-rose-glow scale-105' : 'bg-white/80 hover:bg-roseDust-100 text-roseDust-600 border border-roseDust-200'
          }`}
          title="Send love back"
        >
          <Heart className={`w-4 h-4 ${loved ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Message Quote */}
      <div className="p-4 bg-white/85 rounded-2xl border border-roseDust-100/90 shadow-2xs mb-3 text-xs sm:text-sm text-plum-800 leading-relaxed font-sans italic">
        “{loveNote.message}”
      </div>

      {/* Partner Prompt & Action */}
      <div className="bg-roseDust-100/50 rounded-2xl p-3 border border-roseDust-200/60 text-xs space-y-1.5 text-plum-700">
        <div>
          <span className="font-bold text-roseDust-800">Together Prompt: </span>
          <span>{loveNote.conversationPrompt}</span>
        </div>
        <div className="text-[11px] text-plum-600">
          <span className="font-semibold text-plum-800">Partner action suggestion: </span>
          {loveNote.partnerActionSuggestion}
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <button
          onClick={onOpenLoveTab}
          className="text-xs font-bold text-roseDust-600 hover:text-roseDust-700 flex items-center space-x-1"
        >
          <MessageCircleHeart className="w-3.5 h-3.5" />
          <span>Shared Couple Activities</span>
        </button>
      </div>
    </div>
  );
};
