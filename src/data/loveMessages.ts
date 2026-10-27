import { LoveMessage, SharedActivity } from '../types';

export const LOVE_MESSAGES: LoveMessage[] = [
  {
    day: 1,
    title: 'Welcome to Day 1, My Love ❤️',
    message: 'I am so proud of you for choosing to take care of yourself. You never have to prove your worth to me through your weight, appearance, or workout intensity. I want you to feel healthier, stronger, and more confident, and I will support you with endless patience and love. We are a team, always.',
    partnerActionSuggestion: 'Offer to prepare a warm cup of ginger tea or bring a hot water bottle for her cramps today.',
    conversationPrompt: 'Would you prefer gentle company today, or some quiet rest time to recharge?'
  },
  {
    day: 2,
    title: 'One Gentle Step at a Time',
    message: 'Your body has carried you through every single chapter of life so far. It deserves appreciation, gentle movement, and nourishing food — never punishment. Rest whenever you need to; resting is part of the plan.',
    partnerActionSuggestion: 'Ask if she would like to take a slow 5-minute evening stroll together or just relax on the sofa.',
    conversationPrompt: 'What kind of support would feel most helpful for you this week?'
  },
  {
    day: 3,
    title: 'Consistency Without Guilt',
    message: 'Remember that showing up for yourself in small ways adds up to lifelong peace. Even drinking an extra glass of water or choosing a peaceful sleep wind-down is a huge victory.',
    partnerActionSuggestion: 'Notice and verbally appreciate one non-physical thing you love about her today.',
    conversationPrompt: 'How are you feeling emotionally today? Anything on your mind I can listen to?'
  },
  {
    day: 4,
    title: 'No Need for Perfection',
    message: 'Life will have busy days, cravings, and tired mornings. You don\'t need a perfect streak — just a forgiving heart that always welcomes you back.',
    partnerActionSuggestion: 'Offer to chop vegetables or wash dishes to make dinner preparation effortless for her.',
    conversationPrompt: 'Would you prefer words of encouragement, practical help with chores, or simply hugs today?'
  },
  {
    day: 5,
    title: 'Cheering for You Always',
    message: 'Seeing you prioritize your peace and stamina makes me admire you even more. You look radiant when you feel happy and grounded.',
    partnerActionSuggestion: 'Leave a sweet sticky note on her mirror or desk.',
    conversationPrompt: 'What meal made you feel most energized and satisfied this week?'
  }
];

export const SHARED_ACTIVITIES: SharedActivity[] = [
  {
    id: 'shared-stroll',
    title: 'Sunset Living Room or Park Stroll Together',
    category: 'walk_together',
    durationMins: 15,
    description: 'A relaxed walk with no tracking, no hurry, holding hands and chatting about your day.',
    completed: false
  },
  {
    id: 'shared-cooking',
    title: 'Cook a Nourishing South Indian Dinner Together',
    category: 'cook_meal',
    durationMins: 30,
    description: 'One person chops the vegetables/onions, the other seasons the dal/curry. Fun, cooperative teamwork in the kitchen.',
    completed: false
  },
  {
    id: 'shared-groceries',
    title: 'Mindful Fresh Market / Supermarket Trip',
    category: 'grocery_plan',
    durationMins: 25,
    description: 'Pick fresh local greens (palya), tender coconut water, and colorful seasonal fruits together.',
    completed: false
  },
  {
    id: 'shared-checkin',
    title: '10-Minute Sunday Heart-to-Heart',
    category: 'check_in',
    durationMins: 10,
    description: 'A cozy tea conversation answering: "What felt joyful this week?" and "How can I support you next week?"',
    completed: false
  },
  {
    id: 'shared-rest',
    title: 'Cozy Restful Evening (Digital Detox)',
    category: 'restful_evening',
    durationMins: 45,
    description: 'Put phones aside, play calm lo-fi instrumental music, and unwind peacefully together.',
    completed: false
  }
];

export function getLoveMessageForDay(day: number): LoveMessage {
  const match = LOVE_MESSAGES.find(m => m.day === day);
  if (match) return match;
  // Return rotating supportive message
  const index = (day - 1) % LOVE_MESSAGES.length;
  return {
    ...LOVE_MESSAGES[index],
    day,
    title: `Day ${day} With You ❤️`
  };
}
