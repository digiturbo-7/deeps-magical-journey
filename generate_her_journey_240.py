"""
HER JOURNEY 240 — BODY, MIND & US ❤️
Master 240-Day Dataset & Real Excel Workbook Generator with DAILY ZUMBA SESSIONS
Generates:
1. public/HER_JOURNEY_240_BODY_MIND_US_TRACKER.xlsx
2. HER_JOURNEY_240_BODY_MIND_US_TRACKER.xlsx
3. src/data/planData240.ts
"""

import os
import json
import datetime
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.chart import LineChart, BarChart, Reference
from openpyxl.worksheet.datavalidation import DataValidation

START_DATE = datetime.date(2026, 10, 24)
TOTAL_DAYS = 240
END_DATE = START_DATE + datetime.timedelta(days=TOTAL_DAYS - 1)  # 2027-06-20

HER_PROFILE = {
    "name": "Deep",
    "age": 25,
    "sex": "Female",
    "height_cm": 158.0,
    "starting_weight_kg": 88.5,
    "current_weight_kg": 86.2,
    "location": "Bengaluru, Karnataka, India",
    "food_preference": "Non-vegetarian (with vegetarian alternatives)",
    "exercise_level": "Joyful beginner Zumba dance & comfortable walking (no gym/weightlifting routine)",
    "goal": "Gradual, sustainable fat loss, better fitness, strength, energy and confidence",
    "start_date": "2026-10-24",
    "end_date": "2027-06-20",
    "total_days": 240,
    "bmr_mifflin": round(10 * 86.2 + 6.25 * 158.0 - 5 * 25 - 161, 1), # 1563.5 kcal
    "baseline_multiplier": 1.20, # Sedentary baseline (exercise logged separately)
    "baseline_tdee": round(1563.5 * 1.20, 1), # 1876.2 kcal
    "moderate_deficit": 350, # Gentle, sustainable deficit
    "target_calories": 1526, # ~1526 kcal (1876 - 350)
    "target_protein_g": 85, # ~1.0 g/kg bodyweight
    "target_carbs_g": 175,
    "target_fat_g": 42,
    "daily_budget_inr": "₹150 - ₹210"
}

