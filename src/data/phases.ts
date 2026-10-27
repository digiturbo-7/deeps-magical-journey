import { JourneyPhase } from '../types';

export const JOURNEY_PHASES: JourneyPhase[] = [
  {
    phaseNumber: 1,
    title: 'Phase 1: Gentle Foundations & Body Awareness',
    tagline: 'Finding your rhythm with kindness, not pressure',
    dayRange: [1, 14],
    description: 'We begin by establishing a comfortable baseline. Focus on tuning into your hunger cues, drinking water regularly, taking gentle 10–15 minute walks, and learning how kitchen scales make portion awareness simple and guilt-free.',
    focusAreas: [
      'Establishing a calm morning & evening routine',
      'Comfortable 10–13 minute walking (treadmill or outdoor stroll)',
      'Balancing meals with protein and palya/vegetables',
      'Honoring rest, especially on menstrual bleed days'
    ],
    mindsetNote: 'Remember: Showing up gently today is a 100% win. You do not need to push or suffer to make meaningful progress.'
  },
  {
    phaseNumber: 2,
    title: 'Phase 2: Building Loving Consistency',
    tagline: 'Turning gentle habits into natural daily rhythm',
    dayRange: [15, 45],
    description: 'Consistently moving for 15–18 minutes, exploring simple chair-supported movements, enjoying balanced South Indian home meals, and learning to plan meals with leftovers.',
    focusAreas: [
      'Extending treadmill walking to 15–18 minutes comfortably',
      'Beginning light chair squats and posture mobility',
      'Building confidence weighing dry vs cooked home food',
      'Weekly reflections with your partner'
    ],
    mindsetNote: 'Consistency does not mean perfection. A 5-minute walk on a tired day is a triumph of consistency.'
  },
  {
    phaseNumber: 3,
    title: 'Phase 3: Stamina, Mobility & Strength',
    tagline: 'Feeling stronger and more capable in your body',
    dayRange: [46, 90],
    description: 'Your energy levels begin to lift noticeably. We introduce low-impact bodyweight strength, slight treadmill variations (when you feel energetic), and delicious higher-protein Indian options.',
    focusAreas: [
      'Alternating comfortable walking days with mobility & recovery days',
      'Low-impact standing balance and glute activation',
      'Mastering healthy non-veg & vegetarian protein pairings',
      'Celebrating non-scale victories: climbing stairs easily, deeper sleep'
    ],
    mindsetNote: 'Strength is not about muscle soreness; it is about feeling energized to live your life with joy.'
  },
  {
    phaseNumber: 4,
    title: 'Phase 4: Adaptive Flow & Life Integration',
    tagline: 'Your wellness adapts to your schedule, not vice versa',
    dayRange: [91, 150],
    description: 'Life gets busy, festivals happen, and seasons change. Here we master flexible meal templates, navigating family dinners without stress, and maintaining baseline movement effortlessly.',
    focusAreas: [
      'Flexible eating: enjoying biryani or restaurant meals guilt-free',
      'Using Minimum Viable Days whenever work or life feels demanding',
      'Symptom-adapted workouts across all 4 menstrual cycle phases',
      'Reinforcing emotional check-ins and box breathing'
    ],
    mindsetNote: 'Food is culture, joy, and fuel. No single meal can undo weeks of self-care.'
  },
  {
    phaseNumber: 5,
    title: 'Phase 5: Sustainable Habits & Self-Trust',
    tagline: 'Deepening confidence in your body and choices',
    dayRange: [151, 210],
    description: 'We consolidate your habits so they feel second nature. You understand your portion sizes intuitively, know how your cycle affects your energy, and communicate your needs with ease.',
    focusAreas: [
      'Intuitive portion estimation backed by scale confidence',
      'Consistent 20-minute movement sessions at your own pace',
      'Prioritizing restful sleep wind-downs and stress release',
      'Shared couple activities that nurture connection'
    ],
    mindsetNote: 'You are no longer "on a program"; you are living a caring, empowered lifestyle.'
  },
  {
    phaseNumber: 6,
    title: 'Phase 6: Celebration, Reflection & Lifelong Maintenance',
    tagline: 'Honoring your 240 days of loving transformation',
    dayRange: [211, 240],
    description: 'Reflecting on your incredible 240-day journey. Celebrating stamina, confidence, mental clarity, and peace with food, and designing your personalized maintenance compass for the years ahead.',
    focusAreas: [
      'Reviewing your non-scale victories and habit milestones',
      'Creating your personalized permanent wellness routine',
      'Partner celebration dinner and heartfelt appreciation',
      'Carrying forward self-compassion for life'
    ],
    mindsetNote: 'Day 240 is not a finish line — it is the blossoming of the strong, vibrant, confident woman you have nurtured every single day.'
  }
];

export function getPhaseForDay(day: number): JourneyPhase {
  const clampedDay = Math.max(1, Math.min(240, day));
  return JOURNEY_PHASES.find(p => clampedDay >= p.dayRange[0] && clampedDay <= p.dayRange[1]) || JOURNEY_PHASES[0];
}
