// Daily Personalized Diet Plan Generator & Storage Service
// Tailored for DEEPS MAGICAL JOURNEY ❤️
// Calibrated for: Age 25, Height 158 cm (confirmed), Current Weight 86.2 kg, South Indian / Bengaluru cuisine

import { db } from '../db';
import { DailyPersonalizedDietPlan, MealSlotPlan, MealAlternative, UserProfile } from '../types';
import { formatDisplayDate } from '../utils/dateUtils';

// 4 distinct daily rotating menus to ensure variety across days
interface DailyMenuBlueprint {
  breakfastOptions: MealAlternative[];
  lunchOptions: MealAlternative[];
  snackOptions: MealAlternative[];
  dinnerOptions: MealAlternative[];
  quickTip: string;
}

const MENU_ROTATIONS: DailyMenuBlueprint[] = [
  // Menu 1: Idli + Chicken Curry + Roasted Chana + Phulkas
  {
    breakfastOptions: [
      {
        id: 'b-1',
        title: 'Steamed Idlis with Vegetable Sambar & Boiled Eggs',
        description: 'Soft fluffy steamed idlis with piping hot home-style toor dal sambar and 2 farm eggs.',
        isVeg: false,
        portionRaw: 'Batter: 100g (~4 tbsp) • Sambar dal: 30g raw toor dal • 2 whole eggs',
        portionCooked: '2–3 medium Idlis (~110g) + 150ml Vegetable Sambar + 2 Boiled Eggs (~100g)',
        approxCalories: 340,
        approxProteinG: 19,
        scaleTip: 'Place bowl on scale, press Tare/Zero, and pour 150g warm sambar.',
        substitutions: 'Vegetarian swap: Replace eggs with 1 cup warm sprouted moong salad (100g) with lemon.'
      },
      {
        id: 'b-2',
        title: 'Bengaluru Vegetable Upma with Roasted Peanuts',
        description: 'Traditional semolina/rava upma tempered with mustard, curry leaves, carrots & beans.',
        isVeg: true,
        portionRaw: 'Raw Rava: 45g • Mixed diced vegetables: 80g • Peanuts: 10g',
        portionCooked: '1.5 cups cooked Upma (~180g) + 1 tbsp Coconut chutney (20g)',
        approxCalories: 310,
        approxProteinG: 10,
        scaleTip: 'Weigh 45g dry rava before cooking to ensure perfect portion control.',
        substitutions: 'Pair with 1 glass of toned warm milk (150ml) for extra protein.'
      },
      {
        id: 'b-3',
        title: 'Rolled Oats or Muesli with Toned Milk & Apple',
        description: 'Warm, gut-friendly rolled oats cooked in low-fat milk topped with sliced fresh apple.',
        isVeg: true,
        portionRaw: 'Dry Oats/Muesli: 40g • Toned milk: 180ml • 1/2 Apple (~60g)',
        portionCooked: '1 deep bowl warm oatmeal (~240g) with cinnamon sprinkle',
        approxCalories: 290,
        approxProteinG: 12,
        scaleTip: 'Zero kitchen scale with cereal bowl, pour exactly 40g dry oats.',
        substitutions: 'Can swap cow milk with fresh plant-based almond milk or 100g fresh curd.'
      }
    ],
    lunchOptions: [
      {
        id: 'l-1',
        title: 'Sona Masoori Rice + Bengaluru Chicken Curry + Beans Palya',
        description: 'Tender home-cooked chicken simmered in mild coconut-coriander gravy with rice and fiber-rich beans.',
        isVeg: false,
        portionRaw: 'Raw Rice: 55g • Raw Boneless Chicken: 130g • Raw Beans: 120g',
        portionCooked: 'Cooked Rice: 150g (1 medium katori) + Cooked Chicken: ~95g edible meat + Beans Palya: 140g + Rasam: 100ml',
        approxCalories: 480,
        approxProteinG: 34,
        scaleTip: 'Zero plate on scale, spoon 150g warm rice, then weigh 95g cooked tender chicken.',
        substitutions: 'If chicken is unavailable: swap with 100g paneer cubes or 2 boiled eggs + 1 cup thick dal.',
        meatEdibleNote: 'Portion is 130g boneless edible meat. If bone-in cuts are used, weigh ~180g raw.'
      },
      {
        id: 'l-2',
        title: 'Warm Wheat Chapatis + Homestyle Egg Curry + Cabbage Poriyal',
        description: 'Two soft whole wheat chapatis with two eggs poached or boiled in tomato-onion gravy.',
        isVeg: false,
        portionRaw: 'Atta/Whole Wheat Flour: 60g • 2 whole eggs • Cabbage & peas: 140g',
        portionCooked: '2 Chapatis (~80g cooked) + Egg Curry (2 eggs + 100ml gravy) + Cabbage Poriyal: 140g',
        approxCalories: 450,
        approxProteinG: 22,
        scaleTip: 'Weigh 60g dry flour when kneading dough to ensure 2 perfectly sized rotis.',
        substitutions: 'Swap 1 egg with 50g fresh tofu or paneer if you prefer a lighter curry.'
      },
      {
        id: 'l-3',
        title: 'Rice + Thick Toor Dal Tadka + Palak Palya + Fresh Curd',
        description: 'Traditional vegetarian comfort meal packed with plant protein, iron, and gut-healthy probiotics.',
        isVeg: true,
        portionRaw: 'Raw Rice: 55g • Raw Toor Dal: 40g • Fresh Spinach/Palak: 150g • Curd: 100g',
        portionCooked: 'Cooked Rice: 150g + Thick Dal: 180g + Palak Palya: 140g + Curd: 100g',
        approxCalories: 440,
        approxProteinG: 20,
        scaleTip: 'Zero bowl and weigh 100g of fresh curd for optimal probiotic balance.',
        substitutions: 'Can substitute toor dal with moong dal or chana dal.'
      }
    ],
    snackOptions: [
      {
        id: 's-1',
        title: 'Roasted Chana (Puri Kadale) + 1 Tender Coconut Water',
        description: 'Crunchy slow-roasted chana high in protein and fiber, paired with natural electrolyte-rich elaneeru.',
        isVeg: true,
        portionRaw: 'Dry Roasted Chana: 30g • 1 fresh tender coconut water (~200ml)',
        portionCooked: 'Ready to eat: 30g roasted chana + 1 glass coconut water',
        approxCalories: 150,
        approxProteinG: 6,
        scaleTip: 'Measure 30g roasted chana in a small snack katori.',
        substitutions: 'Swap coconut water with warm ginger green tea or mild buttermilk.'
      },
      {
        id: 's-2',
        title: '1 Boiled Egg with Pepper + 10 Soaked Almonds',
        description: 'Quick protein boost that curbs late afternoon fatigue and keeps blood sugar stable.',
        isVeg: false,
        portionRaw: '1 large egg • 10 whole raw almonds (soaked & peeled)',
        portionCooked: '1 hard/soft boiled egg (~50g) + 10 almonds (~12g)',
        approxCalories: 160,
        approxProteinG: 9,
        scaleTip: 'Pre-boil 2 eggs in the morning so afternoon snack is zero effort.',
        substitutions: 'Vegetarians can enjoy 1 small cup (100g) plain Greek yogurt or roasted makhana.'
      },
      {
        id: 's-3',
        title: 'Fresh Guava or Apple Slices with Chat Masala',
        description: 'Crisp Bengaluru guava or juicy apple providing natural vitamin C and slow-digesting pectin fiber.',
        isVeg: true,
        portionRaw: '1 medium fruit (~130g edible weight)',
        portionCooked: '130g sliced fresh fruit with a dash of jeera powder & black salt',
        approxCalories: 80,
        approxProteinG: 1.5,
        scaleTip: 'Weigh whole fruit on scale before slicing (~130g).',
        substitutions: 'Can swap with 1 cup diced fresh papaya (120g).'
      }
    ],
    dinnerOptions: [
      {
        id: 'd-1',
        title: '2 Soft Phulkas + Pan-Seared Chicken Breast + Tomato Rasam',
        description: 'Light, comforting evening meal that supports overnight muscle recovery without feeling heavy.',
        isVeg: false,
        portionRaw: 'Atta: 60g • Raw Boneless Chicken: 120g • Tomato & spices: 100g',
        portionCooked: '2 Phulkas (oil-free, ~75g) + Grilled Chicken: ~85g cooked + Piping hot Rasam: 150ml',
        approxCalories: 410,
        approxProteinG: 32,
        scaleTip: 'Zero skillet or plate, weigh 85g cooked chicken pieces.',
        substitutions: 'Vegetarian swap: 80g pan-seared paneer or 150g cooked soya chunk curry.',
        meatEdibleNote: 'Edible boneless chicken portion. If bone-in, use ~160g raw.'
      },
      {
        id: 'd-2',
        title: 'Warm Moong Dal Khichdi + Fresh Curd + Steamed Green Beans',
        description: 'Soothing one-pot comfort food, gentle on digestion and perfect after an active day.',
        isVeg: true,
        portionRaw: 'Raw Rice: 35g • Raw Yellow Moong Dal: 35g • Ghee: 1 tsp (5g)',
        portionCooked: '1.5 cups cooked Khichdi (~200g) + Curd: 100g + Steamed beans: 80g',
        approxCalories: 390,
        approxProteinG: 16,
        scaleTip: 'Weigh 200g warm khichdi into a wide dinner bowl.',
        substitutions: 'Add finely chopped carrots and beans directly into the pressure cooker.'
      },
      {
        id: 'd-3',
        title: '1 Ragi Roti / Ragi Mudde + Steamed Mixed Veg Sambar + 1 Egg White',
        description: 'Traditional Karnataka calcium-rich ragi served hot with flavorful vegetable sambar.',
        isVeg: false,
        portionRaw: 'Ragi Flour: 50g • Mixed sambar veggies: 100g • 1 egg white',
        portionCooked: '1 medium Ragi Roti (~85g) + Hot Sambar: 180ml + 1 Boiled Egg White (~33g)',
        approxCalories: 370,
        approxProteinG: 14,
        scaleTip: 'Weigh 50g ragi flour dry when mixing with warm water.',
        substitutions: 'Vegetarians can omit egg white and add 2 tbsp boiled green peas to sambar.'
      }
    ],
    quickTip: 'Cook extra chicken or sambar at lunch to enjoy an effortless, delicious dinner without kitchen fatigue.'
  },

  // Menu 2: Dosa + Fish Curry + Sprout Kosambari + Phulkas with Dal
  {
    breakfastOptions: [
      {
        id: 'b-1',
        title: 'Crispy Ragi or Plain Dosa with Mint Chutney & Egg Bhurji',
        description: 'Golden fermented dosa paired with fresh mint-coriander chutney and protein-rich egg scramble.',
        isVeg: false,
        portionRaw: 'Dosa batter: 90g • 2 whole eggs • Onion & tomato: 50g',
        portionCooked: '2 small Dosa (~85g) + 2 tbsp Mint Chutney (30g) + 2-Egg Bhurji (~100g)',
        approxCalories: 350,
        approxProteinG: 18,
        scaleTip: 'Weigh 90g batter in a small ladle before spreading on hot tawa.',
        substitutions: 'Vegetarian swap: Replace egg bhurji with 60g scrambled paneer or 1 cup sprout salad.'
      },
      {
        id: 'b-2',
        title: 'Poha with Roasted Peanuts, Curry Leaves & Lemon',
        description: 'Light flattened rice tempered South Indian style with turmeric, mustard, green chilies and lemon.',
        isVeg: true,
        portionRaw: 'Dry Poha: 45g • Peanuts: 12g • Onion & peas: 60g',
        portionCooked: '1.5 cups prepared Poha (~170g) + 1 glass buttermilk (150ml)',
        approxCalories: 320,
        approxProteinG: 9,
        scaleTip: 'Weigh 45g dry poha in strainer before rinsing with water.',
        substitutions: 'Add 1 boiled egg on the side for an effortless protein upgrade.'
      },
      {
        id: 'b-3',
        title: 'Idlis with Flaxseed Podi & Vegetable Sambar',
        description: 'Steamed rice-urad dal idlis sprinkled with nutrient-rich flaxseed podi and served with sambar.',
        isVeg: true,
        portionRaw: 'Batter: 100g • Flaxseed podi: 1 tsp (5g) • Sambar dal: 30g',
        portionCooked: '2–3 Idlis (~110g) + 150ml Sambar + 1 tsp Podi with drop of ghee',
        approxCalories: 310,
        approxProteinG: 11,
        scaleTip: 'Use kitchen scale to ensure 1 tsp (5g) podi for rich omega-3 benefits.',
        substitutions: 'Serve with 1 cup warm toned milk (150ml).'
      }
    ],
    lunchOptions: [
      {
        id: 'l-1',
        title: 'Steamed Rice + Coastal Fish Curry + Cucumber Kosambari',
        description: 'Fresh fish cooked in tangy kokum and tomato gravy, served over steaming rice with cooling salad.',
        isVeg: false,
        portionRaw: 'Raw Rice: 55g • Raw Fresh Fish (Rohu/Seer/Mackerel): 130g • Cucumber: 100g',
        portionCooked: 'Cooked Rice: 150g + Fish Curry: ~100g edible fish meat + Kosambari: 100g',
        approxCalories: 460,
        approxProteinG: 32,
        scaleTip: 'Weigh raw cleaned fish fillets (~130g) before dropping into bubbling gravy.',
        substitutions: 'If fish is not available: substitute with 130g raw chicken or 100g fresh paneer.',
        meatEdibleNote: 'Portion is 130g raw boneless fish fillets (yielding ~100g cooked edible fish).'
      },
      {
        id: 'l-2',
        title: 'Rice + Chicken Sukka (Dry Roasted) + Tomato Rasam + Palya',
        description: 'Flavorful Mangalore/Bengaluru style roasted chicken with warm rasam rice and seasonal beans.',
        isVeg: false,
        portionRaw: 'Raw Rice: 55g • Raw Chicken: 130g • Beans/Carrots: 120g',
        portionCooked: 'Cooked Rice: 150g + Chicken Sukka: ~90g cooked + Rasam: 120ml + Palya: 120g',
        approxCalories: 490,
        approxProteinG: 35,
        scaleTip: 'Tare plate, measure 150g cooked rice and 90g succulent chicken sukka.',
        substitutions: 'Swap chicken with soya chunks (40g dry soya boiled and sautéed).'
      },
      {
        id: 'l-3',
        title: '2 Chapatis + Mixed Vegetable Sambar + Paneer Bhurji',
        description: 'Wholesome vegetarian meal with fresh paneer scramble and fiber-loaded vegetable sambar.',
        isVeg: true,
        portionRaw: 'Whole wheat flour: 60g • Low fat Paneer: 80g • Mixed veggies: 120g',
        portionCooked: '2 Chapatis (~80g) + Paneer Bhurji (~90g) + Sambar: 150ml',
        approxCalories: 460,
        approxProteinG: 22,
        scaleTip: 'Cut 80g paneer block on kitchen scale before crumbling.',
        substitutions: 'Can swap paneer with 2 scrambled whole eggs.'
      }
    ],
    snackOptions: [
      {
        id: 's-1',
        title: 'Sprouted Moong Kosambari with Lemon & Grated Coconut',
        description: 'Crunchy raw sprouted green moong tossed with chopped cucumber, coriander, lemon and a hint of coconut.',
        isVeg: true,
        portionRaw: 'Sprouted Moong: 70g • Grated coconut: 1 tsp (5g) • Cucumber: 50g',
        portionCooked: '1 cup prepared fresh Kosambari (~120g)',
        approxCalories: 130,
        approxProteinG: 8,
        scaleTip: 'Weigh 70g sprouted moong for an antioxidant and enzyme powerhouse.',
        substitutions: 'Can add 2 tbsp boiled sweet corn or pomegranate arils.'
      },
      {
        id: 's-2',
        title: 'Roasted Makhana (Foxnuts) with Pepper + Warm Green Tea',
        description: 'Light, crunchy makhana roasted in 1/2 tsp ghee with rock salt and freshly cracked black pepper.',
        isVeg: true,
        portionRaw: 'Raw Makhana: 25g • Ghee: 1/2 tsp (2.5g)',
        portionCooked: '1 large bowl roasted makhana (~27g) + 1 cup warm green tea',
        approxCalories: 120,
        approxProteinG: 3.5,
        scaleTip: '25g makhana fills a very generous 2-cup volume bowl.',
        substitutions: 'Swap with 30g roasted chana.'
      },
      {
        id: 's-3',
        title: '1 Boiled Egg + 1 Glass Cold Spiced Buttermilk (Chaas)',
        description: 'Refreshing probiotic churned curd tempered with ginger, green chili, and hing, paired with boiled egg.',
        isVeg: false,
        portionRaw: '1 large egg • Fresh curd: 60g diluted with 150ml water',
        portionCooked: '1 Boiled Egg (~50g) + 1 glass cold buttermilk (~200ml)',
        approxCalories: 130,
        approxProteinG: 9,
        scaleTip: 'Weigh 60g curd before whisking with chilled water and spices.',
        substitutions: 'Pure veg: skip egg and take 15g roasted peanuts with buttermilk.'
      }
    ],
    dinnerOptions: [
      {
        id: 'd-1',
        title: '2 Phulkas + Homestyle Dal Makhani (No Heavy Cream) + Salad',
        description: 'Slow-cooked whole black urad and kidney beans in home tomato gravy, naturally rich in protein and iron.',
        isVeg: true,
        portionRaw: 'Atta: 60g • Mixed raw dal: 45g • Tomato/Spices: 80g',
        portionCooked: '2 Phulkas (~75g) + Thick Dal: 180g + Cucumber/Tomato slices: 80g',
        approxCalories: 420,
        approxProteinG: 18,
        scaleTip: 'Zero bowl, weigh 180g cooked comforting dal.',
        substitutions: 'Add 1 boiled egg white for extra lean protein.'
      },
      {
        id: 'd-2',
        title: 'Steamed Rice + Chicken Pepper Rasam + Beetroot Palya',
        description: 'Spicy pepper rasam with tender chicken pieces, proven to soothe fatigue and boost circulation.',
        isVeg: false,
        portionRaw: 'Raw Rice: 50g • Raw Chicken: 120g • Beetroot: 100g',
        portionCooked: 'Cooked Rice: 140g + Chicken Rasam: ~85g cooked meat + 150ml soup + Beetroot Palya: 100g',
        approxCalories: 430,
        approxProteinG: 31,
        scaleTip: 'Weigh 140g rice and enjoy hot rasam soup poured generously on top.',
        substitutions: 'Vegetarians can swap chicken with 100g paneer cubes cooked in rasam.'
      },
      {
        id: 'd-3',
        title: '2 Warm Chapatis + Methi Egg Bhurji + Curd',
        description: 'Iron-rich fresh fenugreek leaves scrambled with eggs and served with soft rotis.',
        isVeg: false,
        portionRaw: 'Atta: 60g • Fresh Methi leaves: 60g • 2 eggs • Curd: 60g',
        portionCooked: '2 Chapatis (~80g) + Methi Egg Scramble (~110g) + Curd: 60g',
        approxCalories: 430,
        approxProteinG: 22,
        scaleTip: 'Weigh 60g fresh curd in a small katori to aid nighttime digestion.',
        substitutions: 'Swap eggs with 80g grated paneer.'
      }
    ],
    quickTip: 'Soak your lentils or sprouts in the morning so they cook in under 10 minutes at night.'
  }
];

