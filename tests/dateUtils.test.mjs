import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  getLocalDateString,
  parseLocalDateString,
  formatDisplayDate,
  formatHeaderDate,
  calculateJourneyDay,
  calculateCycleDay,
  getMsUntilNextMidnight,
  isSameDay
} from '../src/utils/dateUtils.ts';

describe('Local Date Utilities Test Suite', () => {

  test('getLocalDateString returns accurate YYYY-MM-DD in local time without UTC offset drift', () => {
    // Test midday
    const d1 = new Date(2026, 9, 25, 12, 0, 0); // Oct 25, 2026
    assert.equal(getLocalDateString(d1), '2026-10-25');

    // Test late night (23:45) - should still be Oct 25 locally, even if UTC has crossed to Oct 26
    const d2 = new Date(2026, 9, 25, 23, 45, 0);
    assert.equal(getLocalDateString(d2), '2026-10-25');

    // Test early morning (00:15) - should be Oct 25 locally, even if UTC is still on Oct 24
    const d3 = new Date(2026, 9, 25, 0, 15, 0);
    assert.equal(getLocalDateString(d3), '2026-10-25');
  });

  test('parseLocalDateString parses YYYY-MM-DD into local midnight', () => {
    const parsed = parseLocalDateString('2026-10-24');
    assert.equal(parsed.getFullYear(), 2026);
    assert.equal(parsed.getMonth(), 9); // October is month 9 (0-indexed)
    assert.equal(parsed.getDate(), 24);
    assert.equal(parsed.getHours(), 0);
    assert.equal(parsed.getMinutes(), 0);
    assert.equal(parsed.getSeconds(), 0);

    // Handles invalid or empty strings gracefully
    const fallback = parseLocalDateString('');
    assert.ok(fallback instanceof Date);
    const fallbackInvalid = parseLocalDateString('invalid-date');
    assert.ok(fallbackInvalid instanceof Date);
  });

  test('calculateJourneyDay computes correct day, preserves Day 1, and clamps properly', () => {
    const startDate = '2026-10-24';

    // Day 1: on the start date itself
    assert.equal(calculateJourneyDay(startDate, '2026-10-24'), 1);

    // Day 2: day after start date
    assert.equal(calculateJourneyDay(startDate, '2026-10-25'), 2);

    // Day 14: end of Phase 1
    assert.equal(calculateJourneyDay(startDate, '2026-11-06'), 14);

    // Date before start date must never return negative or 0
    assert.equal(calculateJourneyDay(startDate, '2026-10-20'), 1);
    assert.equal(calculateJourneyDay(startDate, '2025-01-01'), 1);

    // Clamps to max 240 days
    // 239 days after 2026-10-24 is Day 240
    const startObj = parseLocalDateString(startDate);
    const day240Date = new Date(startObj.getFullYear(), startObj.getMonth(), startObj.getDate() + 239);
    const day240Str = getLocalDateString(day240Date);
    assert.equal(calculateJourneyDay(startDate, day240Str), 240);

    // Beyond Day 240 remains 240
    const day300Date = new Date(startObj.getFullYear(), startObj.getMonth(), startObj.getDate() + 300);
    const day300Str = getLocalDateString(day300Date);
    assert.equal(calculateJourneyDay(startDate, day300Str), 240);
  });

  test('calculateCycleDay handles 28-day cycle progression and midnight rollover', () => {
    const periodStart = '2026-10-24';

    // Bleed Day 1
    assert.equal(calculateCycleDay(periodStart, '2026-10-24', 28), 1);

    // Bleed Day 2
    assert.equal(calculateCycleDay(periodStart, '2026-10-25', 28), 2);

    // Mid-cycle ovulation (around Day 14)
    const startObj = parseLocalDateString(periodStart);
    const day14Date = new Date(startObj.getFullYear(), startObj.getMonth(), startObj.getDate() + 13);
    assert.equal(calculateCycleDay(periodStart, getLocalDateString(day14Date), 28), 14);

    // Day 28 (last day before rollover)
    const day28Date = new Date(startObj.getFullYear(), startObj.getMonth(), startObj.getDate() + 27);
    assert.equal(calculateCycleDay(periodStart, getLocalDateString(day28Date), 28), 28);

    // Day 29 rolls back to Cycle Day 1
    const day29Date = new Date(startObj.getFullYear(), startObj.getMonth(), startObj.getDate() + 28);
    assert.equal(calculateCycleDay(periodStart, getLocalDateString(day29Date), 28), 1);

    // Date before start returns 1 safely
    assert.equal(calculateCycleDay(periodStart, '2026-10-20', 28), 1);
  });

  test('getMsUntilNextMidnight calculates remaining time to local midnight accurately', () => {
    const testNow = new Date(2026, 9, 25, 23, 59, 0, 0); // 1 minute before midnight
    const ms = getMsUntilNextMidnight(testNow);
    // Should be roughly 60,100 ms (60 seconds + 100ms buffer)
    assert.ok(ms >= 60000 && ms <= 60200, `Expected ~60100ms, got ${ms}`);

    // Midday (12:00:00) should be roughly 12 hours
    const midday = new Date(2026, 9, 25, 12, 0, 0, 0);
    const msMidday = getMsUntilNextMidnight(midday);
    assert.ok(msMidday >= 43200000 && msMidday <= 43200200, `Expected ~12hrs in ms, got ${msMidday}`);
  });

  test('formatDisplayDate formats local date correctly', () => {
    const formatted = formatDisplayDate('2026-10-25');
    assert.ok(formatted.includes('Oct') || formatted.includes('October'), `Expected month in '${formatted}'`);
    assert.ok(formatted.includes('25'), `Expected day 25 in '${formatted}'`);
    assert.ok(formatted.includes('2026'), `Expected year 2026 in '${formatted}'`);
  });

  test('isSameDay accurately tests same day equality', () => {
    assert.equal(isSameDay('2026-10-24', '2026-10-24'), true);
    assert.equal(isSameDay('2026-10-24', '2026-10-25'), false);
    assert.equal(isSameDay(new Date(2026, 9, 24, 2, 0), new Date(2026, 9, 24, 23, 0)), true);
    assert.equal(isSameDay(new Date(2026, 9, 24, 23, 59), new Date(2026, 9, 25, 0, 1)), false);
  });

});