# 6 distinct day meal templates to rotate smoothly across 240 days
MEAL_ROTATIONS = [
    # Template 0: Idli + Chicken Curry + Chana + Phulka & Salad
    {
        "menu_name": "Comfort Steamed Staples & Bengaluru Chicken Curry",
        "breakfast": {
            "opt1": "Steamed Idlis (3 pcs, 110g) + Veg Sambar (150ml) + 2 Boiled Eggs (100g) [340 kcal, 19g P, 38g C, 12g F, ₹35]",
            "opt2": "Steamed Idlis (3 pcs) + Veg Sambar + 1 cup warm sprouted moong salad (100g) [310 kcal, 13g P, 46g C, 5g F, ₹25]",
            "opt3": "Ragi Dosa (2 medium, 120g) + Mint Chutney (30g) + 1 Boiled Egg [320 kcal, 14g P, 42g C, 11g F, ₹28]",
            "instructions": "Steam idlis in idli cooker for 10-12 mins. Weigh 110g cooked on kitchen scale.",
            "substitutions": "Can swap toor dal sambar with moong dal or tomato rasam.",
            "cals": 340, "p": 19, "c": 38, "f": 12, "cost": 35
        },
        "snack_morning": {
            "opt1": "Tender Coconut Water (220ml) + Handful Roasted Chana (25g) [130 kcal, 5g P, 22g C, 2g F, ₹40]",
            "opt2": "Fresh Papaya slices (150g) + 5 soaked almonds [110 kcal, 3g P, 22g C, 3g F, ₹30]",
            "instructions": "Sip naturally. Roasting chana gives high-satiety crunch.",
            "substitutions": "Can use tender coconut malai in moderation (1-2 tbsp).",
            "cals": 130, "p": 5, "c": 22, "f": 2, "cost": 40
        },
        "lunch": {
            "opt1": "Sona Masoori Rice (150g cooked / 55g raw) + Bengaluru Chicken Curry (130g raw / 95g cooked meat) + French Beans Palya (130g) + Pepper Rasam [475 kcal, 34g P, 48g C, 14g F, ₹75]",
            "opt2": "2 Soft Wheat Phulkas (80g) + Homestyle Egg Curry (2 eggs in onion-tomato gravy) + Cabbage Poriyal (140g) [440 kcal, 21g P, 48g C, 16g F, ₹40]",
            "opt3": "Sona Masoori Rice (150g) + Thick Toor Dal Tadka (180g) + Paneer Palya (80g paneer) + Fresh Curd (100g) [480 kcal, 23g P, 54g C, 18g F, ₹55]",
            "instructions": "Zero plate on scale, measure 150g warm rice, then add 95g cooked chicken meat without bones.",
            "substitutions": "Swap chicken with 85g paneer or 40g dry soya chunks if cooking vegetarian.",
            "cals": 475, "p": 34, "c": 48, "f": 14, "cost": 75
        },
        "snack_evening": {
            "opt1": "Spiced Boiled Sundal / Chickpeas (80g) with mustard tempering & lemon [140 kcal, 7g P, 22g C, 3g F, ₹20]",
            "opt2": "Roasted Makhana (30g) in 1/2 tsp ghee & rock salt [130 kcal, 3g P, 21g C, 3.5g F, ₹25]",
            "instructions": "Boil soaked chickpeas with a pinch of turmeric. Toss with lemon juice.",
            "substitutions": "Can substitute chickpeas with boiled green peas or sweet corn.",
            "cals": 140, "p": 7, "c": 22, "f": 3, "cost": 20
        },
        "dinner": {
            "opt1": "2 Soft Whole Wheat Phulkas (75g) + Grilled/Pan Chicken Curry (100g meat) + Cucumber Tomato Salad (120g) [420 kcal, 31g P, 42g C, 12g F, ₹65]",
            "opt2": "2 Phulkas (75g) + Fresh Paneer Bhurji (90g paneer with capsicum & onion) + Tomato Clear Soup [440 kcal, 20g P, 42g C, 20g F, ₹55]",
            "opt3": "Warm Rice-Moong Dal Khichdi (220g) + Fresh Curd (100g) + Steamed Beetroot Poriyal (100g) [380 kcal, 14g P, 58g C, 8g F, ₹35]",
            "instructions": "Make phulkas on hot tawa without oil. Squeeze fresh lemon over salad.",
            "substitutions": "Swap phulkas with 1 cup cooked oats khichdi or 2 small ragi rotis.",
            "cals": 420, "p": 31, "c": 42, "f": 12, "cost": 65
        },
        "pre_post": "Optional Pre: 1 small banana (80g) [70 kcal] • Post: 1 glass warm toned milk with turmeric (180ml) [95 kcal, 6g P]",
        "total_cals": 1505, "total_p": 96, "total_c": 172, "total_f": 43, "total_cost": 235
    },
    # Template 1: Poha + Egg Curry + Fruit & Buttermilk + Paneer Bhurji
    {
        "menu_name": "Iron-Rich Poha, Egg Curry & Golden Turmeric Phulkas",
        "breakfast": {
            "opt1": "Vegetable Poha (160g cooked) tempered with mustard & roasted peanuts (15g) + 1 Boiled Egg [330 kcal, 13g P, 44g C, 11g F, ₹28]",
            "opt2": "Vegetable Poha (180g) + 1 glass warm toned milk (150ml) [310 kcal, 11g P, 48g C, 8g F, ₹24]",
            "opt3": "Rolled Oats cooked in milk (40g oats + 180ml toned milk) with half diced apple [290 kcal, 12g P, 45g C, 6g F, ₹30]",
            "instructions": "Rinse thick poha in colander, drain well. Sauté with onion, curry leaves, carrots & roasted peanuts.",
            "substitutions": "Can add 30g boiled green peas to poha for higher fibre.",
            "cals": 330, "p": 13, "c": 44, "f": 11, "cost": 28
        },
        "snack_morning": {
            "opt1": "Spiced Majjige / Buttermilk (220ml) with grated ginger & curry leaves [45 kcal, 3g P, 4g C, 1.5g F, ₹15]",
            "opt2": "1 Crisp Guava or Apple (130g) with pinch of rock salt [75 kcal, 1.5g P, 18g C, 0.5g F, ₹20]",
            "instructions": "Whisk 60g homemade curd with 160ml cold water, pinch of roasted jeera powder and salt.",
            "substitutions": "Can add chopped fresh mint or coriander for digestive coolness.",
            "cals": 45, "p": 3, "c": 4, "f": 1.5, "cost": 15
        },
        "lunch": {
            "opt1": "2 Soft Phulkas (80g) + 2 Boiled Eggs in Onion-Tomato Gravy (120g gravy) + Ridge Gourd (Heerekayi) Palya (140g) [450 kcal, 22g P, 48g C, 17g F, ₹45]",
            "opt2": "Sona Masoori Rice (150g) + Fish Curry (120g rohu/pomfret in light coconut gravy) + Beans Poriyal (120g) [460 kcal, 32g P, 46g C, 13g F, ₹80]",
            "opt3": "Cooked Rice (150g) + Mixed Vegetable Sambar (180g) + Pan-seared Tofu or Paneer (80g) + Cucumber Slices [465 kcal, 21g P, 52g C, 17g F, ₹55]",
            "instructions": "Prick boiled eggs gently before simmering in gravy to absorb rich flavours.",
            "substitutions": "Can use 80g paneer cubes or 40g soya chunks instead of eggs.",
            "cals": 450, "p": 22, "c": 48, "f": 17, "cost": 45
        },
        "snack_evening": {
            "opt1": "Boiled Sweet Corn (120g) with lemon squeeze & chaat masala [120 kcal, 4g P, 24g C, 1.5g F, ₹20]",
            "opt2": "Roasted Kadale / Chana (30g) + Warm Elaichi Green Tea [125 kcal, 6g P, 18g C, 2.5g F, ₹15]",
            "instructions": "Steam sweet corn kernels for 5 mins. Toss hot with lemon juice.",
            "substitutions": "Can substitute sweet corn with boiled groundnuts (20g).",
            "cals": 120, "p": 4, "c": 24, "f": 1.5, "cost": 20
        },
        "dinner": {
            "opt1": "2 Soft Phulkas (75g) + Fresh Paneer Bhurji (90g paneer, capsicum, tomato) + Warm Tomato Rasam (150ml) [445 kcal, 21g P, 44g C, 19g F, ₹60]",
            "opt2": "2 Ragi Rotis (130g) + Chicken Curry (90g cooked meat) + Onion Cucumber Raita (80g) [430 kcal, 30g P, 46g C, 11g F, ₹70]",
            "opt3": "Moong Dal Vegetable Dalia Khichdi (220g) + Fresh Curd (100g) [390 kcal, 16g P, 54g C, 9g F, ₹35]",
            "instructions": "Crumble 90g fresh cow-milk paneer directly into sautéed vegetables on low flame.",
            "substitutions": "Can swap paneer with egg bhurji (2 eggs + 1 white) for lower fat.",
            "cals": 445, "p": 21, "c": 44, "f": 19, "cost": 60
        },
        "pre_post": "Optional Pre: 2 Medjool dates [80 kcal] • Post: 1 boiled egg white or 100g warm milk [55 kcal, 4g P]",
        "total_cals": 1390, "total_p": 63, "total_c": 164, "total_f": 50, "total_cost": 168
    },
    # Template 2: Upma + Fish/Chicken Curry + Sundal + Soya Curry
    {
        "menu_name": "Bengaluru Rava Upma & Fresh Coastal Home Curry",
        "breakfast": {
            "opt1": "Bengaluru Vegetable Rava Upma (180g cooked) with roasted peanuts + 1 Boiled Egg [340 kcal, 14g P, 44g C, 12g F, ₹26]",
            "opt2": "Vegetable Upma (180g) + 1 glass warm toned milk (150ml) [320 kcal, 11g P, 48g C, 9g F, ₹24]",
            "opt3": "Steamed Idlis (3 pcs) with Mint Toor Dal Chutney (40g) + 1 Boiled Egg [320 kcal, 15g P, 42g C, 9g F, ₹28]",
            "instructions": "Dry roast semolina lightly. Tempered with mustard seeds, chana dal, green chillies & mixed veggies.",
            "substitutions": "Can use broken wheat / lapsi rava for extra fiber.",
            "cals": 340, "p": 14, "c": 44, "f": 12, "cost": 26
        },
        "snack_morning": {
            "opt1": "Fresh Fruit Bowl (150g watermelon or papaya) + 6 soaked almonds [110 kcal, 3g P, 22g C, 3g F, ₹30]",
            "opt2": "Tender Coconut Water (220ml) [45 kcal, 1g P, 10g C, 0g F, ₹35]",
            "instructions": "Eat fruit raw. High enzyme content aids morning digestion.",
            "substitutions": "Can use seasonal guava, apple, or pear.",
            "cals": 110, "p": 3, "c": 22, "f": 3, "cost": 30
        },
        "lunch": {
            "opt1": "Sona Masoori Rice (150g cooked) + Bengaluru Fish Curry (120g fresh fish in light gravy) + Cabbage & Pea Poriyal (130g) + Rasam [450 kcal, 33g P, 46g C, 13g F, ₹80]",
            "opt2": "2 Phulkas (80g) + Chicken Curry (95g cooked meat) + Cucumber Carrot Salad (100g) [440 kcal, 31g P, 44g C, 13g F, ₹65]",
            "opt3": "Rice (150g) + Thick Chana Dal (180g) + Beans Palya (130g) + Fresh Curd (100g) [470 kcal, 22g P, 56g C, 15g F, ₹45]",
            "instructions": "Use fresh local fish cuts (rohu, pomfret, or seer fish). Simmer gently for 8 mins.",
            "substitutions": "If fish unavailable: substitute with 120g chicken breast or 100g fresh paneer.",
            "cals": 450, "p": 33, "c": 46, "f": 13, "cost": 80
        },
        "snack_evening": {
            "opt1": "Roasted Puri Kadale / Chana (30g) + Warm Ginger Tea (100ml low-fat milk) [140 kcal, 6g P, 20g C, 3.5g F, ₹18]",
            "opt2": "Spiced Boiled Moong Sprouts (80g) with lime & salt [110 kcal, 7g P, 18g C, 1g F, ₹15]",
            "instructions": "Measure 30g roasted chana in a small bowl. Satisfies tea-time crunch.",
            "substitutions": "Can swap tea with clear black tea or warm lemon water.",
            "cals": 140, "p": 6, "c": 20, "f": 3.5, "cost": 18
        },
        "dinner": {
            "opt1": "2 Soft Phulkas (75g) + Soya Chunks & Green Pea Curry (45g dry soya + 50g peas) + Fresh Curd (80g) [420 kcal, 29g P, 48g C, 9g F, ₹40]",
            "opt2": "2 Phulkas (75g) + 2 Boiled Eggs in Homestyle Curry (100g) + Sliced Cucumber [410 kcal, 21g P, 42g C, 15g F, ₹38]",
            "opt3": "2 Ragi Rotis (120g) + Mixed Vegetable Sambar (180ml) + Sautéed Palak (100g) [380 kcal, 14g P, 54g C, 8g F, ₹30]",
            "instructions": "Boil soya chunks in water with salt, squeeze out water thoroughly, then simmer in onion-tomato gravy.",
            "substitutions": "Soya is naturally 52% protein, an exceptional budget powerhouse.",
            "cals": 420, "p": 29, "c": 48, "f": 9, "cost": 40
        },
        "pre_post": "Optional Pre: 1 cup tender coconut water [45 kcal] • Post: 1 glass warm milk (150ml) [85 kcal, 5g P]",
        "total_cals": 1460, "total_p": 85, "total_c": 180, "total_f": 40.5, "total_cost": 194
    },
    # Template 3: Warm Oats / Muesli + Chicken Rice + Sprouted Salad + Phulka Dal
    {
        "menu_name": "Nourishing Rolled Oats & Tender Chicken Palya",
        "breakfast": {
            "opt1": "Warm Rolled Oats (40g dry + 180ml toned milk) + 1 Boiled Egg + Apple slices (50g) [345 kcal, 18g P, 46g C, 10g F, ₹35]",
            "opt2": "Vegetable Poha (160g cooked) + 2 Boiled Eggs [360 kcal, 18g P, 42g C, 14g F, ₹32]",
            "opt3": "2 Plain Dosas (120g) + Toor Dal Sambar (150ml) + 1 cup warm sprouted moong [330 kcal, 14g P, 48g C, 7g F, ₹25]",
            "instructions": "Cook oats in milk for 4 mins on medium flame. Stir in pinch of cinnamon powder.",
            "substitutions": "Can use instant oats or traditional rolled oats.",
            "cals": 345, "p": 18, "c": 46, "f": 10, "cost": 35
        },
        "snack_morning": {
            "opt1": "Tender Coconut Water (220ml) + 5 Soaked Almonds [95 kcal, 3g P, 12g C, 4g F, ₹40]",
            "opt2": "Fresh Spiced Buttermilk (220ml) with coriander & rock salt [45 kcal, 3g P, 4g C, 1.5g F, ₹15]",
            "instructions": "Soak almonds overnight; peel skins in the morning for optimal nutrient absorption.",
            "substitutions": "Can use 2 whole walnuts instead of almonds.",
            "cals": 95, "p": 3, "c": 12, "f": 4, "cost": 40
        },
        "lunch": {
            "opt1": "Sona Masoori Rice (150g cooked) + Tender Chicken Curry (130g raw / 95g meat) + Palak (Spinach) Palya (140g) + Rasam [470 kcal, 35g P, 46g C, 13g F, ₹75]",
            "opt2": "2 Soft Phulkas (80g) + Fresh Paneer Curry (85g paneer in light gravy) + French Beans Palya (120g) [450 kcal, 21g P, 44g C, 19g F, ₹55]",
            "opt3": "Rice (150g) + Toor Dal Tadka (180g) + 2 Boiled Eggs + Beetroot Poriyal (120g) [460 kcal, 25g P, 52g C, 14g F, ₹42]",
            "instructions": "Weigh raw boneless chicken (130g). Steam spinach lightly with mustard tempering.",
            "substitutions": "Spinach provides bioavailable iron and folates.",
            "cals": 470, "p": 35, "c": 46, "f": 13, "cost": 75
        },
        "snack_evening": {
            "opt1": "Roasted Makhana (30g) + Hot Green Tea with lemon [130 kcal, 3g P, 21g C, 3.5g F, ₹25]",
            "opt2": "Boiled Chickpeas Sundal (70g) with mustard & curry leaves [125 kcal, 6g P, 20g C, 2.5g F, ₹18]",
            "instructions": "Roast makhana on low heat for 5-6 minutes until super crunchy.",
            "substitutions": "Can dust with pinch of turmeric and black pepper.",
            "cals": 130, "p": 3, "c": 21, "f": 3.5, "cost": 25
        },
        "dinner": {
            "opt1": "2 Soft Phulkas (75g) + 2 Boiled Eggs in Tomato Onion Curry + Cucumber Salad (100g) [415 kcal, 21g P, 42g C, 15g F, ₹38]",
            "opt2": "2 Phulkas (75g) + Grilled Chicken Strips (100g cooked) + Mixed Sautéed Capsicum & Onions [425 kcal, 32g P, 40g C, 11g F, ₹65]",
            "opt3": "Warm Moong Dal Vegetable Khichdi (220g) + Fresh Curd (100g) [380 kcal, 15g P, 56g C, 8g F, ₹35]",
            "instructions": "Roll thin phulkas without excess dry flour. Cook on hot cast iron pan.",
            "substitutions": "Can replace 1 whole egg with 2 egg whites for lower dietary fat.",
            "cals": 415, "p": 21, "c": 42, "f": 15, "cost": 38
        },
        "pre_post": "Optional Pre: 1 small banana [70 kcal] • Post: 1 cup warm turmeric milk [90 kcal, 6g P]",
        "total_cals": 1455, "total_p": 80, "total_c": 167, "total_f": 45.5, "total_cost": 213
    },
    # Template 4: Ragi Dosa / Idli + Egg Curry + Fruit + Chicken Phulka
    {
        "menu_name": "Calcium-Rich Ragi Dosa & Fresh Country Egg Feast",
        "breakfast": {
            "opt1": "Ragi Dosa (2 medium, 120g) + Coconut Mint Chutney (30g) + 2 Boiled Eggs [350 kcal, 19g P, 40g C, 13g F, ₹35]",
            "opt2": "Steamed Idlis (3 pcs, 110g) + Vegetable Sambar (150ml) + 1 Boiled Egg [310 kcal, 13g P, 44g C, 8g F, ₹25]",
            "opt3": "Vegetable Upma (180g) + Warm Toned Milk (150ml) [320 kcal, 11g P, 48g C, 9g F, ₹22]",
            "instructions": "Mix ragi flour with equal water, pinch of salt, cumin seeds & chopped onion. Pour on medium hot tawa.",
            "substitutions": "Ragi is rich in calcium and low-glycemic complex carbs.",
            "cals": 350, "p": 19, "c": 40, "f": 13, "cost": 35
        },
        "snack_morning": {
            "opt1": "Fresh Seasonal Fruit (1 Medium Apple or 150g Papaya) + 6 Almonds [115 kcal, 3g P, 22g C, 3.5g F, ₹30]",
            "opt2": "Tender Coconut Water (220ml) [45 kcal, 1g P, 10g C, 0g F, ₹35]",
            "instructions": "Enjoy fresh fruit at room temperature. Almonds provide vitamin E.",
            "substitutions": "Can substitute with 1 fresh sweet orange (mosambi).",
            "cals": 115, "p": 3, "c": 22, "f": 3.5, "cost": 30
        },
        "lunch": {
            "opt1": "2 Soft Phulkas (80g) + Homestyle Egg Curry (2 eggs) + Cabbage & Carrot Poriyal (140g) + Rasam [445 kcal, 22g P, 48g C, 16g F, ₹42]",
            "opt2": "Sona Masoori Rice (150g) + Bengaluru Chicken Curry (95g meat) + Beans Palya (120g) [475 kcal, 34g P, 48g C, 14g F, ₹75]",
            "opt3": "Rice (150g) + Thick Toor Dal Tadka (180g) + Fresh Curd (100g) + Tomato Cucumber Salad [440 kcal, 18g P, 56g C, 14g F, ₹40]",
            "instructions": "Cook vegetables in minimum oil with mustard seeds, curry leaves & grated fresh coconut.",
            "substitutions": "Can use 80g paneer in place of 2 eggs.",
            "cals": 445, "p": 22, "c": 48, "f": 16, "cost": 42
        },
        "snack_evening": {
            "opt1": "Spiced Boiled Sundal / Chickpeas (80g) with lime [140 kcal, 7g P, 22g C, 3g F, ₹20]",
            "opt2": "Roasted Makhana (30g) in 1/2 tsp ghee & rock salt [130 kcal, 3g P, 21g C, 3.5g F, ₹25]",
            "instructions": "Toss chickpeas with curry leaves, mustard seeds, and generous squeeze of lime.",
            "substitutions": "High fibre keeps evening hunger completely absent.",
            "cals": 140, "p": 7, "c": 22, "f": 3, "cost": 20
        },
        "dinner": {
            "opt1": "2 Soft Phulkas (75g) + Home Chicken Curry (100g meat) + Cucumber Salad (100g) [420 kcal, 31g P, 42g C, 12g F, ₹65]",
            "opt2": "2 Phulkas (75g) + Fresh Paneer Bhurji (90g paneer, capsicum, onion) + Clear Soup [440 kcal, 20g P, 42g C, 20g F, ₹55]",
            "opt3": "Rice-Moong Dal Khichdi (220g) + Curd (100g) + Lauki Sabzi (120g) [385 kcal, 14g P, 58g C, 8.5g F, ₹35]",
            "instructions": "Keep dinner light and satisfying. Chew slowly.",
            "substitutions": "Can substitute chicken with fresh rohu fish or egg bhurji.",
            "cals": 420, "p": 31, "c": 42, "f": 12, "cost": 65
        },
        "pre_post": "Optional Pre: 1 cup tender coconut water [45 kcal] • Post: 1 glass warm milk (150ml) [85 kcal, 5g P]",
        "total_cals": 1470, "total_p": 82, "total_c": 174, "total_f": 47.5, "total_cost": 192
    },
    # Template 5: Steamed Idli + Soya Chunks Curry + Fruit + Egg Dinner
    {
        "menu_name": "High-Fiber Soya Chunks & Comfort Idli Sambar",
        "breakfast": {
            "opt1": "Steamed Idlis (3 pcs, 110g) + Vegetable Sambar (150ml) + 2 Boiled Eggs [340 kcal, 19g P, 38g C, 12g F, ₹35]",
            "opt2": "Vegetable Poha (160g cooked) + 1 Boiled Egg [310 kcal, 12g P, 44g C, 9g F, ₹26]",
            "opt3": "Rolled Oats cooked in toned milk (40g + 180ml milk) with 1/2 apple [290 kcal, 12g P, 45g C, 6g F, ₹30]",
            "instructions": "Dip idlis in piping hot sambar. Eggs provide complete amino acid profile.",
            "substitutions": "Can swap sambar with tomato onion chutney.",
            "cals": 340, "p": 19, "c": 38, "f": 12, "cost": 35
        },
        "snack_morning": {
            "opt1": "Spiced Buttermilk / Majjige (220ml) with curry leaves & ginger [45 kcal, 3g P, 4g C, 1.5g F, ₹15]",
            "opt2": "Fresh Papaya slices (150g) + 5 almonds [110 kcal, 3g P, 22g C, 3g F, ₹28]",
            "instructions": "Chilled buttermilk soothes digestive tract.",
            "substitutions": "Great for hydration and electrolyte balance.",
            "cals": 45, "p": 3, "c": 4, "f": 1.5, "cost": 15
        },
        "lunch": {
            "opt1": "Sona Masoori Rice (150g cooked) + Soya Chunks Curry (45g dry soya chunks cooked in onion-tomato gravy) + French Beans Palya (130g) + Rasam [460 kcal, 31g P, 56g C, 9g F, ₹42]",
            "opt2": "2 Phulkas (80g) + Chicken Curry (95g meat) + Cabbage Poriyal (120g) [440 kcal, 31g P, 44g C, 13g F, ₹65]",
            "opt3": "Rice (150g) + Thick Toor Dal (180g) + 2 Boiled Eggs + Ridge Gourd Palya (120g) [455 kcal, 24g P, 52g C, 14g F, ₹40]",
            "instructions": "Soak soya chunks in warm water for 15 mins. Squeeze out bitter water completely before cooking.",
            "substitutions": "Can add 30g boiled green peas to soya curry.",
            "cals": 460, "p": 31, "c": 56, "f": 9, "cost": 42
        },
        "snack_evening": {
            "opt1": "Roasted Kadale / Chana (30g) + Hot Elaichi Tea (100ml milk) [140 kcal, 6g P, 20g C, 3.5g F, ₹18]",
            "opt2": "Roasted Makhana (30g) in ghee & rock salt [130 kcal, 3g P, 21g C, 3.5g F, ₹25]",
            "instructions": "Sip tea slowly without hurried gulping.",
            "substitutions": "Can swap tea with warm cinnamon water.",
            "cals": 140, "p": 6, "c": 20, "f": 3.5, "cost": 18
        },
        "dinner": {
            "opt1": "2 Soft Phulkas (75g) + 2 Boiled Eggs in Mild Curry + Cucumber Carrot Salad (120g) [415 kcal, 21g P, 42g C, 15g F, ₹38]",
            "opt2": "2 Phulkas (75g) + Paneer Bhurji (90g paneer, capsicum, tomato) + Warm Soup [445 kcal, 20g P, 44g C, 19g F, ₹58]",
            "opt3": "2 Ragi Rotis (120g) + Chicken Curry (90g meat) + Cucumber Slices [425 kcal, 30g P, 46g C, 11g F, ₹68]",
            "instructions": "Fresh salad with dinner adds natural hydration and digestive enzymes.",
            "substitutions": "Can replace cucumber with grated carrot or steamed beetroot.",
            "cals": 415, "p": 21, "c": 42, "f": 15, "cost": 38
        },
        "pre_post": "Optional Pre: 1 small banana [70 kcal] • Post: 1 glass warm milk [90 kcal, 6g P]",
        "total_cals": 1400, "total_p": 80, "total_c": 160, "total_f": 41, "total_cost": 151
    }
]