// Generates warm, loving greeting tailored to journey day and tone
function generateGreeting(day: number, cycleDay: number): string {
  const greetings = [
    `Good morning, Baby ❤️! Today is Day ${day} of your beautiful journey. Every small meal and every glass of water is a gift of health and energy to your body.`,
    `Happy Day ${day}, my love ❤️! Remember that consistency is built with patience and kindness, not restriction. We are taking this one delicious home meal at a time.`,
    `Rise and shine, sweet Deep ❤️! Welcome to Day ${day}. Let's nourish your body with wholesome Bengaluru food that tastes amazing and leaves you feeling light and energized.`,
    `Good morning, my love ❤️! Today on Day ${day}, remember that you don't have to be perfect — just showing up and enjoying your balanced meals is a complete victory.`
  ];
  return greetings[(day - 1) % greetings.length];
}

// Generates loving closing message
function generateClosingMessage(day: number): string {
  const closings = [
    `So proud of you, my love ❤️! Remember, resting is part of the plan and your body deserves nothing but gentle care. We're doing this together!`,
    `You are doing so wonderfully, Baby ❤️! Sleep deeply tonight knowing you took loving care of your body today. I love you!`,
    `Every gentle step and balanced plate counts, my love ❤️. Tomorrow is another fresh day to feel stronger, lighter, and happier together!`,
    `Celebrate your wins today, Baby ❤️! Big or small, every mindful meal is building your lifelong health and radiant energy. Always right here beside you!`
  ];
  return closings[(day - 1) % closings.length];
}

