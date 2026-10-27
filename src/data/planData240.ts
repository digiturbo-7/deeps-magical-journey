// HER JOURNEY 240 — Complete 240-Day Master Dataset with Daily Zumba Sessions
// Automatically generated for offline PWA operation with zero external dependencies.

export interface DayDietPlanItem {
  title: string;
  cals: number;
  protein: number;
  carbs: number;
  fat: number;
  cost: number;
  options: string[];
  instructions: string;
  substitutions: string;
}

export interface DayRecord240 {
  day: number;
  date: string;
  weekday: string;
  isRestDay: boolean;
  restReason: string;
  workout: {
    title: string;
    duration: number;
    burnCals: number;
    met: number;
    style?: string;
    instructions: string;
    warmup: string;
    cooldown: string;
    exercises: string;
    alternatives: string;
    youtubeTitle: string;
    youtubeUrl: string;
  } | null;
  diet: {
    menuName: string;
    breakfast: DayDietPlanItem;
    snackMorning: DayDietPlanItem;
    lunch: DayDietPlanItem;
    snackEvening: DayDietPlanItem;
    dinner: DayDietPlanItem;
    prePost: string;
    totalCals: number;
    totalP: number;
    totalC: number;
    totalF: number;
    totalCost: number;
  };
}

// 6 Balanced Indian Meal Templates (Rotated continuously across 240 days)
const MEAL_TEMPLATES = [
  {
    "menuName": "Comfort Steamed Staples & Bengaluru Chicken Curry",
    "breakfast": {
      "title": "Steamed Idlis (3 pcs, 110g) + Veg Sambar (150ml) + 2 Boiled Eggs (100g)",
      "cals": 340,
      "protein": 19,
      "carbs": 38,
      "fat": 12,
      "cost": 35,
      "options": [
        "Steamed Idlis (3 pcs, 110g) + Veg Sambar (150ml) + 2 Boiled Eggs (100g) [340 kcal, 19g P, 38g C, 12g F, \u20b935]",
        "Steamed Idlis (3 pcs) + Veg Sambar + 1 cup warm sprouted moong salad (100g) [310 kcal, 13g P, 46g C, 5g F, \u20b925]",
        "Ragi Dosa (2 medium, 120g) + Mint Chutney (30g) + 1 Boiled Egg [320 kcal, 14g P, 42g C, 11g F, \u20b928]"
      ],
      "instructions": "Steam idlis in idli cooker for 10-12 mins. Weigh 110g cooked on kitchen scale.",
      "substitutions": "Can swap toor dal sambar with moong dal or tomato rasam."
    },
    "snackMorning": {
      "title": "Tender Coconut Water (220ml) + Handful Roasted Chana (25g)",
      "cals": 130,
      "protein": 5,
      "carbs": 22,
      "fat": 2,
      "cost": 40,
      "options": [
        "Tender Coconut Water (220ml) + Handful Roasted Chana (25g) [130 kcal, 5g P, 22g C, 2g F, \u20b940]",
        "Fresh Papaya slices (150g) + 5 soaked almonds [110 kcal, 3g P, 22g C, 3g F, \u20b930]"
      ],
      "instructions": "Sip naturally. Roasting chana gives high-satiety crunch.",
      "substitutions": "Can use tender coconut malai in moderation (1-2 tbsp)."
    },
    "lunch": {
      "title": "Sona Masoori Rice (150g cooked / 55g raw) + Bengaluru Chicken Curry (130g raw / 95g cooked meat) + French Beans Palya (130g) + Pepper Rasam",
      "cals": 475,
      "protein": 34,
      "carbs": 48,
      "fat": 14,
      "cost": 75,
      "options": [
        "Sona Masoori Rice (150g cooked / 55g raw) + Bengaluru Chicken Curry (130g raw / 95g cooked meat) + French Beans Palya (130g) + Pepper Rasam [475 kcal, 34g P, 48g C, 14g F, \u20b975]",
        "2 Soft Wheat Phulkas (80g) + Homestyle Egg Curry (2 eggs in onion-tomato gravy) + Cabbage Poriyal (140g) [440 kcal, 21g P, 48g C, 16g F, \u20b940]",
        "Sona Masoori Rice (150g) + Thick Toor Dal Tadka (180g) + Paneer Palya (80g paneer) + Fresh Curd (100g) [480 kcal, 23g P, 54g C, 18g F, \u20b955]"
      ],
      "instructions": "Zero plate on scale, measure 150g warm rice, then add 95g cooked chicken meat without bones.",
      "substitutions": "Swap chicken with 85g paneer or 40g dry soya chunks if cooking vegetarian."
    },
    "snackEvening": {
      "title": "Spiced Boiled Sundal / Chickpeas (80g) with mustard tempering & lemon",
      "cals": 140,
      "protein": 7,
      "carbs": 22,
      "fat": 3,
      "cost": 20,
      "options": [
        "Spiced Boiled Sundal / Chickpeas (80g) with mustard tempering & lemon [140 kcal, 7g P, 22g C, 3g F, \u20b920]",
        "Roasted Makhana (30g) in 1/2 tsp ghee & rock salt [130 kcal, 3g P, 21g C, 3.5g F, \u20b925]"
      ],
      "instructions": "Boil soaked chickpeas with a pinch of turmeric. Toss with lemon juice.",
      "substitutions": "Can substitute chickpeas with boiled green peas or sweet corn."
    },
    "dinner": {
      "title": "2 Soft Whole Wheat Phulkas (75g) + Grilled/Pan Chicken Curry (100g meat) + Cucumber Tomato Salad (120g)",
      "cals": 420,
      "protein": 31,
      "carbs": 42,
      "fat": 12,
      "cost": 65,
      "options": [
        "2 Soft Whole Wheat Phulkas (75g) + Grilled/Pan Chicken Curry (100g meat) + Cucumber Tomato Salad (120g) [420 kcal, 31g P, 42g C, 12g F, \u20b965]",
        "2 Phulkas (75g) + Fresh Paneer Bhurji (90g paneer with capsicum & onion) + Tomato Clear Soup [440 kcal, 20g P, 42g C, 20g F, \u20b955]",
        "Warm Rice-Moong Dal Khichdi (220g) + Fresh Curd (100g) + Steamed Beetroot Poriyal (100g) [380 kcal, 14g P, 58g C, 8g F, \u20b935]"
      ],
      "instructions": "Make phulkas on hot tawa without oil. Squeeze fresh lemon over salad.",
      "substitutions": "Swap phulkas with 1 cup cooked oats khichdi or 2 small ragi rotis."
    },
    "prePost": "Optional Pre: 1 small banana (80g) [70 kcal] \u2022 Post: 1 glass warm toned milk with turmeric (180ml) [95 kcal, 6g P]",
    "totalCals": 1505,
    "totalP": 96,
    "totalC": 172,
    "totalF": 43,
    "totalCost": 235
  },
  {
    "menuName": "Iron-Rich Poha, Egg Curry & Golden Turmeric Phulkas",
    "breakfast": {
      "title": "Vegetable Poha (160g cooked) tempered with mustard & roasted peanuts (15g) + 1 Boiled Egg",
      "cals": 330,
      "protein": 13,
      "carbs": 44,
      "fat": 11,
      "cost": 28,
      "options": [
        "Vegetable Poha (160g cooked) tempered with mustard & roasted peanuts (15g) + 1 Boiled Egg [330 kcal, 13g P, 44g C, 11g F, \u20b928]",
        "Vegetable Poha (180g) + 1 glass warm toned milk (150ml) [310 kcal, 11g P, 48g C, 8g F, \u20b924]",
        "Rolled Oats cooked in milk (40g oats + 180ml toned milk) with half diced apple [290 kcal, 12g P, 45g C, 6g F, \u20b930]"
      ],
      "instructions": "Rinse thick poha in colander, drain well. Saut\u00e9 with onion, curry leaves, carrots & roasted peanuts.",
      "substitutions": "Can add 30g boiled green peas to poha for higher fibre."
    },
    "snackMorning": {
      "title": "Spiced Majjige / Buttermilk (220ml) with grated ginger & curry leaves",
      "cals": 45,
      "protein": 3,
      "carbs": 4,
      "fat": 1.5,
      "cost": 15,
      "options": [
        "Spiced Majjige / Buttermilk (220ml) with grated ginger & curry leaves [45 kcal, 3g P, 4g C, 1.5g F, \u20b915]",
        "1 Crisp Guava or Apple (130g) with pinch of rock salt [75 kcal, 1.5g P, 18g C, 0.5g F, \u20b920]"
      ],
      "instructions": "Whisk 60g homemade curd with 160ml cold water, pinch of roasted jeera powder and salt.",
      "substitutions": "Can add chopped fresh mint or coriander for digestive coolness."
    },
    "lunch": {
      "title": "2 Soft Phulkas (80g) + 2 Boiled Eggs in Onion-Tomato Gravy (120g gravy) + Ridge Gourd (Heerekayi) Palya (140g)",
      "cals": 450,
      "protein": 22,
      "carbs": 48,
      "fat": 17,
      "cost": 45,
      "options": [
        "2 Soft Phulkas (80g) + 2 Boiled Eggs in Onion-Tomato Gravy (120g gravy) + Ridge Gourd (Heerekayi) Palya (140g) [450 kcal, 22g P, 48g C, 17g F, \u20b945]",
        "Sona Masoori Rice (150g) + Fish Curry (120g rohu/pomfret in light coconut gravy) + Beans Poriyal (120g) [460 kcal, 32g P, 46g C, 13g F, \u20b980]",
        "Cooked Rice (150g) + Mixed Vegetable Sambar (180g) + Pan-seared Tofu or Paneer (80g) + Cucumber Slices [465 kcal, 21g P, 52g C, 17g F, \u20b955]"
      ],
      "instructions": "Prick boiled eggs gently before simmering in gravy to absorb rich flavours.",
      "substitutions": "Can use 80g paneer cubes or 40g soya chunks instead of eggs."
    },
    "snackEvening": {
      "title": "Boiled Sweet Corn (120g) with lemon squeeze & chaat masala",
      "cals": 120,
      "protein": 4,
      "carbs": 24,
      "fat": 1.5,
      "cost": 20,
      "options": [
        "Boiled Sweet Corn (120g) with lemon squeeze & chaat masala [120 kcal, 4g P, 24g C, 1.5g F, \u20b920]",
        "Roasted Kadale / Chana (30g) + Warm Elaichi Green Tea [125 kcal, 6g P, 18g C, 2.5g F, \u20b915]"
      ],
      "instructions": "Steam sweet corn kernels for 5 mins. Toss hot with lemon juice.",
      "substitutions": "Can substitute sweet corn with boiled groundnuts (20g)."
    },
    "dinner": {
      "title": "2 Soft Phulkas (75g) + Fresh Paneer Bhurji (90g paneer, capsicum, tomato) + Warm Tomato Rasam (150ml)",
      "cals": 445,
      "protein": 21,
      "carbs": 44,
      "fat": 19,
      "cost": 60,
      "options": [
        "2 Soft Phulkas (75g) + Fresh Paneer Bhurji (90g paneer, capsicum, tomato) + Warm Tomato Rasam (150ml) [445 kcal, 21g P, 44g C, 19g F, \u20b960]",
        "2 Ragi Rotis (130g) + Chicken Curry (90g cooked meat) + Onion Cucumber Raita (80g) [430 kcal, 30g P, 46g C, 11g F, \u20b970]",
        "Moong Dal Vegetable Dalia Khichdi (220g) + Fresh Curd (100g) [390 kcal, 16g P, 54g C, 9g F, \u20b935]"
      ],
      "instructions": "Crumble 90g fresh cow-milk paneer directly into saut\u00e9ed vegetables on low flame.",
      "substitutions": "Can swap paneer with egg bhurji (2 eggs + 1 white) for lower fat."
    },
    "prePost": "Optional Pre: 2 Medjool dates [80 kcal] \u2022 Post: 1 boiled egg white or 100g warm milk [55 kcal, 4g P]",
    "totalCals": 1390,
    "totalP": 63,
    "totalC": 164,
    "totalF": 50,
    "totalCost": 168
  },
  {
    "menuName": "Bengaluru Rava Upma & Fresh Coastal Home Curry",
    "breakfast": {
      "title": "Bengaluru Vegetable Rava Upma (180g cooked) with roasted peanuts + 1 Boiled Egg",
      "cals": 340,
      "protein": 14,
      "carbs": 44,
      "fat": 12,
      "cost": 26,
      "options": [
        "Bengaluru Vegetable Rava Upma (180g cooked) with roasted peanuts + 1 Boiled Egg [340 kcal, 14g P, 44g C, 12g F, \u20b926]",
        "Vegetable Upma (180g) + 1 glass warm toned milk (150ml) [320 kcal, 11g P, 48g C, 9g F, \u20b924]",
        "Steamed Idlis (3 pcs) with Mint Toor Dal Chutney (40g) + 1 Boiled Egg [320 kcal, 15g P, 42g C, 9g F, \u20b928]"
      ],
      "instructions": "Dry roast semolina lightly. Tempered with mustard seeds, chana dal, green chillies & mixed veggies.",
      "substitutions": "Can use broken wheat / lapsi rava for extra fiber."
    },
    "snackMorning": {
      "title": "Fresh Fruit Bowl (150g watermelon or papaya) + 6 soaked almonds",
      "cals": 110,
      "protein": 3,
      "carbs": 22,
      "fat": 3,
      "cost": 30,
      "options": [
        "Fresh Fruit Bowl (150g watermelon or papaya) + 6 soaked almonds [110 kcal, 3g P, 22g C, 3g F, \u20b930]",
        "Tender Coconut Water (220ml) [45 kcal, 1g P, 10g C, 0g F, \u20b935]"
      ],
      "instructions": "Eat fruit raw. High enzyme content aids morning digestion.",
      "substitutions": "Can use seasonal guava, apple, or pear."
    },
    "lunch": {
      "title": "Sona Masoori Rice (150g cooked) + Bengaluru Fish Curry (120g fresh fish in light gravy) + Cabbage & Pea Poriyal (130g) + Rasam",
      "cals": 450,
      "protein": 33,
      "carbs": 46,
      "fat": 13,
      "cost": 80,
      "options": [
        "Sona Masoori Rice (150g cooked) + Bengaluru Fish Curry (120g fresh fish in light gravy) + Cabbage & Pea Poriyal (130g) + Rasam [450 kcal, 33g P, 46g C, 13g F, \u20b980]",
        "2 Phulkas (80g) + Chicken Curry (95g cooked meat) + Cucumber Carrot Salad (100g) [440 kcal, 31g P, 44g C, 13g F, \u20b965]",
        "Rice (150g) + Thick Chana Dal (180g) + Beans Palya (130g) + Fresh Curd (100g) [470 kcal, 22g P, 56g C, 15g F, \u20b945]"
      ],
      "instructions": "Use fresh local fish cuts (rohu, pomfret, or seer fish). Simmer gently for 8 mins.",
      "substitutions": "If fish unavailable: substitute with 120g chicken breast or 100g fresh paneer."
    },
    "snackEvening": {
      "title": "Roasted Puri Kadale / Chana (30g) + Warm Ginger Tea (100ml low-fat milk)",
      "cals": 140,
      "protein": 6,
      "carbs": 20,
      "fat": 3.5,
      "cost": 18,
      "options": [
        "Roasted Puri Kadale / Chana (30g) + Warm Ginger Tea (100ml low-fat milk) [140 kcal, 6g P, 20g C, 3.5g F, \u20b918]",
        "Spiced Boiled Moong Sprouts (80g) with lime & salt [110 kcal, 7g P, 18g C, 1g F, \u20b915]"
      ],
      "instructions": "Measure 30g roasted chana in a small bowl. Satisfies tea-time crunch.",
      "substitutions": "Can swap tea with clear black tea or warm lemon water."
    },
    "dinner": {
      "title": "2 Soft Phulkas (75g) + Soya Chunks & Green Pea Curry (45g dry soya + 50g peas) + Fresh Curd (80g)",
      "cals": 420,
      "protein": 29,
      "carbs": 48,
      "fat": 9,
      "cost": 40,
      "options": [
        "2 Soft Phulkas (75g) + Soya Chunks & Green Pea Curry (45g dry soya + 50g peas) + Fresh Curd (80g) [420 kcal, 29g P, 48g C, 9g F, \u20b940]",
        "2 Phulkas (75g) + 2 Boiled Eggs in Homestyle Curry (100g) + Sliced Cucumber [410 kcal, 21g P, 42g C, 15g F, \u20b938]",
        "2 Ragi Rotis (120g) + Mixed Vegetable Sambar (180ml) + Saut\u00e9ed Palak (100g) [380 kcal, 14g P, 54g C, 8g F, \u20b930]"
      ],
      "instructions": "Boil soya chunks in water with salt, squeeze out water thoroughly, then simmer in onion-tomato gravy.",
      "substitutions": "Soya is naturally 52% protein, an exceptional budget powerhouse."
    },
    "prePost": "Optional Pre: 1 cup tender coconut water [45 kcal] \u2022 Post: 1 glass warm milk (150ml) [85 kcal, 5g P]",
    "totalCals": 1460,
    "totalP": 85,
    "totalC": 180,
    "totalF": 40.5,
    "totalCost": 194
  },
  {
    "menuName": "Nourishing Rolled Oats & Tender Chicken Palya",
    "breakfast": {
      "title": "Warm Rolled Oats (40g dry + 180ml toned milk) + 1 Boiled Egg + Apple slices (50g)",
      "cals": 345,
      "protein": 18,
      "carbs": 46,
      "fat": 10,
      "cost": 35,
      "options": [
        "Warm Rolled Oats (40g dry + 180ml toned milk) + 1 Boiled Egg + Apple slices (50g) [345 kcal, 18g P, 46g C, 10g F, \u20b935]",
        "Vegetable Poha (160g cooked) + 2 Boiled Eggs [360 kcal, 18g P, 42g C, 14g F, \u20b932]",
        "2 Plain Dosas (120g) + Toor Dal Sambar (150ml) + 1 cup warm sprouted moong [330 kcal, 14g P, 48g C, 7g F, \u20b925]"
      ],
      "instructions": "Cook oats in milk for 4 mins on medium flame. Stir in pinch of cinnamon powder.",
      "substitutions": "Can use instant oats or traditional rolled oats."
    },
    "snackMorning": {
      "title": "Tender Coconut Water (220ml) + 5 Soaked Almonds",
      "cals": 95,
      "protein": 3,
      "carbs": 12,
      "fat": 4,
      "cost": 40,
      "options": [
        "Tender Coconut Water (220ml) + 5 Soaked Almonds [95 kcal, 3g P, 12g C, 4g F, \u20b940]",
        "Fresh Spiced Buttermilk (220ml) with coriander & rock salt [45 kcal, 3g P, 4g C, 1.5g F, \u20b915]"
      ],
      "instructions": "Soak almonds overnight; peel skins in the morning for optimal nutrient absorption.",
      "substitutions": "Can use 2 whole walnuts instead of almonds."
    },
    "lunch": {
      "title": "Sona Masoori Rice (150g cooked) + Tender Chicken Curry (130g raw / 95g meat) + Palak (Spinach) Palya (140g) + Rasam",
      "cals": 470,
      "protein": 35,
      "carbs": 46,
      "fat": 13,
      "cost": 75,
      "options": [
        "Sona Masoori Rice (150g cooked) + Tender Chicken Curry (130g raw / 95g meat) + Palak (Spinach) Palya (140g) + Rasam [470 kcal, 35g P, 46g C, 13g F, \u20b975]",
        "2 Soft Phulkas (80g) + Fresh Paneer Curry (85g paneer in light gravy) + French Beans Palya (120g) [450 kcal, 21g P, 44g C, 19g F, \u20b955]",
        "Rice (150g) + Toor Dal Tadka (180g) + 2 Boiled Eggs + Beetroot Poriyal (120g) [460 kcal, 25g P, 52g C, 14g F, \u20b942]"
      ],
      "instructions": "Weigh raw boneless chicken (130g). Steam spinach lightly with mustard tempering.",
      "substitutions": "Spinach provides bioavailable iron and folates."
    },
    "snackEvening": {
      "title": "Roasted Makhana (30g) + Hot Green Tea with lemon",
      "cals": 130,
      "protein": 3,
      "carbs": 21,
      "fat": 3.5,
      "cost": 25,
      "options": [
        "Roasted Makhana (30g) + Hot Green Tea with lemon [130 kcal, 3g P, 21g C, 3.5g F, \u20b925]",
        "Boiled Chickpeas Sundal (70g) with mustard & curry leaves [125 kcal, 6g P, 20g C, 2.5g F, \u20b918]"
      ],
      "instructions": "Roast makhana on low heat for 5-6 minutes until super crunchy.",
      "substitutions": "Can dust with pinch of turmeric and black pepper."
    },
    "dinner": {
      "title": "2 Soft Phulkas (75g) + 2 Boiled Eggs in Tomato Onion Curry + Cucumber Salad (100g)",
      "cals": 415,
      "protein": 21,
      "carbs": 42,
      "fat": 15,
      "cost": 38,
      "options": [
        "2 Soft Phulkas (75g) + 2 Boiled Eggs in Tomato Onion Curry + Cucumber Salad (100g) [415 kcal, 21g P, 42g C, 15g F, \u20b938]",
        "2 Phulkas (75g) + Grilled Chicken Strips (100g cooked) + Mixed Saut\u00e9ed Capsicum & Onions [425 kcal, 32g P, 40g C, 11g F, \u20b965]",
        "Warm Moong Dal Vegetable Khichdi (220g) + Fresh Curd (100g) [380 kcal, 15g P, 56g C, 8g F, \u20b935]"
      ],
      "instructions": "Roll thin phulkas without excess dry flour. Cook on hot cast iron pan.",
      "substitutions": "Can replace 1 whole egg with 2 egg whites for lower dietary fat."
    },
    "prePost": "Optional Pre: 1 small banana [70 kcal] \u2022 Post: 1 cup warm turmeric milk [90 kcal, 6g P]",
    "totalCals": 1455,
    "totalP": 80,
    "totalC": 167,
    "totalF": 45.5,
    "totalCost": 213
  },
  {
    "menuName": "Calcium-Rich Ragi Dosa & Fresh Country Egg Feast",
    "breakfast": {
      "title": "Ragi Dosa (2 medium, 120g) + Coconut Mint Chutney (30g) + 2 Boiled Eggs",
      "cals": 350,
      "protein": 19,
      "carbs": 40,
      "fat": 13,
      "cost": 35,
      "options": [
        "Ragi Dosa (2 medium, 120g) + Coconut Mint Chutney (30g) + 2 Boiled Eggs [350 kcal, 19g P, 40g C, 13g F, \u20b935]",
        "Steamed Idlis (3 pcs, 110g) + Vegetable Sambar (150ml) + 1 Boiled Egg [310 kcal, 13g P, 44g C, 8g F, \u20b925]",
        "Vegetable Upma (180g) + Warm Toned Milk (150ml) [320 kcal, 11g P, 48g C, 9g F, \u20b922]"
      ],
      "instructions": "Mix ragi flour with equal water, pinch of salt, cumin seeds & chopped onion. Pour on medium hot tawa.",
      "substitutions": "Ragi is rich in calcium and low-glycemic complex carbs."
    },
    "snackMorning": {
      "title": "Fresh Seasonal Fruit (1 Medium Apple or 150g Papaya) + 6 Almonds",
      "cals": 115,
      "protein": 3,
      "carbs": 22,
      "fat": 3.5,
      "cost": 30,
      "options": [
        "Fresh Seasonal Fruit (1 Medium Apple or 150g Papaya) + 6 Almonds [115 kcal, 3g P, 22g C, 3.5g F, \u20b930]",
        "Tender Coconut Water (220ml) [45 kcal, 1g P, 10g C, 0g F, \u20b935]"
      ],
      "instructions": "Enjoy fresh fruit at room temperature. Almonds provide vitamin E.",
      "substitutions": "Can substitute with 1 fresh sweet orange (mosambi)."
    },
    "lunch": {
      "title": "2 Soft Phulkas (80g) + Homestyle Egg Curry (2 eggs) + Cabbage & Carrot Poriyal (140g) + Rasam",
      "cals": 445,
      "protein": 22,
      "carbs": 48,
      "fat": 16,
      "cost": 42,
      "options": [
        "2 Soft Phulkas (80g) + Homestyle Egg Curry (2 eggs) + Cabbage & Carrot Poriyal (140g) + Rasam [445 kcal, 22g P, 48g C, 16g F, \u20b942]",
        "Sona Masoori Rice (150g) + Bengaluru Chicken Curry (95g meat) + Beans Palya (120g) [475 kcal, 34g P, 48g C, 14g F, \u20b975]",
        "Rice (150g) + Thick Toor Dal Tadka (180g) + Fresh Curd (100g) + Tomato Cucumber Salad [440 kcal, 18g P, 56g C, 14g F, \u20b940]"
      ],
      "instructions": "Cook vegetables in minimum oil with mustard seeds, curry leaves & grated fresh coconut.",
      "substitutions": "Can use 80g paneer in place of 2 eggs."
    },
    "snackEvening": {
      "title": "Spiced Boiled Sundal / Chickpeas (80g) with lime",
      "cals": 140,
      "protein": 7,
      "carbs": 22,
      "fat": 3,
      "cost": 20,
      "options": [
        "Spiced Boiled Sundal / Chickpeas (80g) with lime [140 kcal, 7g P, 22g C, 3g F, \u20b920]",
        "Roasted Makhana (30g) in 1/2 tsp ghee & rock salt [130 kcal, 3g P, 21g C, 3.5g F, \u20b925]"
      ],
      "instructions": "Toss chickpeas with curry leaves, mustard seeds, and generous squeeze of lime.",
      "substitutions": "High fibre keeps evening hunger completely absent."
    },
    "dinner": {
      "title": "2 Soft Phulkas (75g) + Home Chicken Curry (100g meat) + Cucumber Salad (100g)",
      "cals": 420,
      "protein": 31,
      "carbs": 42,
      "fat": 12,
      "cost": 65,
      "options": [
        "2 Soft Phulkas (75g) + Home Chicken Curry (100g meat) + Cucumber Salad (100g) [420 kcal, 31g P, 42g C, 12g F, \u20b965]",
        "2 Phulkas (75g) + Fresh Paneer Bhurji (90g paneer, capsicum, onion) + Clear Soup [440 kcal, 20g P, 42g C, 20g F, \u20b955]",
        "Rice-Moong Dal Khichdi (220g) + Curd (100g) + Lauki Sabzi (120g) [385 kcal, 14g P, 58g C, 8.5g F, \u20b935]"
      ],
      "instructions": "Keep dinner light and satisfying. Chew slowly.",
      "substitutions": "Can substitute chicken with fresh rohu fish or egg bhurji."
    },
    "prePost": "Optional Pre: 1 cup tender coconut water [45 kcal] \u2022 Post: 1 glass warm milk (150ml) [85 kcal, 5g P]",
    "totalCals": 1470,
    "totalP": 82,
    "totalC": 174,
    "totalF": 47.5,
    "totalCost": 192
  },
  {
    "menuName": "High-Fiber Soya Chunks & Comfort Idli Sambar",
    "breakfast": {
      "title": "Steamed Idlis (3 pcs, 110g) + Vegetable Sambar (150ml) + 2 Boiled Eggs",
      "cals": 340,
      "protein": 19,
      "carbs": 38,
      "fat": 12,
      "cost": 35,
      "options": [
        "Steamed Idlis (3 pcs, 110g) + Vegetable Sambar (150ml) + 2 Boiled Eggs [340 kcal, 19g P, 38g C, 12g F, \u20b935]",
        "Vegetable Poha (160g cooked) + 1 Boiled Egg [310 kcal, 12g P, 44g C, 9g F, \u20b926]",
        "Rolled Oats cooked in toned milk (40g + 180ml milk) with 1/2 apple [290 kcal, 12g P, 45g C, 6g F, \u20b930]"
      ],
      "instructions": "Dip idlis in piping hot sambar. Eggs provide complete amino acid profile.",
      "substitutions": "Can swap sambar with tomato onion chutney."
    },
    "snackMorning": {
      "title": "Spiced Buttermilk / Majjige (220ml) with curry leaves & ginger",
      "cals": 45,
      "protein": 3,
      "carbs": 4,
      "fat": 1.5,
      "cost": 15,
      "options": [
        "Spiced Buttermilk / Majjige (220ml) with curry leaves & ginger [45 kcal, 3g P, 4g C, 1.5g F, \u20b915]",
        "Fresh Papaya slices (150g) + 5 almonds [110 kcal, 3g P, 22g C, 3g F, \u20b928]"
      ],
      "instructions": "Chilled buttermilk soothes digestive tract.",
      "substitutions": "Great for hydration and electrolyte balance."
    },
    "lunch": {
      "title": "Sona Masoori Rice (150g cooked) + Soya Chunks Curry (45g dry soya chunks cooked in onion-tomato gravy) + French Beans Palya (130g) + Rasam",
      "cals": 460,
      "protein": 31,
      "carbs": 56,
      "fat": 9,
      "cost": 42,
      "options": [
        "Sona Masoori Rice (150g cooked) + Soya Chunks Curry (45g dry soya chunks cooked in onion-tomato gravy) + French Beans Palya (130g) + Rasam [460 kcal, 31g P, 56g C, 9g F, \u20b942]",
        "2 Phulkas (80g) + Chicken Curry (95g meat) + Cabbage Poriyal (120g) [440 kcal, 31g P, 44g C, 13g F, \u20b965]",
        "Rice (150g) + Thick Toor Dal (180g) + 2 Boiled Eggs + Ridge Gourd Palya (120g) [455 kcal, 24g P, 52g C, 14g F, \u20b940]"
      ],
      "instructions": "Soak soya chunks in warm water for 15 mins. Squeeze out bitter water completely before cooking.",
      "substitutions": "Can add 30g boiled green peas to soya curry."
    },
    "snackEvening": {
      "title": "Roasted Kadale / Chana (30g) + Hot Elaichi Tea (100ml milk)",
      "cals": 140,
      "protein": 6,
      "carbs": 20,
      "fat": 3.5,
      "cost": 18,
      "options": [
        "Roasted Kadale / Chana (30g) + Hot Elaichi Tea (100ml milk) [140 kcal, 6g P, 20g C, 3.5g F, \u20b918]",
        "Roasted Makhana (30g) in ghee & rock salt [130 kcal, 3g P, 21g C, 3.5g F, \u20b925]"
      ],
      "instructions": "Sip tea slowly without hurried gulping.",
      "substitutions": "Can swap tea with warm cinnamon water."
    },
    "dinner": {
      "title": "2 Soft Phulkas (75g) + 2 Boiled Eggs in Mild Curry + Cucumber Carrot Salad (120g)",
      "cals": 415,
      "protein": 21,
      "carbs": 42,
      "fat": 15,
      "cost": 38,
      "options": [
        "2 Soft Phulkas (75g) + 2 Boiled Eggs in Mild Curry + Cucumber Carrot Salad (120g) [415 kcal, 21g P, 42g C, 15g F, \u20b938]",
        "2 Phulkas (75g) + Paneer Bhurji (90g paneer, capsicum, tomato) + Warm Soup [445 kcal, 20g P, 44g C, 19g F, \u20b958]",
        "2 Ragi Rotis (120g) + Chicken Curry (90g meat) + Cucumber Slices [425 kcal, 30g P, 46g C, 11g F, \u20b968]"
      ],
      "instructions": "Fresh salad with dinner adds natural hydration and digestive enzymes.",
      "substitutions": "Can replace cucumber with grated carrot or steamed beetroot."
    },
    "prePost": "Optional Pre: 1 small banana [70 kcal] \u2022 Post: 1 glass warm milk [90 kcal, 6g P]",
    "totalCals": 1400,
    "totalP": 80,
    "totalC": 160,
    "totalF": 41,
    "totalCost": 151
  }
];