# ------------------------------------------------------------------------------
# ZUMBA DANCE SESSION TEMPLATES (JOYFUL, LOW-IMPACT, BEGINNER-FRIENDLY)
# ------------------------------------------------------------------------------
ZUMBA_TEMPLATES = {
    # Phase 1: Days 1 to 30 (Joyful, gentle, beginner steps)
    "phase1_bollywood_zumba": {
        "title": "15-Min Joyful Beginner Bollywood Zumba Dance Party",
        "duration": 15,
        "burn_cals": 105,
        "met": 4.8,
        "style": "Bollywood Dance Fitness",
        "instructions": "Put on upbeat music! Follow easy beginner dance steps with no jumping. Sway your hips, pump your arms, and have fun. Never worry about perfection — just keep moving and smiling! ❤️",
        "warmup": "2 minutes of slow shoulder rolls, side-to-side step touches, and wrist circles.",
        "cooldown": "2 minutes of gentle salsa breathing, slow swaying, and deep belly breath.",
        "exercises": "Bollywood Bhangra Bounce (3 mins) • Salsa Side-to-Side Step (4 mins) • Merengue March & Arm Reaches (4 mins) • Cumbia Hip Sway (4 mins)",
        "alternatives": "Seated dance moves on a chair with expressive arm rolls and seated foot taps.",
        "youtube_title": "15 Min Beginner Bollywood Dance Workout (Easy, No Jumping, High Energy)",
        "youtube_url": "https://www.youtube.com/results?search_query=15+minute+beginner+bollywood+dance+workout+low+impact"
    },
    "phase1_latin_zumba": {
        "title": "15-Min Feel-Good Latin Zumba Party (Knee-Friendly, Low Impact)",
        "duration": 15,
        "burn_cals": 105,
        "met": 4.8,
        "style": "Latin Fiesta Dance",
        "instructions": "Gentle Latin rhythms (Merengue, Salsa, Bachata). Keep knees soft and absorb rhythm naturally.",
        "warmup": "2 minutes easy hip circles and gentle arm sweeps.",
        "cooldown": "3 minutes calm swaying and calf stretch.",
        "exercises": "Merengue 6-Count March (4 mins) • Salsa Forward & Back Step (4 mins) • Reggaeton Gentle Bounce (3 mins) • Bachata Side Touch (4 mins)",
        "alternatives": "Chair-supported dance steps holding dining table or chair back.",
        "youtube_title": "15 Min Easy Zumba Dance Workout for Beginners (Low Impact)",
        "youtube_url": "https://www.youtube.com/results?search_query=15+minute+easy+zumba+dance+workout+for+beginners+low+impact"
    },
    # Phase 2: Days 31 to 75 (Building rhythm, stamina and mood)
    "phase2_bollywood_zumba": {
        "title": "18-Min Upbeat Bollywood & Latin Zumba Dance Cardio",
        "duration": 18,
        "burn_cals": 135,
        "met": 5.2,
        "style": "Bollywood Cardio Fusion",
        "instructions": "Higher energetic flow! Great for releasing stress, elevating mood, and building stamina through joyful dance.",
        "warmup": "3 minutes rhythmic pacing and shoulder rolls.",
        "cooldown": "2 minutes slow dance sway and hamstring release.",
        "exercises": "Bollywood Balle Balle Step (5 mins) • Salsa Cross Step (5 mins) • Mambo Front & Back (4 mins) • Chassé & Clap (4 mins)",
        "alternatives": "Lower the bounce or take steps smaller whenever you need a breather.",
        "youtube_title": "20 Min Bollywood Zumba Dance Fitness (Fat Burning & Fun)",
        "youtube_url": "https://www.youtube.com/results?search_query=20+minute+bollywood+zumba+dance+fitness+at+home"
    },
    "phase2_pop_zumba": {
        "title": "18-Min Joyful Retro Pop & Dance Hits Zumba Session",
        "duration": 18,
        "burn_cals": 130,
        "met": 5.0,
        "style": "Retro Pop Dance",
        "instructions": "Catchy retro and pop dance beats. Dance like nobody is watching in the comfort of your living room!",
        "warmup": "2 minutes torso roll and ankle circles.",
        "cooldown": "3 minutes soothing deep breathing and upper back release.",
        "exercises": "Grapevine Step & Tap (5 mins) • Disco Point & Sway (4 mins) • Cha-Cha Footwork (5 mins) • High-Five Arm Jive (4 mins)",
        "alternatives": "Seated arm jive and gentle seated sway.",
        "youtube_title": "18-20 Min Retro Pop Dance Workout for Women",
        "youtube_url": "https://www.youtube.com/results?search_query=20+minute+retro+pop+dance+workout+fun+women"
    },
    # Phase 3: Days 76 to 150 (Cardio stamina, full-body tone & radiance)
    "phase3_zumba_fiesta": {
        "title": "20-Min Full Body Zumba Fiesta & Core Tone",
        "duration": 20,
        "burn_cals": 155,
        "met": 5.4,
        "style": "Zumba Fiesta & Tone",
        "instructions": "Full body dance rhythm that naturally engages your core, tones waist, and boosts endurance effortlessly.",
        "warmup": "3 minutes dynamic dance warm-up.",
        "cooldown": "3 minutes slow waltz flow and full body stretch.",
        "exercises": "Cumbia Two-Step & Pump (5 mins) • Bollywood Desi Thumka (5 mins) • Salsa Double Step (5 mins) • Samba Shimmy & Reach (5 mins)",
        "alternatives": "Omit quick pivots; maintain simple two-step touch.",
        "youtube_title": "20-25 Min Zumba Dance Party at Home (Sweat & Smile)",
        "youtube_url": "https://www.youtube.com/results?search_query=20+minute+zumba+dance+party+at+home+sweat+and+smile"
    },
    "phase3_zumba_fusion": {
        "title": "22-Min High-Spirited Bollywood Beats Zumba Cardio",
        "duration": 22,
        "burn_cals": 175,
        "met": 5.5,
        "style": "Bollywood Anthem Dance",
        "instructions": "Infectious beats and expressive hand gestures. Burns calories while feeling like a pure celebration!",
        "warmup": "3 minutes light bounce and shoulder rolls.",
        "cooldown": "3 minutes calming waltz breathing.",
        "exercises": "Dholak Beat March (6 mins) • Punjabi Folk Step (6 mins) • Bollywood Freestyle (5 mins) • Rhythmic Claps & Sway (5 mins)",
        "alternatives": "Pace yourself gently; all moves are customizable.",
        "youtube_title": "20 Min Upbeat Bollywood Dance Workout (Calorie Burn & Joy)",
        "youtube_url": "https://www.youtube.com/results?search_query=20+minute+upbeat+bollywood+dance+workout+home"
    },
    # Phase 4: Days 151 to 240 (Radiant lifestyle & lifelong dance joy)
    "phase4_zumba_celebration": {
        "title": "25-Min Radiant Celebration Zumba Masterclass",
        "duration": 25,
        "burn_cals": 200,
        "met": 5.5,
        "style": "Masterclass Dance Party",
        "instructions": "You are vibrant, strong, and confident! Celebrate your 240-day transformation with joyful dance.",
        "warmup": "3 minutes energetic groove warm-up.",
        "cooldown": "3 minutes graceful gratitude dance cool-down.",
        "exercises": "Full Fiesta Groove (8 mins) • Bollywood Anthem Dance (8 mins) • Latin Salsa Carnival (9 mins)",
        "alternatives": "Take sips of water whenever thirsty and enjoy every song.",
        "youtube_title": "25 Min Zumba Dance Workout for Total Body Fitness",
        "youtube_url": "https://www.youtube.com/results?search_query=25+minute+zumba+dance+workout+total+body+fitness"
    },
    "cycle_gentle_dance": {
        "title": "12-Min Gentle Slow Dance & Pelvic Sway (Restorative Flow)",
        "duration": 12,
        "burn_cals": 55,
        "met": 3.2,
        "style": "Restorative Slow Dance",
        "instructions": "Ultra-gentle soothing music. Slow hip sways that relieve pelvic tension, lower back stiffness, and cramps.",
        "warmup": "2 minutes deep belly breaths sitting or standing softly.",
        "cooldown": "3 minutes supported relaxation with warm water.",
        "exercises": "Gentle Hip Sway (4 mins) • Slow Waltz Step (4 mins) • Supported Side Reach (4 mins)",
        "alternatives": "100% seated on a comfortable sofa or chair.",
        "youtube_title": "10 Min Gentle Restorative Dance & Stretch for Women",
        "youtube_url": "https://www.youtube.com/results?search_query=10+minute+gentle+restorative+dance+and+stretch"
    }
}

