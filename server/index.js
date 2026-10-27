import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Red flag emergency detector
function checkForRedFlags(query) {
  const q = query.toLowerCase();
  const redFlags = [
    { pattern: /(chest pain|pain in my chest|chest tightness|pressure in chest)/, symptom: 'Chest pain or chest pressure' },
    { pattern: /(fainted|fainting|passed out|blacking out|severe dizziness)/, symptom: 'Fainting or severe loss of consciousness' },
    { pattern: /(can't breathe|severe shortness of breath|gasping for air|struggling to breathe)/, symptom: 'Severe shortness of breath' },
    { pattern: /(severe hemorrhage|unusually heavy bleeding through multiple pads an hour|hemorrhaging)/, symptom: 'Extremely heavy or sudden severe bleeding' }
  ];

  for (const flag of redFlags) {
    if (flag.pattern.test(q)) {
      return flag.symptom;
    }
  }
  return null;
}

// Built-in Intelligent Wellness Reasoning Engine
// Provides contextual medical safety, Indian dietary expertise, and structured action synthesis
function generateIntelligentWellnessResponse(userMessage, context) {
  const msg = userMessage.toLowerCase();
  const profile = context?.profile || {};
  const currentDay = profile.currentDay || 1;
  const isPeriod = currentDay === 1 || context?.isPeriod;

  // 1. Check for urgent medical red flags
  const redFlag = checkForRedFlags(msg);
  if (redFlag) {
    return {
      text: `⚠️ **IMPORTANT SAFETY ALERT: Immediate Medical Assessment Recommended**\n\nYou mentioned experiencing **${redFlag}**. Please stop any physical activity immediately, sit or lie down in a safe, comfortable spot, and seek immediate professional medical attention or have someone close call for urgent care.\n\nYour well-being is the top priority. Wellness routines must pause whenever acute warning signs appear.`,
      safetyAlert: `Urgent symptom detected: ${redFlag}. Please consult a doctor immediately.`,
      suggestedAction: {
        id: `safety-${Date.now()}`,
        type: 'SET_REST_DAY',
        summary: 'Emergency Stop & Rest Day Activated',
        details: 'All workouts and physical targets have been paused for safety.',
        isHighRisk: true,
        payload: { reason: redFlag }
      }
    };
  }

  // 2. Meal queries: Breakfast, Biryani, Rice, High-protein, Vegetarian, Leftovers
  if (msg.includes('breakfast') && (msg.includes('what should i eat') || msg.includes('suggest') || msg.includes('plan'))) {
    return {
      text: `Good morning! For breakfast today, here is a balanced, nourishing South Indian option tailored to your preferences:\n\n• **2 Steamed Idlis (~100g cooked)** with mild coconut chutney (1 tbsp)\n• **1 Boiled Egg (~50g)** for quick, high-quality protein (or a cup of fresh curd for veg days)\n• **1 Warm glass of water or mild herbal tea**\n\n*Why this works:* It delivers ~220 kcal, 11g protein, zero heavy oil, and is very gentle on digestion. Would you like me to update today's breakfast on your dashboard?`,
      suggestedAction: {
        id: `meal-breakfast-${Date.now()}`,
        type: 'UPDATE_MEAL',
        summary: 'Update Today\'s Breakfast to Steamed Idlis & Boiled Egg',
        details: 'Breakfast: 2 Steamed Idlis (100g cooked) + 1 Boiled Egg (50g) + Coconut Chutney. Approx 215 kcal, 11g protein.',
        isHighRisk: false,
        payload: {
          mealType: 'breakfast',
          title: 'Steamed Idlis with Coconut Chutney & 1 Boiled Egg',
          approxCalories: 215,
          approxProteinG: 11,
          cookedPortionGuide: '2 idlis (100g) + 1 egg (50g)'
        }
      }
    };
  }

  if (msg.includes('biryani')) {
    return {
      text: `Yes, absolutely! **You can enjoy biryani today.** ❤️\n\nIn Her Journey 240, no cultural foods are forbidden, and food is never categorized as "good" or "bad". Here is how to enjoy it comfortably:\n\n1. **Scale Portion:** Weigh out **180g to 200g of cooked biryani** on your kitchen plate.\n2. **Protein Balance:** Ensure you get 2 good pieces of chicken/egg (approx 80–100g edible meat).\n3. **Volume & Gut Care:** Pair with a generous katori of **cucumber-onion raita or curd (100g)**.\n4. **Hydrate:** Sip water naturally after your meal.\n\nEnjoy every single bite with peace of mind. Would you like me to log Biryani with Raita for your lunch?`,
      suggestedAction: {
        id: `meal-biryani-${Date.now()}`,
        type: 'UPDATE_MEAL',
        summary: 'Set Lunch to Balanced Chicken Biryani with Raita',
        details: 'Lunch: 180g Cooked Biryani + 100g Cucumber Curd Raita. Approx 420 kcal, 24g protein.',
        isHighRisk: false,
        payload: {
          mealType: 'lunch',
          title: 'Home Chicken Biryani with Fresh Curd Raita',
          approxCalories: 420,
          approxProteinG: 24,
          cookedPortionGuide: '180g cooked biryani + 100g fresh curd raita'
        }
      }
    };
  }

  if (msg.includes('eggs') && msg.includes('rice') && msg.includes('chicken')) {
    return {
      text: `Wonderful! You have great ingredients on hand. Here is a delicious, balanced Indian meal you can assemble in 15 minutes:\n\n**Quick Spiced Chicken & Egg Rice Bowl:**\n• **Cooked Sona Masoori Rice:** 140g on the scale (~180 kcal)\n• **Sauteed Chicken Breast/Tenderloin:** 100g cooked with turmeric, cumin, and mild garam masala (~160 kcal, 22g protein)\n• **1 Boiled or Soft-Scrambled Egg** placed right on top (~75 kcal, 6g protein)\n• **Side:** Sliced cucumber with a squeeze of fresh lemon.\n\nTotal protein: ~28g! Would you like me to apply this as your lunch or dinner?`,
      suggestedAction: {
        id: `meal-pantry-${Date.now()}`,
        type: 'UPDATE_MEAL',
        summary: 'Apply Spiced Chicken & Egg Rice Bowl',
        details: 'Rice: 140g cooked + Chicken: 100g cooked + 1 Egg. Total: ~415 kcal, 28g protein.',
        isHighRisk: false,
        payload: {
          mealType: 'lunch',
          title: 'Spiced Chicken & Egg Rice Bowl',
          approxCalories: 415,
          approxProteinG: 28,
          cookedPortionGuide: '140g cooked rice + 100g cooked chicken + 1 egg'
        }
      }
    };
  }

  if (msg.includes('how much cooked rice') || msg.includes('weigh rice')) {
    return {
      text: `Here is the golden rule for rice on the kitchen scale:\n\n**Raw vs Cooked Rice Multiplier:**\n• Raw white rice absorbs water at roughly a **1:2.8 ratio**.\n• That means **50g of dry raw rice** expands into approximately **140g of cooked rice** on your plate!\n\n**Best Way to Log:**\n1. Place your bowl on the food scale.\n2. Tap **TARE (Zero)**.\n3. Spoon your warm cooked rice until the scale shows **130g to 150g**.\n4. Log it in the app as **COOKED/READY-TO-EAT**.\n\nThis gives you accurate, stress-free portion awareness without doing math at every meal! 🍚`
    };
  }

  if (msg.includes('ate more than planned') || msg.includes('binged') || msg.includes('overate') || msg.includes('ate too much')) {
    return {
      text: `Take a deep breath and put your hand on your heart. ❤️\n\n**Nothing is ruined.** One meal does not define your progress or your health. Here is your caring next step:\n\n1. **Do not skip the next meal:** Starving or fasting will only spike stress hormones and trigger evening hunger.\n2. **Drink water:** Sip room-temperature water or ginger tea to support natural digestion.\n3. **Gentle stroll:** Take a slow 10-minute walk if your belly feels comfortable, or simply sit upright and relax.\n4. **Continue as normal:** At your next meal, simply return to your regular balanced plate.\n\nYour body knows how to handle food. You are safe and doing great!`,
      suggestedAction: {
        id: `compassion-${Date.now()}`,
        type: 'NAVIGATE',
        summary: 'Open Mind & Self-Compassion Journal',
        details: 'Reflect kindly on what triggered your hunger today without self-judgment.',
        isHighRisk: false,
        payload: { tab: 'mind' }
      }
    };
  }

  if (msg.includes('vegetarian dinner') || msg.includes('high-protein vegetarian') || msg.includes('change to vegetarian')) {
    return {
      text: `Here is a high-protein, comforting South Indian vegetarian dinner:\n\n• **2 Soft Whole Wheat Chapatis (~75g total)**\n• **Paneer Bhurji / Palya (~100g)** sauteed with onions, capsicum, and mild cumin (~190 kcal, 14g protein)\n• **1 Bowl of Toor Dal Sambar or Rasam (~150ml)** (~85 kcal, 4g protein)\n• **Fresh Cucumber slices** with lemon\n\nTotal Protein: **~23g clean plant & dairy protein!** Would you like me to update your dinner plan?`,
      suggestedAction: {
        id: `meal-veg-dinner-${Date.now()}`,
        type: 'UPDATE_MEAL',
        summary: 'Update Dinner to High-Protein Vegetarian Chapatis & Paneer Palya',
        details: 'Dinner: 2 Chapatis + 100g Paneer Palya + 1 Bowl Sambar. Approx 390 kcal, 23g protein.',
        isHighRisk: false,
        payload: {
          mealType: 'dinner',
          title: '2 Chapatis with Spiced Paneer Palya & Sambar',
          approxCalories: 390,
          approxProteinG: 23,
          cookedPortionGuide: '2 chapatis (75g) + 100g cooked paneer palya'
        }
      }
    };
  }

  // 3. Fitness & Movement: 10 mins, treadmill, cramps, leg soreness, make easier
  if (msg.includes('10 minutes') || msg.includes('short on time') || msg.includes('only have 10 min')) {
    return {
      text: `Ten minutes is plenty! A short 10-minute session keeps your routine alive without exhausting you.\n\nHere is your **Quick 10-Minute Movement Session:**\n1. **2 Mins:** Gentle living room stroll with shoulder rolls\n2. **4 Mins:** Chair Sit-to-Stands (2 sets of 8 easy reps)\n3. **2 Mins:** Wall pushups or gentle calf raises\n4. **2 Mins:** Seated hamstring stretch and 3 deep breaths\n\nWould you like me to set your workout target to 10 minutes for today?`,
      suggestedAction: {
        id: `adjust-workout-10m-${Date.now()}`,
        type: 'UPDATE_WORKOUT',
        summary: 'Adjust Today\'s Workout to 10-Minute Express Movement',
        details: 'Duration: 10 mins. Level: Low Energy / Express. RPE: 2-3.',
        isHighRisk: false,
        payload: {
          durationMins: 10,
          routineId: 'minimum-viable-movement',
          title: '10-Minute Express Living Room Flow'
        }
      }
    };
  }

  if (msg.includes('treadmill') && (msg.includes('workout') || msg.includes('how to start') || msg.includes('bought a treadmill') || msg.includes('settings'))) {
    return {
      text: `Let's use your saved treadmill baseline that you already feel comfortable with:\n\n• **Warmup (2 mins):** Speed 3.5 km/h, Incline 0% (Relax shoulders, swing arms gently)\n• **Main Walk (9 mins):** Speed 5.0 km/h, Incline 2.0% (Your proven sweet spot!)\n• **Cooldown (2 mins):** Speed 3.0 km/h, Incline 0%\n• **Total Time:** 13 minutes\n\n*Effort Check:* You should pass the **"Talk Test"** — able to speak a sentence to your partner without gasping. If you ever feel tight or breathless, drop speed to 4.0 immediately.\n\nShall I set this as your active workout?`,
      suggestedAction: {
        id: `workout-treadmill-${Date.now()}`,
        type: 'UPDATE_WORKOUT',
        summary: 'Set Workout to 13-Minute Treadmill Walk (Speed 5, Incline 2%)',
        details: 'Speed 5.0 km/h, Incline 2%, Duration: 13 mins. RPE 3-4.',
        isHighRisk: false,
        payload: {
          durationMins: 13,
          routineId: 'treadmill-beginner-custom',
          title: 'Beginner Treadmill Walk (Speed 5, Incline 2%)'
        }
      }
    };
  }

  if (msg.includes('cramps') || msg.includes('period') || msg.includes('first day of my period')) {
    return {
      text: `On your period (especially Day 1 & 2), **resting is 100% valid and productive.** ❤️\n\nYour uterine muscles are working hard, and your body deserves kindness. Here is what we recommend:\n\n• **Exercise:** You can do 3–5 minutes of slow strolling and gentle cat-cow / seated back stretches, OR take a complete rest day.\n• **Comfort:** Apply a warm water bag to your lower belly, sip warm ginger-turmeric water or tender coconut water, and wear loose clothing.\n• **Food:** Enjoy iron-nourishing foods like warm dal, ragi, or chicken stew.\n\nWould you like me to switch today's plan to the **Gentle Period Comfort Routine** or mark today as a **Rest Day**?`,
      suggestedAction: {
        id: `period-action-${Date.now()}`,
        type: 'UPDATE_WORKOUT',
        summary: 'Switch to Cycle Day 1 Gentle Care Routine',
        details: 'Restorative mobility & breathing. Duration: 10 mins (can be reduced to 0).',
        isHighRisk: false,
        payload: {
          durationMins: 10,
          routineId: 'day-1-period-comfort',
          title: 'Cycle Day 1: Gentle Period Comfort & Rest'
        }
      }
    };
  }

  if (msg.includes('legs are tired') || msg.includes('tired') || msg.includes('sore') || msg.includes('easier')) {
    return {
      text: `Honoring tired muscles is how you prevent burnout and injury! Let's dial down the effort right away.\n\nI suggest swapping today's workout for a **Gentle 8-Minute Chair Mobility & Stretch** routine, or taking an intentional **Rest Day**.\n\nWhich would feel better for your body today?`,
      suggestedAction: {
        id: `workout-easier-${Date.now()}`,
        type: 'UPDATE_WORKOUT',
        summary: 'Switch to 8-Minute Chair Mobility (Gentle Option)',
        details: 'Gentle seated ankle rolls, torso twists, and calf stretches. Zero impact.',
        isHighRisk: false,
        payload: {
          durationMins: 8,
          routineId: 'chair-beginner-strength',
          title: 'Gentle Seated Recovery & Stretch'
        }
      }
    };
  }

  // 4. Detox & Reset, Bloating, Water weight
  if (msg.includes('reset') || msg.includes('detox')) {
    return {
      text: `Let's do a **Safe 24-Hour Gentle Reset**! 🌱\n\nFirst, an important reminder: Your liver and kidneys already handle 100% of your body's natural waste filtration. You never need juice cleanses or starvation.\n\n**Here is your gentle 24-hour reset plan:**\n• **Hydration:** 8 regular glasses of water + 1 glass tender coconut water\n• **Meals:** Balanced home food with extra beans palya / vegetables and warm dal\n• **Movement:** 10 minutes of easy walking or gentle stretching\n• **Sleep:** 30 minutes of screen-free wind-down before bed\n\nWould you like me to activate this reset on your dashboard?`,
      suggestedAction: {
        id: `apply-reset-${Date.now()}`,
        type: 'APPLY_RESET_PLAN',
        summary: 'Activate Gentle 24-Hour Reset on Dashboard',
        details: 'Enables hydration prompts, extra vegetable focus, and 10-minute restorative movement.',
        isHighRisk: false,
        payload: { planId: 'gentle-24h-reset' }
      }
    };
  }

  if (msg.includes('bloated') || msg.includes('weight increased') || msg.includes('scale went up')) {
    return {
      text: `Please do not worry! Scale fluctuations of **0.5 kg to 2.0 kg overnight are almost always water retention, digestion, or hormonal cycle shifts** — never fat gain! 💧\n\nWhy this happens:\n1. **Menstrual Phase:** In the days around your period, progesterone and estrogen cause your cells to retain sodium and water.\n2. **Sodium & Carbohydrates:** A sodium-rich or carb-rich dinner holds water in glycogen stores.\n3. **Digestion:** Food traveling through your digestive system has physical weight.\n\n**What to do:** Drink water normally, eat your regular balanced meals, and consider pausing daily weigh-ins during period weeks so you don't feel anxious. Would you like to pause weight tracking for a few days?`,
      suggestedAction: {
        id: `toggle-weight-${Date.now()}`,
        type: 'TOGGLE_TRACKING',
        summary: 'Pause Weight Tracking for Peace of Mind',
        details: 'Hides weight prompt so you can focus on how your body feels without scale anxiety.',
        isHighRisk: false,
        payload: { module: 'weight', enabled: false }
      }
    };
  }

  if (msg.includes('drink water') || msg.includes('hydration') || msg.includes('log water')) {
    return {
      text: `Staying hydrated makes a noticeable difference to cramps, headaches, and afternoon energy! 💧\n\nA sensible target is **7 to 8 comfortable glasses across the day** (no need to force huge liters).\n\nShall I log **2 glasses of water** to your tracker right now?`,
      suggestedAction: {
        id: `log-water-${Date.now()}`,
        type: 'LOG_WATER',
        summary: 'Log 2 Glasses of Water (500 ml)',
        details: 'Adds 2 glasses to today\'s hydration tally.',
        isHighRisk: false,
        payload: { glasses: 2 }
      }
    };
  }

  if (msg.includes('missed') || msg.includes('restart') || msg.includes('difficult day') || msg.includes('fell off')) {
    return {
      text: `Welcome back with open arms! ❤️\n\nYou did not lose your progress. Life happens, and taking a break is part of being human. In Her Journey 240, streaks are forgiving: we count **every day you show up**, never punishing gaps.\n\nLet's activate a **Minimum Viable Day**: regular comforting meals, 5 minutes of easy strolling, and one kind thought for yourself. Ready to apply?`,
      suggestedAction: {
        id: `mvd-action-${Date.now()}`,
        type: 'SWITCH_MINIMUM_DAY',
        summary: 'Switch Today to Minimum Viable Day',
        details: 'Sets achievable, gentle goals: 5-min walk, hydration, and restful self-care.',
        isHighRisk: false,
        payload: { active: true }
      }
    };
  }

  // 5. Progress summary
  if (msg.includes('progress') || msg.includes('summarize') || msg.includes('consistent')) {
    return {
      text: `Here is your holistic progress check-in! 🌟\n\n• **Journey Day:** Day ${currentDay} of 240\n• **Key Non-Scale Wins:** Starting with self-compassion, choosing gentle period care, learning raw vs cooked kitchen scale awareness\n• **Movement:** Honoring energy-adapted sessions without forcing burnout\n• **Consistency Mindset:** Focus on showing up with love rather than rigid numbers.\n\nYou are laying strong, sustainable foundations that will last for years. Would you like to view your full Non-Scale Wins wall?`,
      suggestedAction: {
        id: `nav-progress-${Date.now()}`,
        type: 'NAVIGATE',
        summary: 'View Progress & Non-Scale Victories',
        details: 'Navigate to Progress tab to see habits, milestones, and reflections.',
        isHighRisk: false,
        payload: { tab: 'progress' }
      }
    };
  }

  // 6. General supportive fallback
  return {
    text: `I hear you! As your wellness companion, I am here to make your journey smoother, kinder, and sustainable.\n\nWhether you need a quick Indian meal idea, a 10-minute movement alternative, advice on raw vs cooked kitchen scale weights, or period symptom comfort, just tell me what feels most helpful right now! ❤️`,
    suggestedAction: {
      id: `gen-chip-${Date.now()}`,
      type: 'NAVIGATE',
      summary: 'Explore Food & Meal Planner',
      details: 'Check out today\'s Indian home meal options and portion guides.',
      isHighRisk: false,
      payload: { tab: 'food' }
    }
  };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'HER JOURNEY 240 API',
    time: new Date().toISOString(),
    aiProvider: process.env.GEMINI_API_KEY ? 'GEMINI_CLOUD' : (process.env.OPENAI_API_KEY ? 'OPENAI_CLOUD' : 'INTELLIGENT_OFFLINE_ENGINE')
  });
});