// Joyful Zumba Dance Templates
const ZUMBA_TEMPLATES: Record<string, NonNullable<DayRecord240['workout']>> = {
  "phase1_bollywood_zumba": {
    "title": "15-Min Joyful Beginner Bollywood Zumba Dance Party",
    "duration": 15,
    "burnCals": 105,
    "met": 4.8,
    "style": "Bollywood Dance Fitness",
    "instructions": "Put on upbeat music! Follow easy beginner dance steps with no jumping. Sway your hips, pump your arms, and have fun. Never worry about perfection \u2014 just keep moving and smiling! \u2764\ufe0f",
    "warmup": "2 minutes of slow shoulder rolls, side-to-side step touches, and wrist circles.",
    "cooldown": "2 minutes of gentle salsa breathing, slow swaying, and deep belly breath.",
    "exercises": "Bollywood Bhangra Bounce (3 mins) \u2022 Salsa Side-to-Side Step (4 mins) \u2022 Merengue March & Arm Reaches (4 mins) \u2022 Cumbia Hip Sway (4 mins)",
    "alternatives": "Seated dance moves on a chair with expressive arm rolls and seated foot taps.",
    "youtubeTitle": "15 Min Beginner Bollywood Dance Workout (Easy, No Jumping, High Energy)",
    "youtubeUrl": "https://www.youtube.com/results?search_query=15+minute+beginner+bollywood+dance+workout+low+impact"
  },
  "phase1_latin_zumba": {
    "title": "15-Min Feel-Good Latin Zumba Party (Knee-Friendly, Low Impact)",
    "duration": 15,
    "burnCals": 105,
    "met": 4.8,
    "style": "Latin Fiesta Dance",
    "instructions": "Gentle Latin rhythms (Merengue, Salsa, Bachata). Keep knees soft and absorb rhythm naturally.",
    "warmup": "2 minutes easy hip circles and gentle arm sweeps.",
    "cooldown": "3 minutes calm swaying and calf stretch.",
    "exercises": "Merengue 6-Count March (4 mins) \u2022 Salsa Forward & Back Step (4 mins) \u2022 Reggaeton Gentle Bounce (3 mins) \u2022 Bachata Side Touch (4 mins)",
    "alternatives": "Chair-supported dance steps holding dining table or chair back.",
    "youtubeTitle": "15 Min Easy Zumba Dance Workout for Beginners (Low Impact)",
    "youtubeUrl": "https://www.youtube.com/results?search_query=15+minute+easy+zumba+dance+workout+for+beginners+low+impact"
  },
  "phase2_bollywood_zumba": {
    "title": "18-Min Upbeat Bollywood & Latin Zumba Dance Cardio",
    "duration": 18,
    "burnCals": 135,
    "met": 5.2,
    "style": "Bollywood Cardio Fusion",
    "instructions": "Higher energetic flow! Great for releasing stress, elevating mood, and building stamina through joyful dance.",
    "warmup": "3 minutes rhythmic pacing and shoulder rolls.",
    "cooldown": "2 minutes slow dance sway and hamstring release.",
    "exercises": "Bollywood Balle Balle Step (5 mins) \u2022 Salsa Cross Step (5 mins) \u2022 Mambo Front & Back (4 mins) \u2022 Chass\u00e9 & Clap (4 mins)",
    "alternatives": "Lower the bounce or take steps smaller whenever you need a breather.",
    "youtubeTitle": "20 Min Bollywood Zumba Dance Fitness (Fat Burning & Fun)",
    "youtubeUrl": "https://www.youtube.com/results?search_query=20+minute+bollywood+zumba+dance+fitness+at+home"
  },
  "phase2_pop_zumba": {
    "title": "18-Min Joyful Retro Pop & Dance Hits Zumba Session",
    "duration": 18,
    "burnCals": 130,
    "met": 5.0,
    "style": "Retro Pop Dance",
    "instructions": "Catchy retro and pop dance beats. Dance like nobody is watching in the comfort of your living room!",
    "warmup": "2 minutes torso roll and ankle circles.",
    "cooldown": "3 minutes soothing deep breathing and upper back release.",
    "exercises": "Grapevine Step & Tap (5 mins) \u2022 Disco Point & Sway (4 mins) \u2022 Cha-Cha Footwork (5 mins) \u2022 High-Five Arm Jive (4 mins)",
    "alternatives": "Seated arm jive and gentle seated sway.",
    "youtubeTitle": "18-20 Min Retro Pop Dance Workout for Women",
    "youtubeUrl": "https://www.youtube.com/results?search_query=20+minute+retro+pop+dance+workout+fun+women"
  },
  "phase3_zumba_fiesta": {
    "title": "20-Min Full Body Zumba Fiesta & Core Tone",
    "duration": 20,
    "burnCals": 155,
    "met": 5.4,
    "style": "Zumba Fiesta & Tone",
    "instructions": "Full body dance rhythm that naturally engages your core, tones waist, and boosts endurance effortlessly.",
    "warmup": "3 minutes dynamic dance warm-up.",
    "cooldown": "3 minutes slow waltz flow and full body stretch.",
    "exercises": "Cumbia Two-Step & Pump (5 mins) \u2022 Bollywood Desi Thumka (5 mins) \u2022 Salsa Double Step (5 mins) \u2022 Samba Shimmy & Reach (5 mins)",
    "alternatives": "Omit quick pivots; maintain simple two-step touch.",
    "youtubeTitle": "20-25 Min Zumba Dance Party at Home (Sweat & Smile)",
    "youtubeUrl": "https://www.youtube.com/results?search_query=20+minute+zumba+dance+party+at+home+sweat+and+smile"
  },
  "phase3_zumba_fusion": {
    "title": "22-Min High-Spirited Bollywood Beats Zumba Cardio",
    "duration": 22,
    "burnCals": 175,
    "met": 5.5,
    "style": "Bollywood Anthem Dance",
    "instructions": "Infectious beats and expressive hand gestures. Burns calories while feeling like a pure celebration!",
    "warmup": "3 minutes light bounce and shoulder rolls.",
    "cooldown": "3 minutes calming waltz breathing.",
    "exercises": "Dholak Beat March (6 mins) \u2022 Punjabi Folk Step (6 mins) \u2022 Bollywood Freestyle (5 mins) \u2022 Rhythmic Claps & Sway (5 mins)",
    "alternatives": "Pace yourself gently; all moves are customizable.",
    "youtubeTitle": "20 Min Upbeat Bollywood Dance Workout (Calorie Burn & Joy)",
    "youtubeUrl": "https://www.youtube.com/results?search_query=20+minute+upbeat+bollywood+dance+workout+home"
  },
  "phase4_zumba_celebration": {
    "title": "25-Min Radiant Celebration Zumba Masterclass",
    "duration": 25,
    "burnCals": 200,
    "met": 5.5,
    "style": "Masterclass Dance Party",
    "instructions": "You are vibrant, strong, and confident! Celebrate your 240-day transformation with joyful dance.",
    "warmup": "3 minutes energetic groove warm-up.",
    "cooldown": "3 minutes graceful gratitude dance cool-down.",
    "exercises": "Full Fiesta Groove (8 mins) \u2022 Bollywood Anthem Dance (8 mins) \u2022 Latin Salsa Carnival (9 mins)",
    "alternatives": "Take sips of water whenever thirsty and enjoy every song.",
    "youtubeTitle": "25 Min Zumba Dance Workout for Total Body Fitness",
    "youtubeUrl": "https://www.youtube.com/results?search_query=25+minute+zumba+dance+workout+total+body+fitness"
  },
  "cycle_gentle_dance": {
    "title": "12-Min Gentle Slow Dance & Pelvic Sway (Restorative Flow)",
    "duration": 12,
    "burnCals": 55,
    "met": 3.2,
    "style": "Restorative Slow Dance",
    "instructions": "Ultra-gentle soothing music. Slow hip sways that relieve pelvic tension, lower back stiffness, and cramps.",
    "warmup": "2 minutes deep belly breaths sitting or standing softly.",
    "cooldown": "3 minutes supported relaxation with warm water.",
    "exercises": "Gentle Hip Sway (4 mins) \u2022 Slow Waltz Step (4 mins) \u2022 Supported Side Reach (4 mins)",
    "alternatives": "100% seated on a comfortable sofa or chair.",
    "youtubeTitle": "10 Min Gentle Restorative Dance & Stretch for Women",
    "youtubeUrl": "https://www.youtube.com/results?search_query=10+minute+gentle+restorative+dance+and+stretch"
  }
};

