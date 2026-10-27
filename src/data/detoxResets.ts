export interface DetoxResetPlan {
  id: string;
  name: string;
  durationLabel: string;
  tagline: string;
  scienceExplanation: string;
  guidelines: string[];
  sampleMeals: {
    breakfast: string;
    lunch: string;
    snack: string;
    dinner: string;
  };
  habitsToCheck: string[];
  reassuranceNote: string;
}

export const DETOX_RESET_PLANS: DetoxResetPlan[] = [
  {
    id: 'gentle-24h-reset',
    name: 'Gentle 24-Hour Reset',
    durationLabel: '1 Day',
    tagline: 'Simple hydration, whole home foods, and good sleep',
    scienceExplanation: 'Your liver, kidneys, skin, and digestive tract are already working 24/7 to filter and balance your system naturally. You do not need teas, juices, or cleanses. The best reset is giving your digestive organs easy-to-process, nutrient-dense home food.',
    guidelines: [
      'Drink water according to natural thirst (aim for 7-8 comfortable glasses)',
      'Include gentle plant fibre (beans palya, cucumber, cooked greens)',
      'Eat balanced protein at each meal so you feel pleasantly full',
      'Optional 10-15 minute easy walk for gentle blood circulation',
      'Prioritize winding down 30 minutes before bed with no blue screens'
    ],
    sampleMeals: {
      breakfast: 'Steamed Idlis (2 pcs) with mild coconut chutney or 1 boiled egg',
      lunch: 'Warm cooked rice (130g) + home toor dal/sambar + beans carrot palya',
      snack: 'Tender coconut water or small bowl of fresh papaya',
      dinner: '2 warm whole wheat chapatis + light chicken curry or paneer palya'
    },
    habitsToCheck: [
      'Drank water when thirsty',
      'Ate balanced home meals without rushing',
      'Went to bed at a restful hour'
    ],
    reassuranceNote: 'If the scale shows a higher number after a heavy meal or salt intake, it is simply temporary water retention. Water weight normalizes on its own.'
  },
  {
    id: 'two-day-balanced-reset',
    name: 'Two-Day Balanced Reset',
    durationLabel: '48 Hours',
    tagline: 'Resetting your natural appetite without skipping meals',
    scienceExplanation: 'After holidays, weddings, or heavy eating, your body never needs punishment or fasting. Starving signals emergency mode and increases cravings. Two days of regular, nourishing meals restore natural digestion seamlessly.',
    guidelines: [
      'Eat three regular meals; do not skip breakfast or lunch to "make up" for yesterday',
      'Keep heavy fried or ultra-processed snacks low, focusing on fresh curd and roasted chana',
      'No grueling workouts: keep movement pleasant, such as a 15-minute treadmill stroll',
      'Make a small batch of comforting dal or vegetable soup for quick leftovers'
    ],
    sampleMeals: {
      breakfast: 'Warm Vegetable Upma with a side of fresh homemade curd',
      lunch: 'Cooked rice + rich toor dal + cabbage palya + 1 boiled egg or tofu',
      snack: 'Handful of roasted chana (huri kadale) + green tea or warm water',
      dinner: 'Vegetable khichdi or 2 chapatis with egg bhurji and cucumber slices'
    },
    habitsToCheck: [
      'Zero skipped meals',
      'Took a 10-minute fresh air walk',
      'Honored full sensations without guilt'
    ],
    reassuranceNote: 'You did not "ruin" anything. Your body is incredibly resilient and balances out effortlessly.'
  },
  {
    id: 'period-friendly-reset',
    name: 'Period-Friendly Comfort Reset',
    durationLabel: 'Cycle Days 1-3',
    tagline: 'Nourishing iron, electrolytes, and deep pelvic rest',
    scienceExplanation: 'During menstruation, your uterine muscle contracts to shed its lining, which requires energy, magnesium, iron, and hydration. Fatigue and water retention are natural hormonal responses, not lack of fitness.',
    guidelines: [
      'Prioritize iron-rich foods (ragi roti, eggs, lean chicken, spinach/greens)',
      'Combine iron with vitamin C (squeeze fresh lemon on your dal or palya)',
      'Sip warm water, ginger tea, or tender coconut water to soothe pelvic cramping',
      'Choose gentle stretching (cat-cow, shoulder rolls) or 100% rest',
      'Keep a warm water bag on your lower tummy while resting'
    ],
    sampleMeals: {
      breakfast: 'Ragi Roti with mild dal, or 2 boiled eggs + 1 whole wheat toast',
      lunch: 'Steamed rice with iron-rich drumstick sambar + fresh curd for gut ease',
      snack: 'Warm turmeric ginger milk or 1 tender coconut water',
      dinner: 'Soft chapatis with gentle chicken stew or comforting moong dal khichdi'
    },
    habitsToCheck: [
      'Used warm pack / rested when cramps peaked',
      'Drank warm soothing fluids',
      'Spoke kindly to myself about my energy levels'
    ],
    reassuranceNote: 'Progesterone drop causes temporary fluid retention. Gaining 0.5-2 kg during your period is normal water weight and dissipates once your cycle passes.'
  },
  {
    id: 'daily-three-habits-reset',
    name: 'Daily 3 Healthy Habits Reset',
    durationLabel: 'Flexible',
    tagline: 'Three small wins that set up your entire day',
    scienceExplanation: 'Micro-habits trigger positive momentum without overwhelming your willpower. Even on low-energy days, doing three tiny supportive things keeps your self-trust alive.',
    guidelines: [
      'Habit 1: Morning hydration — 1 full glass of water right after waking up',
      'Habit 2: 10 minutes of gentle movement (stroll or gentle chair stretches)',
      'Habit 3: One colorful vegetable or palya on your lunch or dinner plate'
    ],
    sampleMeals: {
      breakfast: 'Your favorite breakfast (idli, upma, or eggs)',
      lunch: 'Any home meal with at least one generous scoop of vegetable palya',
      snack: 'Fresh seasonal fruit or tender coconut',
      dinner: 'Balanced dinner eaten before 9:00 PM for optimal sleep quality'
    },
    habitsToCheck: [
      'Morning glass of water',
      '10 minutes of movement or intentional rest',
      'Added veggies to my plate'
    ],
    reassuranceNote: 'No penalties. If you only do 1 habit today, celebrate that 1 win!'
  }
];