// Formats full WhatsApp-ready message with emojis and structured text
export function formatWhatsAppMessage(plan: DailyPersonalizedDietPlan): string {
  const bOpt = plan.breakfast.options.find(o => o.id === plan.breakfast.selectedOptionId) || plan.breakfast.options[0];
  const lOpt = plan.lunch.options.find(o => o.id === plan.lunch.selectedOptionId) || plan.lunch.options[0];
  const sOpt = plan.snack.options.find(o => o.id === plan.snack.selectedOptionId) || plan.snack.options[0];
  const dOpt = plan.dinner.options.find(o => o.id === plan.dinner.selectedOptionId) || plan.dinner.options[0];

  let msg = `${plan.heading}\n\n`;
  msg += `${plan.greeting}\n\n`;
  msg += `🎯 *Daily Nutrition Balance (Weight: 86.2 kg):*\n`;
  msg += `• Target Deficit Range: ~${plan.targetCaloriesApprox}\n`;
  msg += `• Lean Protein Target: ~${plan.targetProteinApprox}\n`;
  msg += `• Kitchen Scale Rule: Weigh foods on plate with tare zeroed!\n\n`;

  msg += `🍳 *BREAKFAST (Morning • 9:00 AM)*\n`;
  msg += `• *Choice:* ${bOpt.title}\n`;
  msg += `• *Raw/Dry:* ${bOpt.portionRaw}\n`;
  msg += `• *On Plate (Cooked):* ${bOpt.portionCooked}\n`;
  msg += `• *Scale Tip:* ${bOpt.scaleTip}\n\n`;

  msg += `🍛 *LUNCH (Midday • 1:30 PM)*\n`;
  msg += `• *Choice:* ${lOpt.title}\n`;
  msg += `• *Raw/Dry:* ${lOpt.portionRaw}\n`;
  msg += `• *On Plate (Cooked):* ${lOpt.portionCooked}\n`;
  if (lOpt.meatEdibleNote) {
    msg += `• *Edible Meat Note:* ${lOpt.meatEdibleNote}\n`;
  }
  msg += `• *Scale Tip:* ${lOpt.scaleTip}\n\n`;

  msg += `☕ *EVENING SNACK (5:30 PM)*\n`;
  msg += `• *Choice:* ${sOpt.title}\n`;
  msg += `• *Portion:* ${sOpt.portionCooked}\n`;
  msg += `• *Scale Tip:* ${sOpt.scaleTip}\n\n`;

  msg += `🥗 *DINNER (Night • 8:30 PM)*\n`;
  msg += `• *Choice:* ${dOpt.title}\n`;
  msg += `• *Raw/Dry:* ${dOpt.portionRaw}\n`;
  msg += `• *On Plate (Cooked):* ${dOpt.portionCooked}\n`;
  if (dOpt.meatEdibleNote) {
    msg += `• *Edible Meat Note:* ${dOpt.meatEdibleNote}\n`;
  }
  msg += `• *Scale Tip:* ${dOpt.scaleTip}\n\n`;

  msg += `💧 *Hydration:* ${plan.hydrationGuidance}\n`;
  msg += `🚶‍♀️ *Movement:* ${plan.movementGuidance}\n`;

  if (plan.periodSupportNote) {
    msg += `🌸 *Period Care:* ${plan.periodSupportNote}\n`;
  }

  msg += `\n${plan.closingLoveMessage}`;
  return msg;
}

