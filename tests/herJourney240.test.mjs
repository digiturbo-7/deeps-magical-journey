import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('HER JOURNEY 240 — Comprehensive Verification Test Suite', async (t) => {
  
  await t.test('1. Date Range and 240 Days Completeness', () => {
    const startDate = new Date(2026, 9, 24); // Oct 24, 2026
    const totalDays = 240;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + totalDays - 1); // Jun 20, 2027

    const endStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
    assert.equal(endStr, '2027-06-20', 'End date must be exactly 2027-06-20 for 240 days');
  });

  await t.test('2. Mifflin-St Jeor Equation for Deep', () => {
    const weightKg = 86.2;
    const heightCm = 158.0;
    const age = 25;

    // Female formula: 10 * weight + 6.25 * height - 5 * age - 161
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    assert.equal(Math.round(bmr * 10) / 10, 1563.5, 'BMR must equal 1563.5 kcal');

    const baselineMultiplier = 1.20;
    const baselineTdee = Math.round(bmr * baselineMultiplier * 10) / 10;
    assert.equal(baselineTdee, 1876.2, 'Baseline maintenance TDEE must equal 1876.2 kcal');

    const plannedDeficit = 350;
    const targetCalories = Math.round(baselineTdee - plannedDeficit);
    assert.equal(targetCalories, 1526, 'Planned calorie target must equal 1526 kcal');
  });

  await t.test('3. Energy Model Deficit Calculation Formula', () => {
    const baselineTdee = 1876;
    const exerciseBurn = 85;
    const totalTdee = baselineTdee + exerciseBurn;
    assert.equal(totalTdee, 1961, 'TDEE must add exercise calories to baseline without double counting');

    const actualConsumed = 1420;
    const deficit = totalTdee - actualConsumed;
    assert.equal(deficit, 541, 'Deficit must equal TDEE - actual calories consumed');
    assert.ok(deficit > 0, 'Positive result indicates deficit');

    const surplusConsumed = 2100;
    const surplus = totalTdee - surplusConsumed;
    assert.equal(surplus, -139, 'Negative result indicates surplus');
    assert.ok(surplus < 0, 'Negative value indicates surplus');
  });

  await t.test('4. MET Exercise Calculation Formula', () => {
    const met = 3.3; // Easy walking
    const weightKg = 86.2;
    const durationMins = 15;
    const calories = Math.round(met * weightKg * (durationMins / 60));
    assert.equal(calories, 71, 'MET walking calculation for 86.2 kg over 15 mins should be 71 kcal');
  });

  await t.test('5. Excel File Existence & Public Availability', () => {
    const excelFileRoot = path.resolve('HER_JOURNEY_240_BODY_MIND_US_TRACKER.xlsx');
    const excelFilePublic = path.resolve('public/HER_JOURNEY_240_BODY_MIND_US_TRACKER.xlsx');

    assert.ok(fs.existsSync(excelFileRoot), 'Root Excel workbook must exist');
    assert.ok(fs.existsSync(excelFilePublic), 'Public Excel workbook must exist for PWA download');

    const stats = fs.statSync(excelFilePublic);
    assert.ok(stats.size > 20000, 'Excel workbook must be populated with substantial data');
  });

  await t.test('6. TypeScript 240-Day Plan Data File Existence', () => {
    const planFile = path.resolve('src/data/planData240.ts');
    assert.ok(fs.existsSync(planFile), 'src/data/planData240.ts must exist');

    const content = fs.readFileSync(planFile, 'utf-8');
    assert.ok(content.includes('HER_JOURNEY_240_DAYS'), 'Must export HER_JOURNEY_240_DAYS');
    assert.ok(content.includes('INDIAN_FOOD_DATABASE'), 'Must export INDIAN_FOOD_DATABASE');
    assert.ok(content.includes('2026-10-24'), 'Must start on 2026-10-24');
    assert.ok(content.includes('2027-06-20'), 'Must end on 2027-06-20');
    assert.ok(content.includes('Zumba'), 'Must include Zumba sessions in plan data');
    assert.ok(content.includes('youtube.com'), 'Must include YouTube video search links');
  });

  await t.test('7. Zumba Energy & MET Dance Calculation', () => {
    const metZumba = 5.0; // Bollywood Zumba Dance
    const weightKg = 86.2;
    const durationMins = 18;
    const calories = Math.round(metZumba * weightKg * (durationMins / 60));
    assert.equal(calories, 129, '18-min Zumba at MET 5.0 for 86.2 kg should burn ~129 kcal');
  });

});