def generate_day_records():
    records = []
    for day_idx in range(TOTAL_DAYS):
        day_num = day_idx + 1
        curr_date = START_DATE + datetime.timedelta(days=day_idx)
        date_str = curr_date.strftime("%Y-%m-%d")
        weekday = curr_date.strftime("%A")
        
        # Diet assignment (6-day rotating cycle)
        template_idx = day_idx % len(MEAL_ROTATIONS)
        diet = MEAL_ROTATIONS[template_idx]
        
        # Workout / Rest Day schedule:
        # Day 1 & Day 2 (menstrual start) are Rest / Period Care
        # Thereafter: Wednesdays, Saturdays, and Sundays are scheduled REST DAYS (3 rest days/wk)
        # Mondays, Tuesdays, Thursdays, Fridays are movement days (4 Zumba Dance days/wk)
        is_rest_day = False
        rest_reason = ""
        zumba_session = {}
        
        if day_num == 1:
            is_rest_day = True
            rest_reason = "Day 1 of Journey & Period Care — Honoring your body with warm rest & gentle self-care ❤️"
        elif day_num == 2:
            is_rest_day = False # Optional light restorative dance
            zumba_session = ZUMBA_TEMPLATES["cycle_gentle_dance"]
        elif weekday in ["Wednesday", "Saturday", "Sunday"]:
            is_rest_day = True
            rest_reason = f"Scheduled REST DAY ({weekday}) — Muscle recovery, sleep & nervous system rest. Zero workout pressure! ❤️"
        else:
            is_rest_day = False
            # Determine Phase
            if day_num <= 30:
                if weekday in ["Monday", "Thursday"]:
                    zumba_session = ZUMBA_TEMPLATES["phase1_bollywood_zumba"]
                else:
                    zumba_session = ZUMBA_TEMPLATES["phase1_latin_zumba"]
            elif day_num <= 75:
                if weekday in ["Monday", "Thursday"]:
                    zumba_session = ZUMBA_TEMPLATES["phase2_bollywood_zumba"]
                else:
                    zumba_session = ZUMBA_TEMPLATES["phase2_pop_zumba"]
            elif day_num <= 150:
                if weekday in ["Monday", "Thursday"]:
                    zumba_session = ZUMBA_TEMPLATES["phase3_zumba_fiesta"]
                else:
                    zumba_session = ZUMBA_TEMPLATES["phase3_zumba_fusion"]
            else:
                if weekday in ["Monday", "Thursday"]:
                    zumba_session = ZUMBA_TEMPLATES["phase4_zumba_celebration"]
                else:
                    zumba_session = ZUMBA_TEMPLATES["phase3_zumba_fiesta"]

        rec = {
            "day": day_num,
            "date": date_str,
            "weekday": weekday,
            "is_rest_day": is_rest_day,
            "rest_reason": rest_reason,
            "workout": zumba_session if not is_rest_day else None,
            "diet": diet
        }
        records.append(rec)
    return records

print("Generating 240 day records with Zumba sessions...")
ALL_DAYS = generate_day_records()
print(f"Generated {len(ALL_DAYS)} days from {ALL_DAYS[0]['date']} to {ALL_DAYS[-1]['date']}.")

# ==============================================================================
# CREATE EXCEL WORKBOOK WITH ALL 9 SHEETS, FORMULAS, FORMATTING, & CHARTS
# ==============================================================================
wb = Workbook()
wb.remove(wb.active)

# Styles
font_title = Font(name="Calibri", size=15, bold=True, color="FFFFFF")
font_section = Font(name="Calibri", size=12, bold=True, color="FFFFFF")
font_header = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
font_bold = Font(name="Calibri", size=10, bold=True)
font_regular = Font(name="Calibri", size=10)
font_italic = Font(name="Calibri", size=9, italic=True, color="666666")

fill_brand_dark = PatternFill(start_color="3B1E34", end_color="3B1E34", fill_type="solid") # Deep plum
fill_brand_rose = PatternFill(start_color="8B4268", end_color="8B4268", fill_type="solid") # Rose dust
fill_brand_light = PatternFill(start_color="F9F3F6", end_color="F9F3F6", fill_type="solid") # Soft cream/rose
fill_rest = PatternFill(start_color="E8F5E9", end_color="E8F5E9", fill_type="solid") # Soft gentle green
fill_zumba = PatternFill(start_color="FFF3E0", end_color="FFF3E0", fill_type="solid") # Soft warm peach
fill_zebra = PatternFill(start_color="FDFBF9", end_color="FDFBF9", fill_type="solid")

thin_border_side = Side(border_style="thin", color="E0D6DD")
thin_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)

align_center = Alignment(horizontal="center", vertical="center", wrap_text=True)
align_left = Alignment(horizontal="left", vertical="center", wrap_text=True)
align_right = Alignment(horizontal="right", vertical="center")

# ------------------------------------------------------------------------------
# SHEET 1: SETUP
# ------------------------------------------------------------------------------
ws_setup = wb.create_sheet(title="Setup")
ws_setup.views.sheetView[0].showGridLines = True

ws_setup["A1"] = "HER JOURNEY 240 — PERSONAL SETUP & CALORIE CALCULATOR"
ws_setup["A1"].font = font_title
ws_setup["A1"].fill = fill_brand_dark
ws_setup.merge_cells("A1:D1")
ws_setup.row_dimensions[1].height = 36

setup_data = [
    ("SECTION 1: HER PROFILE", "", "", ""),
    ("Full Name", HER_PROFILE["name"], "Editable in app settings", ""),
    ("Age", HER_PROFILE["age"], "Years", ""),
    ("Sex", HER_PROFILE["sex"], "Used in Mifflin-St Jeor formula", ""),
    ("Current Weight (kg)", HER_PROFILE["current_weight_kg"], "Latest check-in weight", ""),
    ("Baseline Starting Weight (kg)", HER_PROFILE["starting_weight_kg"], "October 24, 2026 baseline", ""),
    ("Height (cm)", HER_PROFILE["height_cm"], "Approx 5'2\" (Ask to confirm in settings)", ""),
    ("Location", HER_PROFILE["location"], "Bengaluru, Karnataka, India", ""),
    ("Food Preference", HER_PROFILE["food_preference"], "Home-cooked South Indian + chicken, egg, veg alts", ""),
    ("Exercise Preference", HER_PROFILE["exercise_level"], "Joyful beginner Zumba YouTube sessions & walking", ""),
    ("Plan Start Date", HER_PROFILE["start_date"], "October 24, 2026 (Day 1)", ""),
    ("Plan End Date", HER_PROFILE["end_date"], "June 20, 2027 (Day 240)", ""),
    ("Total Journey Days", HER_PROFILE["total_days"], "Inclusive calendar days", ""),
    ("", "", "", ""),
    ("SECTION 2: ENERGY & CALORIE CALCULATOR", "", "", ""),
    ("Mifflin-St Jeor BMR (kcal)", "=ROUND(10*B5 + 6.25*B7 - 5*B3 - 161, 1)", "Female BMR formula: 10*W + 6.25*H - 5*Age - 161", "1563.5 kcal"),
    ("Baseline Activity Multiplier", HER_PROFILE["baseline_multiplier"], "Sedentary baseline: desk work & daily life (Zumba logged separately)", "1.20"),
    ("Baseline Maintenance TDEE (kcal)", "=ROUND(B16*B17, 1)", "Baseline daily expenditure before separately logged workouts", "1876.2 kcal"),
    ("Planned Moderate Calorie Deficit (kcal)", HER_PROFILE["moderate_deficit"], "Gentle, non-aggressive sustainable deficit (no starvation)", "350 kcal"),
    ("Planned Daily Calorie Target (kcal)", "=ROUND(B18 - B19, 0)", "Planned daily food calorie intake", "1526 kcal"),
    ("Planned Daily Protein Target (g)", HER_PROFILE["target_protein_g"], "Optimal muscle support (~1.0 g/kg)", "85 g"),
    ("Planned Daily Carbohydrates (g)", HER_PROFILE["target_carbs_g"], "Complex grains: millet, oats, rice, atta", "175 g"),
    ("Planned Daily Fat (g)", HER_PROFILE["target_fat_g"], "Nourishing fats: eggs, curd, seeds, light ghee", "42 g"),
    ("Estimated Daily Meal Cost (INR)", HER_PROFILE["daily_budget_inr"], "Affordable Bengaluru grocery budget", "₹150 - ₹210"),
    ("", "", "", ""),
    ("SECTION 3: SCIENTIFIC METHODOLOGY & PRIVACY DISCLAIMERS", "", "", ""),
    ("Energy Model Rule 1", "Baseline expenditure excludes exercise. Separately logged Zumba & walking calories are added to calculate TDEE.", "", ""),
    ("Energy Model Rule 2", "Deficit = TDEE - Actual Calories Consumed. Positive = Deficit; Negative = Surplus.", "", ""),
    ("Weight Fluctuation Note", "Single-day weigh-ins fluctuate due to menstrual cycle, water retention, and sodium. Never interpret 1-day change as fat gain.", "", ""),
    ("Rest Day Rule", "REST MEANS REST. On rest days, 0 workout calories required, no mandatory cardio or dance, no pressure.", "", ""),
    ("Medical Disclaimer", "All calculations are estimates for educational wellness support, not medical diagnoses or guaranteed fat loss.", "", "")
]