// AI Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, context, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Safety Red-Flag Check First
    const redFlag = checkForRedFlags(message);
    if (redFlag) {
      const emergencyResponse = generateIntelligentWellnessResponse(message, context);
      return res.json({
        reply: emergencyResponse.text,
        suggestedAction: emergencyResponse.suggestedAction,
        safetyAlert: emergencyResponse.safetyAlert
      });
    }

    // If real Gemini API key is configured, call Gemini API
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const systemPrompt = `You are Rosy, a warm, caring, intelligent wellness companion for an adult woman on a 240-day holistic fitness and self-care journey called "DEEPS MAGICAL JOURNEY — BODY, MIND & US ❤️".
The user profile: 25 years old, 157.5 cm (5'2"), 88.5 kg, beginner, home workouts, treadmill currently paused (using 13-min living room rhythm walks), prefers Indian food (especially South Indian / Bengaluru non-veg with veg alternatives). Journey start date is Oct 24, 2026 (Day 1).
Ethics: Never shame her body, never push extreme deficits or crash diets, never force exercise on period bleed days. Always distinguish between RAW/DRY and COOKED/READY-TO-EAT weights on kitchen scales. If she has chest pain, fainting or severe shortness of breath, immediately urge medical assessment. Keep responses concise, warm, practical, and loving.`;

        const payload = {
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }] }
          ]
        };

        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiText) {
            // Also augment with structured action if applicable
            const localDecision = generateIntelligentWellnessResponse(message, context);
            return res.json({
              reply: aiText,
              suggestedAction: localDecision.suggestedAction,
              safetyAlert: null
            });
          }
        }
      } catch (geminiError) {
        console.warn('Gemini cloud call error, falling back to Intelligent Wellness Engine:', geminiError.message);
      }
    }

    // High quality intelligent engine response
    const wellnessResult = generateIntelligentWellnessResponse(message, context);
    return res.json({
      reply: wellnessResult.text,
      suggestedAction: wellnessResult.suggestedAction,
      safetyAlert: wellnessResult.safetyAlert
    });

  } catch (err) {
    console.error('AI chat endpoint error:', err);
    res.status(500).json({
      error: 'An unexpected error occurred in wellness companion service',
      details: err.message
    });
  }
});

// Serve frontend production build if dist directory exists
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Her Journey 240 Backend running on port ${PORT}`);
});
