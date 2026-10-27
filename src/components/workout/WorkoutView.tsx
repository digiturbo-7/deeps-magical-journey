import React, { useState, useEffect } from 'react';
import { 
  Music, Play, Bed, Plus, Trash2, ExternalLink, 
  ChevronLeft, ChevronRight, CheckCircle2, Flame, 
  Sparkles, Heart, Search, Tv
} from 'lucide-react';
import { UserProfile } from '../../types';
import { 
  getPlanForDate, getDayCalorieMetrics, logExerciseActivity, 
  calculateMetCalories, DayCalorieMetrics 
} from '../../services/plan240Service';
import { db } from '../../db';
import { formatDisplayDate, getLocalDateString } from '../../utils/dateUtils';
import confetti from 'canvas-confetti';

interface WorkoutViewProps {
  profile: UserProfile;
  selectedDateStr: string;
  onChangeSelectedDate: (newDate: string) => void;
  onAskAI: (prompt: string) => void;
}

export const WorkoutView: React.FC<WorkoutViewProps> = ({
  profile,
  selectedDateStr,
  onChangeSelectedDate,
  onAskAI
}) => {
  const [metrics, setMetrics] = useState<DayCalorieMetrics | null>(null);
  const [weeklyMinutes, setWeeklyMinutes] = useState(0);

  // Manual Log Form State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [activityTitle, setActivityTitle] = useState('Bollywood Beginner Zumba Dance');
  const [durationMins, setDurationMins] = useState(18);
  const [intensityMet, setIntensityMet] = useState(5.0);
  const [overrideCalories, setOverrideCalories] = useState<number | ''>('');
  const [activityNotes, setActivityNotes] = useState('Felt energized and joyful!');

  const loadData = async () => {
    const data = await getDayCalorieMetrics(selectedDateStr, profile);
    setMetrics(data);

    // Calculate weekly exercise minutes (last 7 days from selected date)
    const allActivities = await db.activityLogs.toArray();
    const parts = selectedDateStr.split('-');
    const curr = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    const weekAgo = new Date(curr);
    weekAgo.setDate(weekAgo.getDate() - 6);

    const weekMins = allActivities
      .filter(a => a.date >= getLocalDateString(weekAgo) && a.date <= selectedDateStr)
      .reduce((sum, a) => sum + (a.durationMins || 0), 0);
    setWeeklyMinutes(weekMins);
  };

  useEffect(() => {
    loadData();
  }, [selectedDateStr, profile]);

  const plan = getPlanForDate(selectedDateStr);

  // Date Navigation handlers
  const handlePrevDay = () => {
    const parts = selectedDateStr.split('-');
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    d.setDate(d.getDate() - 1);
    onChangeSelectedDate(getLocalDateString(d));
  };

  const handleNextDay = () => {
    const parts = selectedDateStr.split('-');
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    d.setDate(d.getDate() + 1);
    onChangeSelectedDate(getLocalDateString(d));
  };

  // Log Scheduled Zumba Routine
  const handleLogScheduledRoutine = async () => {
    if (!plan.workout) return;
    await logExerciseActivity({
      date: selectedDateStr,
      title: plan.workout.title,
      durationMins: plan.workout.duration,
      caloriesBurned: plan.workout.burnCals,
      method: `MET ${plan.workout.met} Zumba equation`
    });
    await loadData();
    confetti({ particleCount: 55, spread: 60, origin: { y: 0.6 } });
    alert(`Logged ${plan.workout.title} (${plan.workout.duration} mins)! ~${plan.workout.burnCals} kcal added.`);
  };

  // Save Custom Activity
  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    const weight = profile.weightKg || 86.2;
    const computedCals = overrideCalories !== '' 
      ? Number(overrideCalories) 
      : calculateMetCalories(intensityMet, weight, durationMins);

    await logExerciseActivity({
      date: selectedDateStr,
      title: activityTitle,
      durationMins,
      caloriesBurned: computedCals,
      method: overrideCalories !== '' ? 'Wearable estimate' : `MET ${intensityMet} calculation`,
      notes: activityNotes
    });

    setIsLogModalOpen(false);
    setActivityNotes('');
    setOverrideCalories('');
    await loadData();
    confetti({ particleCount: 45, spread: 50, origin: { y: 0.6 } });
  };

  const handleDeleteActivity = async (id: number) => {
    if (confirm('Delete this dance or exercise activity entry?')) {
      await db.activityLogs.delete(id);
      await loadData();
    }
  };

  // Quick Curated YouTube Channels / Queries
  const curatedDanceSearches = [
    { title: 'Bollywood Zumba (15-20m)', query: 'bollywood+zumba+dance+workout+for+beginners+15+mins', color: 'from-amber-500 to-roseDust-500' },
    { title: 'Latin Fiesta Dance', query: 'easy+latin+zumba+dance+fitness+fun+beginners', color: 'from-roseDust-500 to-plum-600' },
    { title: 'Knee-Friendly No Jumping', query: 'low+impact+zumba+dance+workout+no+jumping+for+beginners', color: 'from-emerald-600 to-teal-600' },
    { title: '10-Min Quick Dance Break', query: '10+minute+dance+party+workout+burn+calories+fun', color: 'from-lavenderSoft-600 to-plum-700' },
  ];

  return (
    <div className="space-y-6 pb-24 animate-fadeIn max-w-4xl mx-auto px-4 pt-3 font-sans">
      
      {/* Header with Date Navigation */}
      <div className="rounded-3xl bg-white p-5 border border-cream-300 shadow-soft">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="p-2.5 bg-roseDust-100 text-roseDust-600 rounded-2xl">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-plum-950 flex items-center space-x-2">
                <span>Daily Zumba & Dance Sessions</span>
                <span className="text-roseDust-500 text-lg">💃</span>
              </h2>
              <p className="text-xs sm:text-sm text-plum-500">
                Joyful YouTube follow-alongs • Zero gym pressure • Strict Rest Means Rest
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevDay}
              className="p-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-plum-800 border border-cream-300"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-plum-900 bg-cream-50 px-3 py-1.5 rounded-xl border border-cream-200">
              {formatDisplayDate(selectedDateStr, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <button
              onClick={handleNextDay}
              className="p-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-plum-800 border border-cream-300"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekly Exercise Minutes KPI Banner */}
        <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-plum-900 block text-sm flex items-center space-x-1.5">
              <span>7-Day Dance & Movement Total:</span>
              <span className="text-roseDust-600">{weeklyMinutes} Minutes</span>
            </span>
            <p className="text-[11px] text-plum-500 mt-0.5">
              Target: 60–100 minutes of fun, mood-boosting Zumba weekly for metabolic momentum without cortisol spikes.
            </p>
          </div>

          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-plum-900 hover:bg-plum-950 text-white rounded-xl font-bold shadow-2xs transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Log Dance / Activity</span>
          </button>
        </div>
      </div>

      {/* TODAY'S SCHEDULED ZUMBA ROUTINE OR REST DAY */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 border border-cream-300 shadow-soft">
        {plan.isRestDay ? (
          /* STRICT REST DAY SECTION */
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-cream-50 to-emerald-50/50 border border-emerald-200 text-center sm:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
              <Bed className="w-4 h-4" />
              <span>SCHEDULED REST DAY — REST MEANS REST ❤️</span>
            </div>

            <h3 className="font-serif font-bold text-xl sm:text-2xl text-emerald-950">
              Honoring Rest & Physical Recovery
            </h3>
            
            <p className="text-xs sm:text-sm text-emerald-900 mt-2 leading-relaxed max-w-2xl">
              {plan.restReason}
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-emerald-950">
              <div className="p-3 bg-white/80 rounded-2xl border border-emerald-200">
                <span className="font-bold block">No Dance Routine Assigned</span>
                <span className="text-[11px] text-emerald-800">0 minutes required</span>
              </div>
              <div className="p-3 bg-white/80 rounded-2xl border border-emerald-200">
                <span className="font-bold block">No Step Target</span>
                <span className="text-[11px] text-emerald-800">Zero pressure to move</span>
              </div>
              <div className="p-3 bg-white/80 rounded-2xl border border-emerald-200">
                <span className="font-bold block">Zero Calorie Burn Goal</span>
                <span className="text-[11px] text-emerald-800">Never exercise to "burn off" food</span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-700 italic mt-3">
              Put your feet up, sip herbal tea, and let your body restore itself. Consistency means recovering well.
            </p>
          </div>
        ) : (
          /* SCHEDULED ZUMBA SESSION */
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-roseDust-700 bg-roseDust-100 px-2.5 py-0.5 rounded-full">
                    Day {plan.day} of 240 • Daily Zumba
                  </span>
                  <span className="text-xs font-semibold text-plum-500">
                    {plan.workout?.style}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-plum-950 mt-1">
                  {plan.workout?.title}
                </h3>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-lavenderSoft-50 text-lavenderSoft-700 border border-lavenderSoft-200">
                  ⏱️ {plan.workout?.duration} Mins
                </span>
                <span className="px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  🔥 ~{plan.workout?.burnCals} kcal
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-plum-600 leading-relaxed bg-cream-50/70 p-3 rounded-2xl border border-cream-200">
              {plan.workout?.instructions}
            </p>

            {/* Zumba Flow Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200">
                <span className="font-bold text-plum-900 block mb-1">🎵 Warm-Up & Gentle Sway:</span>
                <p className="text-plum-600">{plan.workout?.warmup}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200">
                <span className="font-bold text-plum-900 block mb-1">🧘 Cool-Down & Deep Breathing:</span>
                <p className="text-plum-600">{plan.workout?.cooldown}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200 text-xs">
              <span className="font-bold text-plum-900 block mb-1">💃 Tracklist Rhythm & Movement Flow:</span>
              <p className="text-plum-700 font-medium leading-relaxed">{plan.workout?.exercises}</p>
              <p className="text-plum-500 text-[11px] mt-2 italic bg-white/70 p-2 rounded-xl border border-cream-200">
                🛡️ Low-Impact / Knee-Friendly Modifications: {plan.workout?.alternatives}
              </p>
            </div>

            {/* YouTube Direct Video Launcher & Completion Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href={plan.workout?.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-red-600 to-roseDust-600 hover:from-red-700 hover:to-roseDust-700 text-white rounded-2xl text-xs font-bold shadow-soft transition-all active:scale-98"
              >
                <Tv className="w-4 h-4" />
                <span>Watch Zumba Follow-Along on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <button
                onClick={handleLogScheduledRoutine}
                className="flex items-center justify-center space-x-2 py-3 px-6 bg-plum-900 hover:bg-plum-950 text-white rounded-2xl text-xs font-bold shadow-soft transition-all active:scale-95 shrink-0"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Session Completed</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CURATED DANCE SHELF & YOUTUBE DISCOVERY */}
      <div className="rounded-3xl bg-white p-5 border border-cream-300 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-roseDust-500" />
            <h3 className="font-serif font-bold text-sm sm:text-base text-plum-950">
              Curated Zumba YouTube Channels & Styles
            </h3>
          </div>
          <span className="text-[11px] text-plum-500">Pick any vibe today</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {curatedDanceSearches.map((dance, i) => (
            <a
              key={i}
              href={`https://www.youtube.com/results?search_query=${dance.query}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-cream-50 hover:bg-cream-100 border border-cream-200 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center space-x-2.5">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${dance.color} text-white flex items-center justify-center shrink-0`}>
                  <Play className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <span className="font-bold text-xs text-plum-900 group-hover:text-plum-950 block">
                    {dance.title}
                  </span>
                  <span className="text-[10px] text-plum-500">
                    Open YouTube Search →
                  </span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-cream-400 group-hover:text-plum-700" />
            </a>
          ))}
        </div>
      </div>

      {/* DAILY CALORIES BURNED TRACKER (ACTUAL LOGGED ACTIVITIES) */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 border border-cream-300 shadow-soft">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-cream-200">
          <div>
            <h3 className="font-serif font-bold text-base text-plum-950">
              Actual Dance & Movement Log for {formatDisplayDate(selectedDateStr, { month: 'short', day: 'numeric' })}
            </h3>
            <p className="text-[11px] text-plum-500">
              MET-based estimates (~5.0 MET for Zumba) • Wearable overrides allowed
            </p>
          </div>

          <span className="text-xs font-bold text-amber-600">
            Total Burn: {metrics?.exerciseCaloriesBurned || 0} kcal
          </span>
        </div>

        {!metrics?.loggedActivities.length ? (
          <div className="text-center py-8 space-y-2">
            <Music className="w-7 h-7 text-cream-400 mx-auto" />
            <p className="text-xs text-plum-600 font-medium">
              No dance or exercise activities logged for this date.
            </p>
            <p className="text-[11px] text-plum-400">
              Mark today's Zumba session as completed above, or add a custom dance.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-cream-100">
            {metrics.loggedActivities.map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-bold text-plum-950 flex items-center space-x-1.5">
                    <span>{act.title}</span>
                  </h4>
                  <p className="text-[11px] text-plum-500 mt-0.5">
                    Duration: {act.durationMins} mins • {act.notes || 'Joyful session'}
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className="font-bold text-amber-600">
                    {act.caloriesBurned ? `${act.caloriesBurned} kcal` : `${Math.round(5.0 * 86.2 * (act.durationMins / 60))} kcal`}
                  </span>

                  <button
                    onClick={() => handleDeleteActivity(act.id!)}
                    className="p-1.5 text-cream-400 hover:text-softCoral-600 hover:bg-softCoral-50 rounded-lg transition-colors"
                    title="Delete activity log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LOG EXTRA MOVEMENT / ZUMBA MODAL */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-plum-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-soft-lg border border-cream-300 animate-scaleUp">
            <h3 className="font-serif font-bold text-lg text-plum-950 mb-3 flex items-center space-x-2">
              <Music className="w-5 h-5 text-roseDust-500" />
              <span>Log Zumba Dance or Movement</span>
            </h3>

            <form onSubmit={handleSaveActivity} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-plum-800 block mb-1">Dance / Activity Name</label>
                <input
                  type="text"
                  required
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-plum-800 block mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    required
                    value={durationMins}
                    onChange={(e) => setDurationMins(Number(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-plum-800 block mb-1">Style / MET Intensity</label>
                  <select
                    value={intensityMet}
                    onChange={(e) => setIntensityMet(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300 font-medium"
                  >
                    <option value={5.0}>Bollywood Zumba Dance (MET 5.0)</option>
                    <option value={5.2}>Latin Fiesta Cardio Zumba (MET 5.2)</option>
                    <option value={4.8}>Low-Impact Joyful Dance (MET 4.8)</option>
                    <option value={5.5}>Celebration Dance Masterclass (MET 5.5)</option>
                    <option value={3.3}>Easy Living Room Walk (MET 3.3)</option>
                    <option value={3.8}>Brisk Walking (MET 3.8)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-plum-800 block mb-1">
                  Wearable Burn Override (Optional kcal)
                </label>
                <input
                  type="number"
                  placeholder={`Calculated estimate: ~${calculateMetCalories(intensityMet, profile.weightKg || 86.2, durationMins)} kcal`}
                  value={overrideCalories}
                  onChange={(e) => setOverrideCalories(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300 font-medium"
                />
                <span className="text-[10px] text-plum-500 mt-0.5 block">
                  Leave blank to use scientific MET formula for Deep's weight.
                </span>
              </div>

              <div>
                <label className="font-bold text-plum-800 block mb-1">Notes / Feeling</label>
                <input
                  type="text"
                  placeholder="e.g. Joyful playlist, felt energetic, danced in living room"
                  value={activityNotes}
                  onChange={(e) => setActivityNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-cream-50 border border-cream-300 font-medium"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-plum-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-plum-900 hover:bg-plum-950 text-white font-bold rounded-xl shadow-soft"
                >
                  Save Dance Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