for row_idx, row_vals in enumerate(setup_data, start=2):
    ws_setup.row_dimensions[row_idx].height = 24
    if row_vals[0].startswith("SECTION"):
        ws_setup[f"A{row_idx}"] = row_vals[0]
        ws_setup[f"A{row_idx}"].font = font_section
        ws_setup[f"A{row_idx}"].fill = fill_brand_rose
        ws_setup.merge_cells(f"A{row_idx}:D{row_idx}")
    else:
        ws_setup[f"A{row_idx}"] = row_vals[0]
        ws_setup[f"A{row_idx}"].font = font_bold if row_vals[0] else font_regular
        ws_setup[f"B{row_idx}"] = row_vals[1]
        ws_setup[f"B{row_idx}"].font = font_regular
        ws_setup[f"C{row_idx}"] = row_vals[2]
        ws_setup[f"C{row_idx}"].font = font_italic
        ws_setup[f"D{row_idx}"] = row_vals[3]
        ws_setup[f"D{row_idx}"].font = font_regular
        
        for col in ["A", "B", "C", "D"]:
            ws_setup[f"{col}{row_idx}"].border = thin_border

ws_setup.column_dimensions["A"].width = 38
ws_setup.column_dimensions["B"].width = 24
ws_setup.column_dimensions["C"].width = 65
ws_setup.column_dimensions["D"].width = 18

# ------------------------------------------------------------------------------
# SHEET 2: COMPLETE DAILY DIET PLAN (All 240 Days)
# ------------------------------------------------------------------------------
ws_diet = wb.create_sheet(title="Daily Diet Plan")
ws_diet.views.sheetView[0].showGridLines = True

diet_headers = [
    "Date", "Day #", "Day of Week", "Menu Theme", 
    "Breakfast Option 1 (Recommended)", "Breakfast Option 2 (Alt)", "Breakfast Option 3 (Veg Alt)",
    "Mid-Morning Refresher / Snack",
    "Lunch Option 1 (Non-Veg)", "Lunch Option 2 (Egg/Fish)", "Lunch Option 3 (Veg / Paneer)",
    "Evening Snack & Crunch",
    "Dinner Option 1 (High Protein)", "Dinner Option 2 (Veg Bhurji/Paneer)", "Dinner Option 3 (Light Khichdi/Soup)",
    "Pre / Post Workout Option",
    "Planned Cals (kcal)", "Planned Protein (g)", "Planned Carbs (g)", "Planned Fat (g)", "Estimated Cost (₹)", "Cooking & Kitchen Scale Notes"
]

ws_diet.row_dimensions[1].height = 28
for c_idx, h in enumerate(diet_headers, start=1):
    cell = ws_diet.cell(row=1, column=c_idx, value=h)
    cell.font = font_header
    cell.fill = fill_brand_dark
    cell.alignment = align_center
    cell.border = thin_border

for r_idx, d in enumerate(ALL_DAYS, start=2):
    ws_diet.row_dimensions[r_idx].height = 36
    m = d["diet"]
    row_data = [
        d["date"],
        d["day"],
        d["weekday"],
        m["menu_name"],
        m["breakfast"]["opt1"],
        m["breakfast"]["opt2"],
        m["breakfast"]["opt3"],
        f"{m['snack_morning']['opt1']} | Alt: {m['snack_morning']['opt2']}",
        m["lunch"]["opt1"],
        m["lunch"]["opt2"],
        m["lunch"]["opt3"],
        f"{m['snack_evening']['opt1']} | Alt: {m['snack_evening']['opt2']}",
        m["dinner"]["opt1"],
        m["dinner"]["opt2"],
        m["dinner"]["opt3"],
        m["pre_post"],
        m["total_cals"],
        m["total_p"],
        m["total_c"],
        m["total_f"],
        m["total_cost"],
        f"{m['breakfast']['instructions']} {m['lunch']['instructions']}"
    ]
    for c_idx, val in enumerate(row_data, start=1):
        cell = ws_diet.cell(row=r_idx, column=c_idx, value=val)
        cell.font = font_regular
        cell.border = thin_border
        if c_idx in [1, 2, 3]:
            cell.alignment = align_center
        elif c_idx in [17, 18, 19, 20, 21]:
            cell.alignment = align_right
        else:
            cell.alignment = align_left
        if r_idx % 2 == 0:
            cell.fill = fill_zebra

for c in range(1, len(diet_headers) + 1):
    col_letter = get_column_letter(c)
    if c in [1, 2, 3]:
        ws_diet.column_dimensions[col_letter].width = 13
    elif c in [4, 8, 12, 16]:
        ws_diet.column_dimensions[col_letter].width = 30
    elif c in [17, 18, 19, 20, 21]:
        ws_diet.column_dimensions[col_letter].width = 16
    elif c == 22:
        ws_diet.column_dimensions[col_letter].width = 45
    else:
        ws_diet.column_dimensions[col_letter].width = 38

# ------------------------------------------------------------------------------
# SHEET 3: DAILY ZUMBA & MOVEMENT PLAN (All 240 Days)
# ------------------------------------------------------------------------------
ws_workout = wb.create_sheet(title="Daily Zumba & Movement Plan")
ws_workout.views.sheetView[0].showGridLines = True

workout_headers = [
    "Date", "Day #", "Day of Week", "Session Type", "Zumba Routine / Rest Title", 
    "Duration (Mins)", "Estimated Burn (kcal)", "Dance Style", "Warm-up & Instructions",
    "Main Dance Steps / Flow", "Cool-down & Breathing", "Low-Impact / Chair Modifications",
    "Verified YouTube Zumba Link"
]

ws_workout.row_dimensions[1].height = 28
for c_idx, h in enumerate(workout_headers, start=1):
    cell = ws_workout.cell(row=1, column=c_idx, value=h)
    cell.font = font_header
    cell.fill = fill_brand_dark
    cell.alignment = align_center
    cell.border = thin_border

for r_idx, d in enumerate(ALL_DAYS, start=2):
    ws_workout.row_dimensions[r_idx].height = 32
    if d["is_rest_day"]:
        row_data = [
            d["date"],
            d["day"],
            d["weekday"],
            "REST DAY",
            "REST DAY — Rest, Recover & Nourish ❤️",
            0,
            0,
            "Restorative Rest",
            d["rest_reason"],
            "Zero workout assigned. Rest is 100% productive and honored. Keep hydration & comfortable meals.",
            "Hand on heart, deep peaceful breathing, soothing chamomile or warm water.",
            "Optional gentle stroll around room if desired, never mandatory.",
            "N/A (Scheduled Rest Day)"
        ]
    else:
        w = d["workout"]
        row_data = [
            d["date"],
            d["day"],
            d["weekday"],
            "ZUMBA SESSION",
            w["title"],
            w["duration"],
            w["burn_cals"],
            w.get("style", "Zumba Dance Fitness"),
            w["warmup"] + " " + w["instructions"],
            w["exercises"],
            w["cooldown"],
            w["alternatives"],
            w["youtube_url"]
        ]
    for c_idx, val in enumerate(row_data, start=1):
        cell = ws_workout.cell(row=r_idx, column=c_idx, value=val)
        cell.font = font_regular
        cell.border = thin_border
        if c_idx in [1, 2, 3, 4]:
            cell.alignment = align_center
            if val == "REST DAY":
                cell.fill = fill_rest
                cell.font = font_bold
            elif val == "ZUMBA SESSION":
                cell.fill = fill_zumba
                cell.font = font_bold
        elif c_idx in [6, 7]:
            cell.alignment = align_right
        else:
            cell.alignment = align_left

for c in range(1, len(workout_headers) + 1):
    col_letter = get_column_letter(c)
    if c in [1, 2, 3]:
        ws_workout.column_dimensions[col_letter].width = 13
    elif c in [4, 6, 7]:
        ws_workout.column_dimensions[col_letter].width = 18
    elif c == 5:
        ws_workout.column_dimensions[col_letter].width = 40
    elif c == 8:
        ws_workout.column_dimensions[col_letter].width = 24
    elif c == 13:
        ws_workout.column_dimensions[col_letter].width = 38
    else:
        ws_workout.column_dimensions[col_letter].width = 32

# ------------------------------------------------------------------------------
# SHEET 4: ACTUAL FOOD LOG (Prepopulated with Oct 24-27)
# ------------------------------------------------------------------------------
ws_food_log = wb.create_sheet(title="Actual Food Log")
ws_food_log.views.sheetView[0].showGridLines = True

food_log_headers = [
    "Date", "Meal Category", "Food Item Name", "Quantity / Weight", 
    "Calories (kcal)", "Protein (g)", "Carbs (g)", "Fat (g)", 
    "From Plan?", "Notes"
]

ws_food_log.row_dimensions[1].height = 28
for c_idx, h in enumerate(food_log_headers, start=1):
    cell = ws_food_log.cell(row=1, column=c_idx, value=h)
    cell.font = font_header
    cell.fill = fill_brand_dark
    cell.alignment = align_center
    cell.border = thin_border

