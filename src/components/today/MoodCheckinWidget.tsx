import React, { useState } from 'react';
import { Smile, Sparkles, Check } from 'lucide-react';
import { MoodEntry } from '../../types';

interface MoodCheckinWidgetProps {
  currentEntry: MoodEntry | null;
  onSaveMood: (entry: Partial<MoodEntry>) => void;
  onOpenMindTab: () => void;
}

const MOODS = [
  { emoji: '🌸', label: 'Peaceful' },
  { emoji: '☀️', label: 'Radiant' },
  { emoji: '☁️', label: 'Quiet' },
  { emoji: '🌧️', label: 'Tired' },
  { emoji: '🫂', label: 'Tender' },
];

export const MoodCheckinWidget: React.FC<MoodCheckinWidgetProps> = ({
  currentEntry,
  onSaveMood,
  onOpenMindTab
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState(currentEntry?.moodEmoji || '🌸');
  const [energyLevel, setEnergyLevel] = useState(currentEntry?.energyRating || 3);
  const [savedNote, setSavedNote] = useState(false);

  const handleSelect = (emoji: string, label: string) => {
    setSelectedEmoji(emoji);
    onSaveMood({
      moodEmoji: emoji,
      moodLabel: label,
      energyRating: energyLevel
    });
    setSavedNote(true);
    setTimeout(() => setSavedNote(false), 2000);
  };

  return (
    <div className="rounded-3xl bg-white/90 p-5 border border-cream-300 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-lavenderSoft-100 text-lavenderSoft-500 rounded-2xl">
            <Smile className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-plum-950">
              Mood & Energy
            </h4>
            <span className="text-[11px] text-plum-500">
              Optional daily check-in • No pressure
            </span>
          </div>
        </div>

        {savedNote && (
          <span className="text-[11px] text-sageCare-600 font-semibold flex items-center space-x-1">
            <Check className="w-3.5 h-3.5" />
            <span>Checked in</span>
          </span>
        )}
      </div>

      {/* Mood Selector Buttons */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {MOODS.map((m) => {
          const isSelected = selectedEmoji === m.emoji;
          return (
            <button
              key={m.label}
              onClick={() => handleSelect(m.emoji, m.label)}
              className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
                isSelected
                  ? 'bg-roseDust-100 border-2 border-roseDust-400 scale-105 shadow-2xs'
                  : 'bg-cream-100/70 hover:bg-cream-200 border border-cream-200'
              }`}
            >
              <span className="text-xl">{m.emoji}</span>
              <span className="text-[10px] font-semibold text-plum-700 mt-1">
                {m.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Energy Slider Indicator */}
      <div className="flex items-center justify-between pt-2 border-t border-cream-200 text-xs">
        <span className="text-plum-600 text-[11px]">Energy Today:</span>
        <div className="flex items-center space-x-1.5">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => {
                setEnergyLevel(level);
                onSaveMood({ energyRating: level, moodEmoji: selectedEmoji });
              }}
              className={`w-5 h-5 rounded-full text-[10px] font-bold transition-all ${
                level <= energyLevel
                  ? 'bg-gradient-to-tr from-roseDust-400 to-softCoral-400 text-white shadow-2xs'
                  : 'bg-cream-200 text-plum-400 hover:bg-cream-300'
              }`}
              title={`Energy rating: ${level}/5`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
