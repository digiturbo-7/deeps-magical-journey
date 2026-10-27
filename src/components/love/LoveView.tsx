import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, Heart, Sparkles, MessageCircle, 
  ShieldCheck, ShieldOff, CheckCircle2, Lock, Users 
} from 'lucide-react';
import { LoveMessage, SharedActivity } from '../../types';
import { SHARED_ACTIVITIES, LOVE_MESSAGES } from '../../data/loveMessages';
import { db } from '../../db';

export const LoveView: React.FC = () => {
  const [activities, setActivities] = useState<SharedActivity[]>(SHARED_ACTIVITIES);
  const [partnerSharing, setPartnerSharing] = useState(false);
  const [loveNoteIndex, setLoveNoteIndex] = useState(0);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    const list = await db.sharedActivities.toArray();
    if (list.length > 0) {
      setActivities(list);
    }
  };

  const toggleActivity = async (id: string) => {
    const updated = activities.map(act => 
      act.id === id ? { ...act, completed: !act.completed } : act
    );
    setActivities(updated);
    const target = updated.find(a => a.id === id);
    if (target) {
      await db.sharedActivities.put(target);
    }
  };

  const currentLove = LOVE_MESSAGES[loveNoteIndex] || LOVE_MESSAGES[0];

  return (
    <div className="space-y-6 pb-24 animate-fadeIn max-w-4xl mx-auto px-4 pt-3">
      
      {/* Header */}
      <div className="rounded-3xl bg-white/95 p-5 sm:p-6 border border-roseDust-200 shadow-soft">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-roseDust-100 text-roseDust-600 rounded-2xl">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-plum-950">
                Us, Love & Teamwork ❤️
              </h2>
              <p className="text-xs sm:text-sm text-plum-500 font-sans">
                Support without surveillance • Shared connection • Pure love
              </p>
            </div>
          </div>

          {/* Privacy Consent Badge */}
          <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
            partnerSharing
              ? 'bg-roseDust-50 text-roseDust-700 border-roseDust-300'
              : 'bg-cream-100 text-plum-700 border-cream-200'
          }`}>
            <Lock className="w-3.5 h-3.5 text-roseDust-500" />
            <span>Private by Default</span>
          </div>
        </div>

        {/* Consent & Ethics Policy Box */}
        <div className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200 text-xs text-plum-700 leading-relaxed space-y-1.5">
          <div className="flex items-center space-x-1.5 font-bold text-plum-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Strict Privacy & Consent Boundaries:</span>
          </div>
          <p>
            Your partner cannot see your private food scale logs, weight entries, menstrual records, or private journal entries without your explicit consent. There are <strong>no partner leaderboards, comparison scores, or pressure notifications</strong>. You are a team rooted in respect and autonomy.
          </p>
        </div>
      </div>

      {/* Featured Daily Loving Affirmation */}
      <div className="rounded-3xl bg-gradient-to-br from-roseDust-50 via-white to-softCoral-50/70 p-5 sm:p-6 border border-roseDust-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-roseDust-600 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Partner Affirmation • {currentLove.title}</span>
          </div>

          <div className="flex space-x-1">
            {LOVE_MESSAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setLoveNoteIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  loveNoteIndex === idx ? 'w-5 bg-roseDust-500' : 'bg-cream-300'
                }`}
              />
            ))}
          </div>
        </div>

        <blockquote className="font-serif italic text-base sm:text-lg text-plum-950 leading-relaxed pl-3 border-l-2 border-roseDust-400">
          “{currentLove.message}”
        </blockquote>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
          <div className="p-3 bg-white/90 rounded-2xl border border-roseDust-200">
            <span className="font-bold text-roseDust-700 block mb-1">
              Helpful Question to Ask Her This Week:
            </span>
            <span className="text-plum-700">“{currentLove.conversationPrompt}”</span>
          </div>

          <div className="p-3 bg-white/90 rounded-2xl border border-roseDust-200">
            <span className="font-bold text-roseDust-700 block mb-1">
              Supportive Partner Action Idea:
            </span>
            <span className="text-plum-700">{currentLove.partnerActionSuggestion}</span>
          </div>
        </div>
      </div>

      {/* Shared Couple Activities */}
      <div className="rounded-3xl bg-white/95 p-5 sm:p-6 border border-cream-300 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-plum-900">
            <Users className="w-5 h-5 text-roseDust-500" />
            <h3 className="font-serif font-bold text-base sm:text-lg">
              Positive Shared Activities (Together Rituals)
            </h3>
          </div>
          <span className="text-xs text-plum-500 font-medium">
            {activities.filter(a => a.completed).length} / {activities.length} completed
          </span>
        </div>

        <p className="text-xs text-plum-600 leading-relaxed font-sans">
          Joyful activities you can enjoy together without tracking pressure or competition.
        </p>

        <div className="space-y-2.5">
          {activities.map((act) => (
            <div
              key={act.id}
              onClick={() => toggleActivity(act.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3 ${
                act.completed
                  ? 'bg-sageCare-50/70 border-sageCare-200 text-plum-700'
                  : 'bg-cream-50 hover:bg-cream-100 border-cream-200 text-plum-900'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {act.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-sageCare-600" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-plum-300" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs sm:text-sm font-bold ${act.completed ? 'line-through text-plum-500' : ''}`}>
                    {act.title}
                  </h4>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-cream-200 text-plum-500 font-semibold">
                    ~{act.durationMins} mins
                  </span>
                </div>
                <p className="text-xs text-plum-600 mt-1">
                  {act.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partner Sharing Control Card */}
      <div className="p-4 rounded-3xl bg-cream-50 border border-cream-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-plum-950 block text-sm">
            Partner Cross-Device Sync Status
          </span>
          <p className="text-plum-600">
            Currently running in <strong>Secure Local-First Mode</strong>. No private health data is uploaded to remote cloud servers or shared without explicit PIN consent.
          </p>
        </div>

        <button
          onClick={() => {
            setPartnerSharing(!partnerSharing);
            alert(partnerSharing ? 'Partner sharing disabled. All data is strictly local & private.' : 'Partner shared-activity sync enabled for shared walking & cooking rituals.');
          }}
          className="px-4 py-2 bg-white hover:bg-cream-100 text-plum-800 rounded-xl border border-cream-300 font-bold transition-all shrink-0 active:scale-95"
        >
          {partnerSharing ? 'Stop Shared Mode' : 'Configure Sharing'}
        </button>
      </div>

    </div>
  );
};