sample_food_logs = [
    ("2026-10-24", "Breakfast", "Steamed Idlis with Sambar & 1 Boiled Egg", "2 idlis (100g) + sambar + 1 egg", 260, 13, 34, 7, "Yes", "Period Day 1 comfort breakfast"),
    ("2026-10-24", "Morning Snack", "Tender Coconut Water", "1 glass (220ml)", 45, 1, 10, 0, "Yes", "Electrolyte cramp ease"),
    ("2026-10-24", "Lunch", "Sona Masoori Rice + Dal Sambar + Beans Palya", "140g rice + 180g sambar + 100g beans", 380, 12, 68, 6, "Yes", "Comforting home meal"),
    ("2026-10-24", "Evening Snack", "Roasted Chana & Majjige", "25g chana + 200ml buttermilk", 135, 7, 16, 3, "Yes", "Light snack"),
    ("2026-10-24", "Dinner", "2 Whole Wheat Phulkas + Homestyle Chicken Curry", "2 phulkas (75g) + 120g chicken curry", 430, 29, 44, 13, "Yes", "High protein dinner"),
    ("2026-10-25", "Breakfast", "Vegetable Poha with Peanuts & 1 Boiled Egg", "160g poha + 1 egg", 330, 13, 44, 11, "Yes", "Day 2 breakfast"),
    ("2026-10-25", "Morning Snack", "Fresh Papaya slices", "150g bowl", 60, 1, 14, 0.2, "Yes", "Sweet & refreshing"),
    ("2026-10-25", "Lunch", "2 Soft Phulkas + Egg Curry + Cabbage Poriyal", "2 phulkas + 2 eggs in curry + 120g poriyal", 440, 22, 48, 16, "Yes", "Balanced lunch"),
    ("2026-10-25", "Evening Snack", "Boiled Sweet Corn with Lemon", "1 cup (120g)", 120, 4, 24, 1.5, "Yes", "Hot & tasty"),
    ("2026-10-25", "Dinner", "2 Phulkas + Fresh Paneer Bhurji + Cucumber", "2 phulkas + 90g paneer + 100g cucumber", 445, 21, 44, 19, "Yes", "Satisfying dinner"),
    ("2026-10-26", "Breakfast", "Rava Upma with Peanuts + 1 Boiled Egg", "180g upma + 1 egg", 340, 14, 44, 12, "Yes", "Day 3 breakfast"),
    ("2026-10-26", "Morning Snack", "Spiced Buttermilk (Majjige)", "220ml glass", 45, 3, 4, 1.5, "Yes", "Digestive cool"),
    ("2026-10-26", "Lunch", "Sona Masoori Rice + Bengaluru Chicken Curry + Beans Palya", "150g rice + 95g chicken meat + 130g beans", 475, 34, 48, 14, "Yes", "Post-work nourishing lunch"),
    ("2026-10-26", "Evening Snack", "Roasted Kadale / Chana + Ginger Chai", "30g chana + 1 small chai", 140, 6, 20, 3.5, "Yes", "Evening crunch"),
    ("2026-10-26", "Dinner", "2 Phulkas + Soya Chunks Curry + Curd", "2 phulkas + 45g soya curry + 80g curd", 420, 29, 48, 9, "Yes", "Plant protein dinner"),
    ("2026-10-27", "Breakfast", "Warm Rolled Oats with Milk & Apple + 1 Egg", "40g oats + 180ml milk + 1 egg", 345, 18, 46, 10, "Yes", "Hearty morning start"),
    ("2026-10-27", "Morning Snack", "Tender Coconut Water & 5 Almonds", "1 glass coconut water + 5 almonds", 95, 3, 12, 4, "Yes", "Mid-morning hydration"),
    ("2026-10-27", "Lunch", "Sona Masoori Rice + Tender Chicken Curry + Palak Palya", "150g rice + 95g chicken + 130g palak", 470, 35, 46, 13, "Yes", "Rich in iron & protein"),
    ("2026-10-27", "Evening Snack", "Roasted Makhana in Ghee", "30g bowl", 130, 3, 21, 3.5, "Yes", "Light crunch"),
    ("2026-10-27", "Dinner", "2 Soft Phulkas + 2 Boiled Eggs in Tomato Curry", "2 phulkas + 2 eggs in curry", 415, 21, 42, 15, "Yes", "Warm dinner")
]

for r_idx, log in enumerate(sample_food_logs, start=2):
    ws_food_log.row_dimensions[r_idx].height = 22
    for c_idx, val in enumerate(log, start=1):
        cell = ws_food_log.cell(row=r_idx, column=c_idx, value=val)
        cell.font = font_regular
        cell.border = thin_border
        if c_idx in [1, 2, 9]:
            cell.alignment = align_center
        elif c_idx in [5, 6, 7, 8]:
            cell.alignment = align_right
        else:
            cell.alignment = align_left

for c in range(1, len(food_log_headers) + 1):
    col_letter = get_column_letter(c)
    if c in [1, 2]:
        ws_food_log.column_dimensions[col_letter].width = 16
    elif c in [3, 4]:
        ws_food_log.column_dimensions[col_letter].width = 34
    elif c in [5, 6, 7, 8]:
        ws_food_log.column_dimensions[col_letter].width = 14
    else:
        ws_food_log.column_dimensions[col_letter].width = 24

# ------------------------------------------------------------------------------
# SHEET 5: ACTUAL EXERCISE & ZUMBA LOG
# ------------------------------------------------------------------------------
ws_exercise_log = wb.create_sheet(title="Actual Exercise Log")
ws_exercise_log.views.sheetView[0].showGridLines = True

exercise_headers = [
    "Date", "Zumba / Movement Title", "Duration (Mins)", "Intensity / MET", 
    "Estimated Calories Burned (kcal)", "Estimation Method", "Feeling & Notes"
]

ws_exercise_log.row_dimensions[1].height = 28
for c_idx, h in enumerate(exercise_headers, start=1):
    cell = ws_exercise_log.cell(row=1, column=c_idx, value=h)
    cell.font = font_header
    cell.fill = fill_brand_dark
    cell.alignment = align_center
    cell.border = thin_border

sample_exercise_logs = [
    ("2026-10-24", "Rest Day Honored ❤️", 0, 1.0, 0, "Scheduled Rest Day", "Period Day 1 cramps; rested with warm herbal tea"),
    ("2026-10-25", "12-Min Gentle Slow Dance & Pelvic Sway", 12, 3.2, 55, "MET 3.2 Restorative", "Gentle dance hip sway eased lower back stiffness"),
    ("2026-10-26", "15-Min Joyful Beginner Bollywood Zumba", 15, 4.8, 105, "MET 4.8 Dance Equation", "Loved the upbeat music, smile on face throughout!"),
    ("2026-10-27", "15-Min Feel-Good Latin Zumba Party", 15, 4.8, 105, "MET 4.8 Dance Equation", "Easy steps, no jumping, knee felt great")
]

for r_idx, log in enumerate(sample_exercise_logs, start=2):
    ws_exercise_log.row_dimensions[r_idx].height = 22
    for c_idx, val in enumerate(log, start=1):
        cell = ws_exercise_log.cell(row=r_idx, column=c_idx, value=val)
        cell.font = font_regular
        cell.border = thin_border
        if c_idx in [1]:
            cell.alignment = align_center
        elif c_idx in [3, 4, 5]:
            cell.alignment = align_right
        else:
            cell.alignment = align_left

for c in range(1, len(exercise_headers) + 1):
    col_letter = get_column_letter(c)
    if c == 1:
        ws_exercise_log.column_dimensions[col_letter].width = 16
    elif c == 2:
        ws_exercise_log.column_dimensions[col_letter].width = 38
    elif c in [3, 4, 5]:
        ws_exercise_log.column_dimensions[col_letter].width = 18
    elif c == 6:
        ws_exercise_log.column_dimensions[col_letter].width = 30
    else:
        ws_exercise_log.column_dimensions[col_letter].width = 40

# ------------------------------------------------------------------------------
# SHEET 6: DAILY CALORIE SUMMARY (All 240 Days with REAL FORMULAS)
# ------------------------------------------------------------------------------
ws_summary = wb.create_sheet(title="Daily Calorie Summary")
ws_summary.views.sheetView[0].showGridLines = True

summary_headers = [
    "Date", "Day #", "Day of Week",
    "Actual Calories Consumed (kcal)", "Actual Protein Consumed (g)",
    "Estimated Zumba & Exercise Calories (kcal)",
    "Baseline Daily Expenditure (kcal)", "Estimated Total Daily Expenditure (TDEE) (kcal)",
    "Estimated Calorie Deficit / Surplus (kcal)",
    "Planned Calorie Target (kcal)", "Intake vs Target Variance (kcal)",
    "Scheduled Zumba / Rest", "Session Completed?", "Daily Notes"
]

ws_summary.row_dimensions[1].height = 28
for c_idx, h in enumerate(summary_headers, start=1):
    cell = ws_summary.cell(row=1, column=c_idx, value=h)
    cell.font = font_header
    cell.fill = fill_brand_dark
    cell.alignment = align_center
    cell.border = thin_border

for r_idx, d in enumerate(ALL_DAYS, start=2):
    ws_summary.row_dimensions[r_idx].height = 24
    
    formula_cals = f"=IFERROR(SUMIFS('Actual Food Log'!E:E, 'Actual Food Log'!A:A, A{r_idx}), 0)"
    formula_protein = f"=IFERROR(SUMIFS('Actual Food Log'!F:F, 'Actual Food Log'!A:A, A{r_idx}), 0)"
    formula_exercise = f"=IFERROR(SUMIFS('Actual Exercise Log'!E:E, 'Actual Exercise Log'!A:A, A{r_idx}), 0)"
    formula_baseline = "=Setup!$B$18"
    formula_tdee = f"=IF(D{r_idx}>0, G{r_idx} + F{r_idx}, G{r_idx})"
    formula_deficit = f"=IF(D{r_idx}>0, H{r_idx} - D{r_idx}, 0)"
    formula_target = "=Setup!$B$20"
    formula_var = f"=IF(D{r_idx}>0, D{r_idx} - J{r_idx}, 0)"
    
    plan_label = "REST DAY" if d["is_rest_day"] else d["workout"]["title"]
    status_default = "Rest Day Honored ❤️" if d["is_rest_day"] else ("Completed" if r_idx <= 5 else "Pending")
    
    row_cells = [
        d["date"],
        d["day"],
        d["weekday"],
        formula_cals,
        formula_protein,
        formula_exercise,
        formula_baseline,
        formula_tdee,
        formula_deficit,
        formula_target,
        formula_var,
        plan_label,
        status_default,
        ""
    ]
    
    for c_idx, val in enumerate(row_cells, start=1):
        cell = ws_summary.cell(row=r_idx, column=c_idx, value=val)
        cell.font = font_regular
        cell.border = thin_border
        if c_idx in [1, 2, 3, 13]:
            cell.alignment = align_center
        elif c_idx in [4, 5, 6, 7, 8, 9, 10, 11]:
            cell.alignment = align_right
            if c_idx in [4, 6, 7, 8, 9, 10, 11]:
                cell.number_format = "#,##0"
            elif c_idx == 5:
                cell.number_format = "#,##0.0"
        else:
            cell.alignment = align_left
        if d["is_rest_day"]:
            cell.fill = fill_zebra

for c in range(1, len(summary_headers) + 1):
    col_letter = get_column_letter(c)
    if c in [1, 2, 3]:
        ws_summary.column_dimensions[col_letter].width = 14
    elif c in [4, 5, 6, 7, 8, 9, 10, 11]:
        ws_summary.column_dimensions[col_letter].width = 18
    elif c == 12:
        ws_summary.column_dimensions[col_letter].width = 36
    elif c == 13:
        ws_summary.column_dimensions[col_letter].width = 20
    else:
        ws_summary.column_dimensions[col_letter].width = 24

# ------------------------------------------------------------------------------
# SHEET 7: WEIGHT AND MEASUREMENTS
# ------------------------------------------------------------------------------
ws_weight = wb.create_sheet(title="Weight & Measurements")
ws_weight.views.sheetView[0].showGridLines = True

weight_headers = [
    "Date", "Day #", "Day of Week", "Morning Weight (kg)", 
    "Weekly Rolling Average (kg)", "Weight Change from Baseline (kg)", 
    "Waist Measurement (inches)", "Menstrual / Cycle Phase", "Notes & Non-Scale Victories"
]

ws_weight.row_dimensions[1].height = 28
for c_idx, h in enumerate(weight_headers, start=1):
    cell = ws_weight.cell(row=1, column=c_idx, value=h)
    cell.font = font_header
    cell.fill = fill_brand_dark
    cell.alignment = align_center
    cell.border = thin_border