export const PLAN_START_DATE = '2026-10-24';
export const PLAN_END_DATE = '2027-06-20';

function generateAll240Days(): DayRecord240[] {
  const days: DayRecord240[] = [];
  const startParts = PLAN_START_DATE.split('-').map(Number);
  const startYear = startParts[0];
  const startMonth = startParts[1] - 1;
  const startDay = startParts[2];

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (let i = 0; i < 240; i++) {
    const d = new Date(startYear, startMonth, startDay + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayOfMonth}`;
    const weekday = weekdays[d.getDay()];
    const dayNum = i + 1;

    const m = MEAL_TEMPLATES[i % MEAL_TEMPLATES.length];

    let isRestDay = false;
    let restReason = '';
    let workout: DayRecord240['workout'] = null;

    if (dayNum === 1) {
      isRestDay = true;
      restReason = 'Day 1 of Journey & Period Care — Honoring your body with warm rest & gentle self-care ❤️';
    } else if (dayNum === 2) {
      isRestDay = false;
      workout = ZUMBA_TEMPLATES['cycle_gentle_dance'];
    } else if (weekday === 'Wednesday' || weekday === 'Saturday' || weekday === 'Sunday') {
      isRestDay = true;
      restReason = `Scheduled REST DAY (${weekday}) — Muscle recovery, sleep & nervous system rest. Zero workout pressure! ❤️`;
    } else {
      isRestDay = false;
      if (dayNum <= 30) {
        workout = (weekday === 'Monday' || weekday === 'Thursday')
          ? ZUMBA_TEMPLATES['phase1_bollywood_zumba']
          : ZUMBA_TEMPLATES['phase1_latin_zumba'];
      } else if (dayNum <= 75) {
        workout = (weekday === 'Monday' || weekday === 'Thursday')
          ? ZUMBA_TEMPLATES['phase2_bollywood_zumba']
          : ZUMBA_TEMPLATES['phase2_pop_zumba'];
      } else if (dayNum <= 150) {
        workout = (weekday === 'Monday' || weekday === 'Thursday')
          ? ZUMBA_TEMPLATES['phase3_zumba_fiesta']
          : ZUMBA_TEMPLATES['phase3_zumba_fusion'];
      } else {
        workout = (weekday === 'Monday' || weekday === 'Thursday')
          ? ZUMBA_TEMPLATES['phase4_zumba_celebration']
          : ZUMBA_TEMPLATES['phase3_zumba_fiesta'];
      }
    }

    days.push({
      day: dayNum,
      date: dateStr,
      weekday,
      isRestDay,
      restReason,
      workout: workout ? { ...workout } : null,
      diet: {
        menuName: m.menuName,
        breakfast: { ...m.breakfast, options: [...m.breakfast.options] },
        snackMorning: { ...m.snackMorning, options: [...m.snackMorning.options] },
        lunch: { ...m.lunch, options: [...m.lunch.options] },
        snackEvening: { ...m.snackEvening, options: [...m.snackEvening.options] },
        dinner: { ...m.dinner, options: [...m.dinner.options] },
        prePost: m.prePost,
        totalCals: m.totalCals,
        totalP: m.totalP,
        totalC: m.totalC,
        totalF: m.totalF,
        totalCost: m.totalCost
      }
    });
  }

  return days;
}

export const HER_JOURNEY_240_DAYS: DayRecord240[] = generateAll240Days();
export const INDIAN_FOOD_DATABASE = [
  { id: "f1", name: "Steamed Idli", portion: "1 pc (60g cooked)", cals: 65, protein: 2.2, carbs: 13.5, fat: 0.3, isVeg: true, category: "Breakfast" },
  { id: "f2", name: "Plain Dosa (Homemade)", portion: "1 medium (70g)", cals: 135, protein: 3.4, carbs: 22.0, fat: 3.8, isVeg: true, category: "Breakfast" },
  { id: "f3", name: "Ragi Dosa", portion: "1 medium (70g)", cals: 140, protein: 4.1, carbs: 24.0, fat: 3.2, isVeg: true, category: "Breakfast" },
  { id: "f4", name: "Ragi Roti", portion: "1 roti (70g)", cals: 145, protein: 4.5, carbs: 26.0, fat: 2.8, isVeg: true, category: "Lunch / Dinner" },
  { id: "f5", name: "Vegetable Upma", portion: "1 katori (150g)", cals: 210, protein: 5.2, carbs: 36.0, fat: 5.5, isVeg: true, category: "Breakfast" },
  { id: "f6", name: "Vegetable Poha", portion: "1 plate (150g)", cals: 230, protein: 4.8, carbs: 42.0, fat: 5.0, isVeg: true, category: "Breakfast" },
  { id: "f7", name: "Rolled Oats (Cooked in Milk)", portion: "1 bowl (200g)", cals: 240, protein: 10.5, carbs: 38.0, fat: 5.5, isVeg: true, category: "Breakfast" },
  { id: "f8", name: "Sona Masoori Rice (Cooked)", portion: "1 katori (150g)", cals: 195, protein: 4.0, carbs: 42.0, fat: 0.6, isVeg: true, category: "Grains" },
  { id: "f9", name: "Whole Wheat Phulka / Roti", portion: "1 roti (40g)", cals: 105, protein: 3.5, carbs: 21.0, fat: 0.8, isVeg: true, category: "Grains" },
  { id: "f10", name: "Toor Dal Sambar (Bengaluru style)", portion: "1 cup (150ml)", cals: 110, protein: 5.5, carbs: 16.0, fat: 2.5, isVeg: true, category: "Dals" },
  { id: "f11", name: "Thick Toor Dal Tadka", portion: "1 katori (150g)", cals: 160, protein: 8.5, carbs: 22.0, fat: 4.5, isVeg: true, category: "Dals" },
  { id: "f12", name: "Moong Dal Tadka", portion: "1 katori (150g)", cals: 145, protein: 8.0, carbs: 21.0, fat: 3.5, isVeg: true, category: "Dals" },
  { id: "f13", name: "Pepper Rasam", portion: "1 cup (150ml)", cals: 45, protein: 1.5, carbs: 7.0, fat: 1.2, isVeg: true, category: "Soups" },
  { id: "f14", name: "French Beans & Carrot Palya", portion: "1 cup (130g)", cals: 85, protein: 2.8, carbs: 12.0, fat: 3.0, isVeg: true, category: "Vegetables" },
  { id: "f15", name: "Palak (Spinach) Palya", portion: "1 cup (120g)", cals: 75, protein: 3.5, carbs: 8.0, fat: 3.2, isVeg: true, category: "Vegetables" },
  { id: "f16", name: "Ridge Gourd (Heerekayi) Palya", portion: "1 cup (130g)", cals: 70, protein: 2.0, carbs: 9.0, fat: 3.0, isVeg: true, category: "Vegetables" },
  { id: "f17", name: "Cabbage & Peas Poriyal", portion: "1 cup (130g)", cals: 90, protein: 3.2, carbs: 13.0, fat: 2.8, isVeg: true, category: "Vegetables" },
  { id: "f18", name: "Farm Egg (Whole, Boiled)", portion: "1 large (50g)", cals: 72, protein: 6.3, carbs: 0.4, fat: 5.0, isVeg: false, category: "Proteins" },
  { id: "f19", name: "Egg White (Boiled)", portion: "1 large (33g)", cals: 17, protein: 3.6, carbs: 0.2, fat: 0.1, isVeg: false, category: "Proteins" },
  { id: "f20", name: "Bengaluru Chicken Curry (Meat)", portion: "100g cooked edible meat", cals: 185, protein: 26.5, carbs: 3.0, fat: 7.5, isVeg: false, category: "Proteins" },
  { id: "f21", name: "Grilled Chicken Breast (Boneless)", portion: "100g cooked", cals: 165, protein: 31.0, carbs: 0.0, fat: 3.6, isVeg: false, category: "Proteins" },
  { id: "f22", name: "Rohu / Freshwater Fish Curry", portion: "100g cooked fish", cals: 145, protein: 22.0, carbs: 2.5, fat: 5.2, isVeg: false, category: "Proteins" },
  { id: "f23", name: "Fresh Paneer (Malai)", portion: "50g cubes", cals: 145, protein: 9.0, carbs: 2.0, fat: 11.5, isVeg: true, category: "Proteins" },
  { id: "f24", name: "Paneer Bhurji", portion: "1 katori (100g)", cals: 195, protein: 12.0, carbs: 5.0, fat: 14.0, isVeg: true, category: "Proteins" },
  { id: "f25", name: "Soya Chunks Curry (Cooked)", portion: "1 cup (140g)", cals: 165, protein: 16.5, carbs: 14.0, fat: 3.5, isVeg: true, category: "Proteins" },
  { id: "f26", name: "Fresh Homemade Curd (Mosaru)", portion: "1 katori (100g)", cals: 62, protein: 3.5, carbs: 4.8, fat: 3.2, isVeg: true, category: "Dairy" },
  { id: "f27", name: "Spiced Buttermilk (Majjige)", portion: "1 glass (220ml)", cals: 45, protein: 3.0, carbs: 4.0, fat: 1.5, isVeg: true, category: "Beverages" },
  { id: "f28", name: "Tender Coconut Water (Elaneeru)", portion: "1 glass (220ml)", cals: 45, protein: 1.0, carbs: 10.0, fat: 0.1, isVeg: true, category: "Hydration" },
  { id: "f29", name: "Roasted Puri Kadale (Chana)", portion: "Handful (30g)", cals: 115, protein: 5.8, carbs: 17.5, fat: 2.2, isVeg: true, category: "Snacks" },
  { id: "f30", name: "Boiled Sundal (Chickpeas)", portion: "1 cup (100g)", cals: 155, protein: 7.5, carbs: 24.0, fat: 3.2, isVeg: true, category: "Snacks" },
  { id: "f31", name: "Roasted Makhana (Foxnuts)", portion: "1 bowl (30g)", cals: 125, protein: 3.0, carbs: 21.0, fat: 3.2, isVeg: true, category: "Snacks" },
  { id: "f32", name: "Sweet Corn (Boiled)", portion: "1 cup (100g)", cals: 95, protein: 3.2, carbs: 20.0, fat: 1.2, isVeg: true, category: "Snacks" },
  { id: "f33", name: "Fresh Papaya Slices", portion: "1 bowl (150g)", cals: 60, protein: 0.9, carbs: 14.0, fat: 0.2, isVeg: true, category: "Fruits" },
  { id: "f34", name: "Fresh Apple", portion: "1 medium (130g)", cals: 70, protein: 0.4, carbs: 18.0, fat: 0.2, isVeg: true, category: "Fruits" },
  { id: "f35", name: "Fresh Watermelon", portion: "1 bowl (180g)", cals: 55, protein: 1.1, carbs: 13.0, fat: 0.2, isVeg: true, category: "Fruits" },
  { id: "f36", name: "Banana (Yellaki)", portion: "1 small (80g)", cals: 72, protein: 0.9, carbs: 18.5, fat: 0.2, isVeg: true, category: "Fruits" },
  { id: "f37", name: "Moong Dal Vegetable Khichdi", portion: "1 plate (220g)", cals: 270, protein: 9.5, carbs: 46.0, fat: 5.2, isVeg: true, category: "Lunch / Dinner" },
  { id: "f38", name: "Cucumber Tomato Salad", portion: "1 bowl (120g)", cals: 30, protein: 1.2, carbs: 6.0, fat: 0.3, isVeg: true, category: "Salads" }
];
