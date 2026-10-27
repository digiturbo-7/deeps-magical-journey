import React, { useState } from 'react';
import { CheckCircle2, XCircle, Sparkles, ArrowRight, ShieldAlert, Loader2 } from 'lucide-react';
import { AIAction } from '../../types';
import { executeAIAction } from '../../services/aiService';

interface ActionConfirmationCardProps {
  action: AIAction;
  onApplied: (actionId: string, resultMsg: string) => void;
  onDismissed: (actionId: string) => void;
}

export const ActionConfirmationCard: React.FC<ActionConfirmationCardProps> = ({
  action,
  onApplied,
  onDismissed
}) => {
  const [isApplying, setIsApplying] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleApply = async () => {
    setIsApplying(true);
    const res = await executeAIAction(action);
    setIsApplying(false);
    if (res.success) {
      setFeedback(res.message);
      onApplied(action.id, res.message);
    } else {
      setFeedback(`Note: ${res.message}`);
    }
  };

  const handleDismiss = () => {
    onDismissed(action.id);
  };

  return (
    <div className={`mt-3 p-4 rounded-2xl border transition-all ${
      action.isHighRisk
        ? 'bg-softCoral-50/90 border-softCoral-300'
        : 'bg-white/95 border-roseDust-200 shadow-soft'
    }`}>
      {/* Header */}
      <div className="flex items-start space-x-2.5 mb-2.5">
        <div className={`p-1.5 rounded-xl ${
          action.isHighRisk ? 'bg-softCoral-200 text-softCoral-700' : 'bg-roseDust-100 text-roseDust-600'
        }`}>
          {action.isHighRisk ? (
            <ShieldAlert className="w-4 h-4" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
        </div>
        <div className="flex-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-plum-600 block">
            {action.isHighRisk ? 'Requires Confirmation' : 'Suggested Plan Action'}
          </span>
          <h4 className="font-serif font-bold text-plum-900 text-sm leading-snug">
            {action.summary}
          </h4>
        </div>
      </div>

      {/* Details Box */}
      <div className="p-3 bg-cream-100/70 rounded-xl text-xs text-plum-700 mb-3 border border-cream-200 leading-relaxed font-sans">
        {action.details}
      </div>

      {feedback && (
        <div className="mb-3 p-2 bg-sageCare-100 text-sageCare-600 text-xs font-semibold rounded-lg flex items-center space-x-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center space-x-2 pt-1">
        <button
          onClick={handleApply}
          disabled={isApplying}
          className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 bg-gradient-to-r from-roseDust-500 to-roseDust-600 hover:from-roseDust-600 hover:to-roseDust-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
        >
          {isApplying ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5" />
          )}
          <span>Apply Changes</span>
        </button>

        <button
          onClick={handleDismiss}
          disabled={isApplying}
          className="py-2 px-3 bg-cream-200 hover:bg-cream-300 text-plum-700 rounded-xl text-xs font-semibold transition-all active:scale-95"
        >
          Keep Current
        </button>
      </div>
    </div>
  );
};