for r_idx, d in enumerate(ALL_DAYS, start=2):
    ws_weight.row_dimensions[r_idx].height = 22
    
    weight_val = ""
    notes_val = ""
    cycle_val = "Follicular Phase"
    
    if d["day"] == 1:
        weight_val = 88.5
        notes_val = "Starting baseline check-in (88.5 kg). Day 1 period water retention."
        cycle_val = "Menstrual Day 1"
    elif d["day"] == 2:
        weight_val = 86.2
        notes_val = "Current updated weight check-in (86.2 kg). Sustainable progress ❤️"
        cycle_val = "Menstrual Day 2"
    elif d["day"] == 3:
        weight_val = 86.2
        cycle_val = "Menstrual Day 3"
    elif d["day"] == 4:
        weight_val = 86.1
        cycle_val = "Menstrual Day 4"
        notes_val = "Feeling lighter, energized after Bollywood Zumba"

    formula_avg = f'=IF(D{r_idx}<>"", ROUND(AVERAGE(D{max(2, r_idx-6)}:D{r_idx}), 2), "")'
    formula_change = f'=IF(D{r_idx}<>"", ROUND(D{r_idx} - Setup!$B$6, 2), "")'
    
    row_cells = [
        d["date"],
        d["day"],
        d["weekday"],
        weight_val,
        formula_avg,
        formula_change,
        "",
        cycle_val,
        notes_val
    ]
    
    for c_idx, val in enumerate(row_cells, start=1):
        cell = ws_weight.cell(row=r_idx, column=c_idx, value=val)
        cell.font = font_regular
        cell.border = thin_border
        if c_idx in [1, 2, 3, 8]:
            cell.alignment = align_center
        elif c_idx in [4, 5, 6, 7]:
            cell.alignment = align_right
            if c_idx in [4, 5, 6]:
                cell.number_format = "#,##0.00"
        else:
            cell.alignment = align_left
        if r_idx % 2 == 0:
            cell.fill = fill_zebra

for c in range(1, len(weight_headers) + 1):
    col_letter = get_column_letter(c)
    if c in [1, 2, 3]:
        ws_weight.column_dimensions[col_letter].width = 14
    elif c in [4, 5, 6, 7]:
        ws_weight.column_dimensions[col_letter].width = 20
    elif c == 8:
        ws_weight.column_dimensions[col_letter].width = 22
    else:
        ws_weight.column_dimensions[col_letter].width = 45

# ------------------------------------------------------------------------------
# SHEET 8: GROCERY LIST (Affordable Bengaluru Home Staples)
# ------------------------------------------------------------------------------
ws_grocery = wb.create_sheet(title="Grocery List")
ws_grocery.views.sheetView[0].showGridLines = True

ws_grocery["A1"] = "HER JOURNEY 240 — AFFORDABLE BENGALURU GROCERY LIST"
ws_grocery["A1"].font = font_title
ws_grocery["A1"].fill = fill_brand_dark
ws_grocery.merge_cells("A1:F1")
ws_grocery.row_dimensions[1].height = 34

grocery_headers = [
    "Item Name", "Kannada / Regional Name", "Category", 
    "Typical Purchase Qty", "Approx Price (₹)", "Purchase Frequency"
]

ws_grocery.row_dimensions[2].height = 26
for c_idx, h in enumerate(grocery_headers, start=1):
    cell = ws_grocery.cell(row=2, column=c_idx, value=h)
    cell.font = font_header
    cell.fill = fill_brand_rose
    cell.alignment = align_center
    cell.border = thin_border

grocery_items = [
    ("Sona Masoori Rice", "ಅಕ್ಕಿ (Akki)", "Grains & Millets", "5 kg bag", 320, "Monthly"),
    ("Whole Wheat Flour (Atta)", "ಗೋಧಿ ಹಿಟ್ಟು (Godhi Hittu)", "Grains & Millets", "2 kg bag", 110, "Bi-weekly"),
    ("Ragi Flour (Finger Millet)", "ರಾಗಿ ಹಿಟ್ಟು (Ragi Hittu)", "Grains & Millets", "1 kg bag", 60, "Monthly"),
    ("Rolled Oats", "ಓಟ್ಸ್ (Oats)", "Grains & Millets", "1 kg bag", 175, "Monthly"),
    ("Roasted Rava / Semolina", "ರವೆ (Rave)", "Grains & Millets", "1 kg packet", 65, "Monthly"),
    ("Thick Poha (Flattened Rice)", "ಅವಲಕ್ಕಿ (Avalakki)", "Grains & Millets", "1 kg packet", 65, "Monthly"),
    ("Toor Dal", "ತೊಗರಿ ಬೇಳೆ (Togari Bele)", "Dals & Pulses", "1 kg bag", 160, "Monthly"),
    ("Moong Dal", "ಹೆಸರು ಬೇಳೆ (Hesaru Bele)", "Dals & Pulses", "500g", 85, "Monthly"),
    ("Chana Dal", "ಕಡಲೆ ಬೇಳೆ (Kadale Bele)", "Dals & Pulses", "500g", 70, "Monthly"),
    ("Sprouted Green Moong", "ಮೊಳಕೆ ಕಾಳು (Molake Kaalu)", "Dals & Pulses", "500g", 75, "Weekly"),
    ("Kabuli Chana (Chickpeas)", "ಕಡಲೆ ಕಾಳು (Kadale Kaalu)", "Dals & Pulses", "500g", 70, "Monthly"),
    ("Roasted Chana / Puri Kadale", "ಹುರಿಗಡಲೆ (Hurigadale)", "Snacks & Proteins", "500g packet", 65, "Monthly"),
    ("Fresh Chicken Breast / Curry Cuts", "ಕೋಳಿ ಮಾಂಸ (Koli Mamsa)", "Poultry & Meat", "1 kg (Weekly)", 240, "Weekly"),
    ("Farm Fresh Eggs", "ಮೊಟ್ಟೆ (Motte)", "Poultry & Meat", "Crate of 30 pcs", 210, "Bi-weekly"),
    ("Fresh Rohu / Sea Fish", "ಮೀನು (Meenu)", "Poultry & Meat", "500g", 160, "Weekly"),
    ("Fresh Malai Paneer", "ಪನೀರ್ (Paneer)", "Dairy", "200g block", 95, "Weekly"),
    ("Fresh Curd / Nandini Milk", "ಮೊಸರು / ಹಾಲು (Mosaru / Haalu)", "Dairy", "500ml daily", 30, "Daily / Weekly"),
    ("Soya Chunks (Mealmaker)", "ಸೋಯಾ ಚಂಕ್ಸ್ (Soya Chunks)", "Plant Protein", "200g box", 50, "Monthly"),
    ("French Beans", "ಬೀನ್ಸ್ (Beans)", "Fresh Vegetables", "500g", 35, "Weekly"),
    ("Fresh Carrots", "ಕ್ಯಾರೆಟ್ (Carrot)", "Fresh Vegetables", "500g", 30, "Weekly"),
    ("Palak / Spinach", "ಪಾಲಕ್ ಸೊಪ್ಪು (Palak Soppu)", "Fresh Vegetables", "2 bunches", 30, "Weekly"),
    ("Ridge Gourd (Heerekayi)", "ಹೀರೇಕಾಯಿ (Heerekayi)", "Fresh Vegetables", "500g", 35, "Weekly"),
    ("Cabbage & Capsicum", "ಎಲೆಕೋಸು (Elekosu)", "Fresh Vegetables", "1 kg", 40, "Weekly"),
    ("Country Tomatoes & Onions", "ಟೊಮೆಟೊ / ಈರುಳ್ಳಿ", "Fresh Vegetables", "2 kg each", 120, "Weekly"),
    ("Cucumbers (Salad)", "ಸೌತೆಕಾಯಿ (Southekayi)", "Fresh Vegetables", "1 kg", 35, "Weekly"),
    ("Tender Coconut (Elaneeru)", "ಎಳನೀರು (Elaneeru)", "Hydration", "3 pcs weekly", 120, "Weekly"),
    ("Roasted Makhana (Foxnuts)", "ಮಖಾನಾ (Makhana)", "Snacks", "250g packet", 195, "Monthly"),
    ("Raw Almonds (Badam)", "ಬಾದಾಮಿ (Badami)", "Healthy Fats", "250g packet", 220, "Monthly")
]

for r_idx, item in enumerate(grocery_items, start=3):
    ws_grocery.row_dimensions[r_idx].height = 22
    for c_idx, val in enumerate(item, start=1):
        cell = ws_grocery.cell(row=r_idx, column=c_idx, value=val)
        cell.font = font_regular
        cell.border = thin_border
        if c_idx in [3, 4, 6]:
            cell.alignment = align_center
        elif c_idx == 5:
            cell.alignment = align_right
            cell.number_format = "₹#,##0"
        else:
            cell.alignment = align_left
        if r_idx % 2 == 0:
            cell.fill = fill_zebra

for c in range(1, len(grocery_headers) + 1):
    col_letter = get_column_letter(c)
    if c in [1, 2]:
        ws_grocery.column_dimensions[col_letter].width = 30
    elif c in [3, 4, 6]:
        ws_grocery.column_dimensions[col_letter].width = 22
    else:
        ws_grocery.column_dimensions[col_letter].width = 18

# ------------------------------------------------------------------------------
# SHEET 9: DASHBOARD (Summary KPI Cards + Real Openpyxl Charts)
# ------------------------------------------------------------------------------
ws_dash = wb.create_sheet(title="Dashboard")
ws_dash.views.sheetView[0].showGridLines = True

ws_dash["A1"] = "HER JOURNEY 240 — PROGRESS & ZUMBA ADHERENCE DASHBOARD"
ws_dash["A1"].font = font_title
ws_dash["A1"].fill = fill_brand_dark
ws_dash.merge_cells("A1:H1")
ws_dash.row_dimensions[1].height = 36

# KPI Cards
kpis = [
    ("TOTAL JOURNEY", "240 Days", "Oct 24, 2026 – Jun 20, 2027", "A3", "B4"),
    ("BASELINE WEIGHT", "88.5 kg", "October 24, 2026", "C3", "D4"),
    ("CURRENT WEIGHT", "86.2 kg", "Progress: -2.3 kg reduction ❤️", "E3", "F4"),
    ("DAILY MOVEMENT", "Joyful Zumba", "15–20 mins • Fun Bollywood & Latin", "G3", "H4"),
]

for title, val, sub, top_l, bot_r in kpis:
    col_start = top_l[0]
    row_start = int(top_l[1])
    col_end = bot_r[0]
    row_end = int(bot_r[1])
    
    ws_dash[top_l] = f"{title}\n{val}\n{sub}"
    ws_dash[top_l].font = font_bold
    ws_dash[top_l].fill = fill_brand_light
    ws_dash[top_l].alignment = align_center
    ws_dash.merge_cells(f"{top_l}:{bot_r}")
    
    for r in range(row_start, row_end + 1):
        for c in range(ord(col_start) - 64, ord(col_end) - 64 + 1):
            ws_dash.cell(row=r, column=c).border = thin_border

ws_dash.row_dimensions[3].height = 25
ws_dash.row_dimensions[4].height = 30

# Chart 1: Weight Trend Line Chart
chart_weight = LineChart()
chart_weight.title = "Weight Trend & 7-Day Rolling Average (kg)"
chart_weight.style = 13
chart_weight.y_axis.title = "Weight (kg)"
chart_weight.x_axis.number_format = "yyyy-mm-dd"
chart_weight.x_axis.majorTimeUnit = "days"
chart_weight.width = 18
chart_weight.height = 10