// Main diet plan retrieval and generator
export async function getOrGenerateDietPlan(
  dateStr: string,
  journeyDay: number,
  profile: UserProfile,
  cycleDay: number = 1
): Promise<DailyPersonalizedDietPlan> {
  // 1. Check if plan already exists for this exact calendar date
  const existing = await db.personalizedDietPlans.where('date').equals(dateStr).first();
  if (existing) {
    return existing;
  }

  // 2. Select menu blueprint based on journey day
  const blueprintIndex = (journeyDay - 1) % MENU_ROTATIONS.length;
  const blueprint = MENU_ROTATIONS[blueprintIndex];

  // 3. Period-aware notes
  let periodNote: string | undefined = undefined;
  if (cycleDay >= 1 && cycleDay <= 5) {
    periodNote = `Cycle Day ${cycleDay}: Prioritize warm foods, extra iron (dal, palak, beetroot), tender coconut water, and rest whenever your body asks. Zero guilt! ❤️`;
  }

  const breakfastSlot: MealSlotPlan = {
    name: 'Breakfast',
    timeSuggestion: '09:00 AM',
    selectedOptionId: blueprint.breakfastOptions[0].id,
    options: blueprint.breakfastOptions,
    isCompleted: false
  };

  const lunchSlot: MealSlotPlan = {
    name: 'Lunch',
    timeSuggestion: '01:30 PM',
    selectedOptionId: blueprint.lunchOptions[0].id,
    options: blueprint.lunchOptions,
    isCompleted: false
  };

  const snackSlot: MealSlotPlan = {
    name: 'Evening Snack',
    timeSuggestion: '05:30 PM',
    selectedOptionId: blueprint.snackOptions[0].id,
    options: blueprint.snackOptions,
    isCompleted: false
  };

  const dinnerSlot: MealSlotPlan = {
    name: 'Dinner',
    timeSuggestion: '08:30 PM',
    selectedOptionId: blueprint.dinnerOptions[0].id,
    options: blueprint.dinnerOptions,
    isCompleted: false
  };

  const heading = `❤️ Today's Diet Plan — Day ${journeyDay} 🥗✨`;
  const greeting = generateGreeting(journeyDay, cycleDay);
  const closingLoveMessage = generateClosingMessage(journeyDay);

  const newPlan: DailyPersonalizedDietPlan = {
    date: dateStr,
    day: journeyDay,
    heading,
    greeting,
    targetCaloriesApprox: '1450 - 1550 kcal',
    targetProteinApprox: '75 - 85g',
    breakfast: breakfastSlot,
    lunch: lunchSlot,
    snack: snackSlot,
    dinner: dinnerSlot,
    hydrationGuidance: '8–10 glasses (2.2–2.5 Litres) of clean, room-temperature water or herbal warm infusions.',
    movementGuidance: cycleDay <= 2 
      ? '10–12 minutes restorative stroll or restful couch breathing. Resting is 100% productive!' 
      : '13–15 minutes comfortable living room rhythm walk or gentle outdoor stroll.',
    periodSupportNote: periodNote,
    closingLoveMessage,
    whatsappMessageText: '',
    createdAt: new Date().toISOString()
  };

  // Generate whatsapp message
  newPlan.whatsappMessageText = formatWhatsAppMessage(newPlan);

  // Save to Dexie
  const planId = await db.personalizedDietPlans.add(newPlan);
  newPlan.id = planId as number;

  return newPlan;
}

