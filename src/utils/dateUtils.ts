// Single reliable date utility for DEEPS MAGICAL JOURNEY ❤️
// All calculations use the user's LOCAL calendar date, never UTC or server dates.

/**
 * Returns the local calendar date string formatted as YYYY-MM-DD.
 * Avoids new Date().toISOString() because UTC conversions produce the wrong calendar day in many timezones.
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a YYYY-MM-DD string into a Date object at local midnight (00:00:00.000).
 * Never uses `new Date(dateStr)` directly because ECMAScript parses YYYY-MM-DD as UTC midnight,
 * which shifts the day backwards or forwards in local timezones.
 */
export function parseLocalDateString(dateStr: string): Date {
  if (!dateStr || typeof dateStr !== 'string') {
    return new Date();
  }
  const parts = dateStr.trim().split('-');
  if (parts.length !== 3) {
    return new Date();
  }
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return new Date();
  }

  return new Date(year, month, day, 0, 0, 0, 0);
}

/**
 * Formats a YYYY-MM-DD string or Date into a human-friendly display date.
 * Example: "Oct 25, 2026" or "Sunday, October 25, 2026"
 */
export function formatDisplayDate(
  dateInput: string | Date,
  options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
): string {
  try {
    const dateObj = typeof dateInput === 'string' ? parseLocalDateString(dateInput) : dateInput;
    return new Intl.DateTimeFormat(undefined, options).format(dateObj);
  } catch {
    return typeof dateInput === 'string' ? dateInput : getLocalDateString(dateInput);
  }
}

/**
 * Returns header-friendly date string: e.g. "Oct 25, 2026"
 */
export function formatHeaderDate(dateInput: string | Date = new Date()): string {
  return formatDisplayDate(dateInput, { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Computes the 1-indexed journey day given a start date and the current date.
 * - Start date corresponds to Day 1.
 * - Local midnight is the boundary.
 * - Returns Math.max(1, dayNumber) so negative numbers are never shown.
 */
export function calculateJourneyDay(
  startDateStr: string,
  currentDateStr: string,
  maxDays: number = 240
): number {
  if (!startDateStr || !currentDateStr) return 1;

  const start = parseLocalDateString(startDateStr);
  const current = parseLocalDateString(currentDateStr);

  const diffTime = current.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const dayNumber = diffDays + 1;
  if (dayNumber < 1) return 1;
  return Math.min(maxDays, dayNumber);
}

/**
 * Calculates current menstrual cycle day (1 to cycleLengthDays)
 * Day 1 corresponds to menstrualStartDate.
 */
export function calculateCycleDay(
  menstrualStartDateStr: string,
  currentDateStr: string,
  cycleLengthDays: number = 28
): number {
  if (!menstrualStartDateStr || !currentDateStr) return 1;

  const start = parseLocalDateString(menstrualStartDateStr);
  const current = parseLocalDateString(currentDateStr);

  const diffTime = current.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 1;
  return (diffDays % cycleLengthDays) + 1;
}

/**
 * Returns the milliseconds until the next local midnight plus a safe 100ms buffer.
 */
export function getMsUntilNextMidnight(now: Date = new Date()): number {
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0, 0, 0, 100
  );
  const diff = nextMidnight.getTime() - now.getTime();
  return Math.max(1000, diff);
}

/**
 * Checks whether two dates represent the exact same local calendar day.
 */
export function isSameDay(date1: string | Date, date2: string | Date): boolean {
  const d1 = typeof date1 === 'string' ? date1 : getLocalDateString(date1);
  const d2 = typeof date2 === 'string' ? date2 : getLocalDateString(date2);
  return d1 === d2;
}