data_weight = Reference(ws_weight, min_col=4, min_row=1, max_col=5, max_row=15)
dates_weight = Reference(ws_weight, min_col=1, min_row=2, max_row=15)
chart_weight.add_data(data_weight, titles_from_data=True)
chart_weight.set_categories(dates_weight)

ws_dash.add_chart(chart_weight, "A6")

# Chart 2: Calorie Intake vs Target Bar Chart
chart_cals = BarChart()
chart_cals.type = "col"
chart_cals.title = "Daily Calorie Intake vs Planned Target (kcal)"
chart_cals.style = 10
chart_cals.y_axis.title = "Calories (kcal)"
chart_cals.width = 18
chart_cals.height = 10

data_cals = Reference(ws_summary, min_col=4, min_row=1, max_col=4, max_row=15)
dates_cals = Reference(ws_summary, min_col=1, min_row=2, max_row=15)
chart_cals.add_data(data_cals, titles_from_data=True)
chart_cals.set_categories(dates_cals)

ws_dash.add_chart(chart_cals, "E6")

# Chart 3: Deficit Trend Chart
chart_deficit = LineChart()
chart_deficit.title = "Estimated Daily Calorie Deficit (TDEE - Consumed)"
chart_deficit.style = 11
chart_deficit.y_axis.title = "Calorie Deficit (kcal)"
chart_deficit.width = 18
chart_deficit.height = 10

data_def = Reference(ws_summary, min_col=9, min_row=1, max_col=9, max_row=15)
dates_def = Reference(ws_summary, min_col=1, min_row=2, max_row=15)
chart_deficit.add_data(data_def, titles_from_data=True)
chart_deficit.set_categories(dates_def)

ws_dash.add_chart(chart_deficit, "A22")

# Chart 4: Protein Intake Chart
chart_protein = BarChart()
chart_protein.type = "col"
chart_protein.title = "Actual Daily Protein Intake (g)"
chart_protein.style = 12
chart_protein.y_axis.title = "Protein (g)"
chart_protein.width = 18
chart_protein.height = 10

data_prot = Reference(ws_summary, min_col=5, min_row=1, max_col=5, max_row=15)
dates_prot = Reference(ws_summary, min_col=1, min_row=2, max_row=15)
chart_protein.add_data(data_prot, titles_from_data=True)
chart_protein.set_categories(dates_prot)

ws_dash.add_chart(chart_protein, "E22")

for c in range(1, 9):
    ws_dash.column_dimensions[get_column_letter(c)].width = 15

# Save Excel files:
excel_filename = "HER_JOURNEY_240_BODY_MIND_US_TRACKER.xlsx"
os.makedirs("public", exist_ok=True)
wb.save(excel_filename)
wb.save(os.path.join("public", excel_filename))
print(f"Successfully generated master Excel workbook at: {excel_filename} and public/{excel_filename}")

# ==============================================================================
# EXPORT COMPLETE 240-DAY DATASET FOR PWA CONSUMPTION (src/data/planData240.ts)
# ==============================================================================
ts_code = f"""// HER JOURNEY 240 — Complete 240-Day Master Dataset with Daily Zumba Sessions
// Automatically generated for offline PWA operation with zero external dependencies.

export interface DayDietPlanItem {{
  title: string;
  cals: number;
  protein: number;
  carbs: number;
  fat: number;
  cost: number;
  options: string[];
  instructions: string;
  substitutions: string;
}}

export interface DayRecord240 {{
  day: number;
  date: string;
  weekday: string;
  isRestDay: boolean;
  restReason: string;
  workout: {{
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
  }} | null;
  diet: {{
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
  }};
}}

// 6 Balanced Indian Meal Templates (Rotated continuously across 240 days)
const MEAL_TEMPLATES = {json.dumps([{
  "menuName": m["menu_name"],
  "breakfast": {
    "title": m["breakfast"]["opt1"].split("[")[0].strip(),
    "cals": m["breakfast"]["cals"],
    "protein": m["breakfast"]["p"],
    "carbs": m["breakfast"]["c"],
    "fat": m["breakfast"]["f"],
    "cost": m["breakfast"]["cost"],
    "options": [m["breakfast"]["opt1"], m["breakfast"]["opt2"], m["breakfast"]["opt3"]],
    "instructions": m["breakfast"]["instructions"],
    "substitutions": m["breakfast"]["substitutions"]
  },
  "snackMorning": {
    "title": m["snack_morning"]["opt1"].split("[")[0].strip(),
    "cals": m["snack_morning"]["cals"],
    "protein": m["snack_morning"]["p"],
    "carbs": m["snack_morning"]["c"],
    "fat": m["snack_morning"]["f"],
    "cost": m["snack_morning"]["cost"],
    "options": [m["snack_morning"]["opt1"], m["snack_morning"]["opt2"]],
    "instructions": m["snack_morning"]["instructions"],
    "substitutions": m["snack_morning"]["substitutions"]
  },
  "lunch": {
    "title": m["lunch"]["opt1"].split("[")[0].strip(),
    "cals": m["lunch"]["cals"],
    "protein": m["lunch"]["p"],
    "carbs": m["lunch"]["c"],
    "fat": m["lunch"]["f"],
    "cost": m["lunch"]["cost"],
    "options": [m["lunch"]["opt1"], m["lunch"]["opt2"], m["lunch"]["opt3"]],
    "instructions": m["lunch"]["instructions"],
    "substitutions": m["lunch"]["substitutions"]
  },
  "snackEvening": {
    "title": m["snack_evening"]["opt1"].split("[")[0].strip(),
    "cals": m["snack_evening"]["cals"],
    "protein": m["snack_evening"]["p"],
    "carbs": m["snack_evening"]["c"],
    "fat": m["snack_evening"]["f"],
    "cost": m["snack_evening"]["cost"],
    "options": [m["snack_evening"]["opt1"], m["snack_evening"]["opt2"]],
    "instructions": m["snack_evening"]["instructions"],
    "substitutions": m["snack_evening"]["substitutions"]
  },
  "dinner": {
    "title": m["dinner"]["opt1"].split("[")[0].strip(),
    "cals": m["dinner"]["cals"],
    "protein": m["dinner"]["p"],
    "carbs": m["dinner"]["c"],
    "fat": m["dinner"]["f"],
    "cost": m["dinner"]["cost"],
    "options": [m["dinner"]["opt1"], m["dinner"]["opt2"], m["dinner"]["opt3"]],
    "instructions": m["dinner"]["instructions"],
    "substitutions": m["dinner"]["substitutions"]
  },
  "prePost": m["pre_post"],
  "totalCals": m["total_cals"],
  "totalP": m["total_p"],
  "totalC": m["total_c"],
  "totalF": m["total_f"],
  "totalCost": m["total_cost"]
} for m in MEAL_ROTATIONS], indent=2)};

// Joyful Zumba Dance Templates
const ZUMBA_TEMPLATES: Record<string, NonNullable<DayRecord240['workout']>> = {json.dumps({
  k: {
    "title": v["title"],
    "duration": v["duration"],
    "burnCals": v["burn_cals"],
    "met": v["met"],
    "style": v.get("style", "Zumba Dance Fitness"),
    "instructions": v["instructions"],
    "warmup": v["warmup"],
    "cooldown": v["cooldown"],
    "exercises": v["exercises"],
    "alternatives": v["alternatives"],
    "youtubeTitle": v["youtube_title"],
    "youtubeUrl": v["youtube_url"]
  } for k, v in ZUMBA_TEMPLATES.items()
}, indent=2)};

export const PLAN_START_DATE = '2026-10-24';
export const PLAN_END_DATE = '2027-06-20';

function generateAll240Days(): DayRecord240[] {{
  const days: DayRecord240[] = [];
  const startParts = PLAN_START_DATE.split('-').map(Number);
  const startYear = startParts[0];
  const startMonth = startParts[1] - 1;
  const startDay = startParts[2];

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (let i = 0; i < 240; i++) {{
    const d = new Date(startYear, startMonth, startDay + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(d.getDate()).padStart(2, '0');
    const dateStr = `${{year}}-${{month}}-${{dayOfMonth}}`;
    const weekday = weekdays[d.getDay()];
    const dayNum = i + 1;

    const m = MEAL_TEMPLATES[i % MEAL_TEMPLATES.length];

    let isRestDay = false;
    let restReason = '';
    let workout: DayRecord240['workout'] = null;

    if (dayNum === 1) {{
      isRestDay = true;
      restReason = 'Day 1 of Journey & Period Care — Honoring your body with warm rest & gentle self-care ❤️';
    }} else if (dayNum === 2) {{
      isRestDay = false;
      workout = ZUMBA_TEMPLATES['cycle_gentle_dance'];
    }} else if (weekday === 'Wednesday' || weekday === 'Saturday' || weekday === 'Sunday') {{
      isRestDay = true;
      restReason = `Scheduled REST DAY (${{weekday}}) — Muscle recovery, sleep & nervous system rest. Zero workout pressure! ❤️`;
    }} else {{
      isRestDay = false;
      if (dayNum <= 30) {{
        workout = (weekday === 'Monday' || weekday === 'Thursday')
          ? ZUMBA_TEMPLATES['phase1_bollywood_zumba']
          : ZUMBA_TEMPLATES['phase1_latin_zumba'];
      }} else if (dayNum <= 75) {{
        workout = (weekday === 'Monday' || weekday === 'Thursday')
          ? ZUMBA_TEMPLATES['phase2_bollywood_zumba']
          : ZUMBA_TEMPLATES['phase2_pop_zumba'];
      }} else if (dayNum <= 150) {{
        workout = (weekday === 'Monday' || weekday === 'Thursday')
          ? ZUMBA_TEMPLATES['phase3_zumba_fiesta']
          : ZUMBA_TEMPLATES['phase3_zumba_fusion'];
      }} else {{
        workout = (weekday === 'Monday' || weekday === 'Thursday')
          ? ZUMBA_TEMPLATES['phase4_zumba_celebration']
          : ZUMBA_TEMPLATES['phase3_zumba_fiesta'];
      }}
    }}

    days.push({{
      day: dayNum,
      date: dateStr,
      weekday,
      isRestDay,
      restReason,
      workout: workout ? {{ ...workout }} : null,
      diet: {{
        menuName: m.menuName,
        breakfast: {{ ...m.breakfast, options: [...m.breakfast.options] }},
        snackMorning: {{ ...m.snackMorning, options: [...m.snackMorning.options] }},
        lunch: {{ ...m.lunch, options: [...m.lunch.options] }},
        snackEvening: {{ ...m.snackEvening, options: [...m.snackEvening.options] }},
        dinner: {{ ...m.dinner, options: [...m.dinner.options] }},
        prePost: m.prePost,
        totalCals: m.totalCals,
        totalP: m.totalP,
        totalC: m.totalC,
        totalF: m.totalF,
        totalCost: m.totalCost
      }}
    }});
  }}

  return days;
}}

export const HER_JOURNEY_240_DAYS: DayRecord240[] = generateAll240Days();
"""

ts_code += """export const INDIAN_FOOD_DATABASE = [
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
"""

with open("src/data/planData240.ts", "w", encoding="utf-8") as f:
    f.write(ts_code)

print("Saved src/data/planData240.ts successfully with Daily Zumba sessions!")