// Update selected meal option
export async function updateDietPlanMealSelection(
  dateStr: string,
  mealKey: 'breakfast' | 'lunch' | 'snack' | 'dinner',
  optionId: string
): Promise<DailyPersonalizedDietPlan | null> {
  const plan = await db.personalizedDietPlans.where('date').equals(dateStr).first();
  if (!plan) return null;

  plan[mealKey].selectedOptionId = optionId;
  plan.whatsappMessageText = formatWhatsAppMessage(plan);

  await db.personalizedDietPlans.put(plan);

  return plan;
}

// Toggle meal completion checkbox
export async function toggleDietPlanMealCompletion(
  dateStr: string,
  mealKey: 'breakfast' | 'lunch' | 'snack' | 'dinner',
  isCompleted: boolean
): Promise<DailyPersonalizedDietPlan | null> {
  const plan = await db.personalizedDietPlans.where('date').equals(dateStr).first();
  if (!plan) return null;

  plan[mealKey].isCompleted = isCompleted;

  await db.personalizedDietPlans.put(plan);

  return plan;
}

// Get all saved plans for History view
export async function getAllSavedDietPlans(): Promise<DailyPersonalizedDietPlan[]> {
  const list = await db.personalizedDietPlans.toArray();
  // Sort descending by date
  return list.sort((a, b) => b.date.localeCompare(a.date));
}
