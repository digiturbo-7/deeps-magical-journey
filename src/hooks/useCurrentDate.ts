import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  getLocalDateString, 
  formatHeaderDate, 
  getMsUntilNextMidnight 
} from '../utils/dateUtils';

export interface CurrentDateInfo {
  todayStr: string;        // "YYYY-MM-DD" in local time
  currentDate: Date;       // Date instance
  formattedDate: string;   // e.g. "Oct 25, 2026"
}

/**
 * Custom hook that maintains and synchronizes the current local calendar date.
 * - Updates instantly at midnight using a timer
 * - Updates on window focus, document visibilitychange, pageshow, and resume
 * - Guards against infinite loops and redundant re-renders
 * - Cleans up timers and event listeners properly
 */
export function useCurrentDate(): CurrentDateInfo {
  const [dateInfo, setDateInfo] = useState<CurrentDateInfo>(() => {
    const now = new Date();
    return {
      todayStr: getLocalDateString(now),
      currentDate: now,
      formattedDate: formatHeaderDate(now)
    };
  });

  const lastDateStrRef = useRef<string>(dateInfo.todayStr);
  const midnightTimerRef = useRef<NodeJS.Timeout | number | null>(null);

  // Function to re-evaluate local calendar date and update state if day changed
  const checkAndUpdateDate = useCallback(() => {
    const now = new Date();
    const newDateStr = getLocalDateString(now);

    if (newDateStr !== lastDateStrRef.current) {
      lastDateStrRef.current = newDateStr;
      setDateInfo({
        todayStr: newDateStr,
        currentDate: now,
        formattedDate: formatHeaderDate(now)
      });
    }
  }, []);

  useEffect(() => {
    // 1. Initial check on mount
    checkAndUpdateDate();

    // 2. Schedule next midnight timer
    const scheduleMidnightTimer = () => {
      if (midnightTimerRef.current) {
        clearTimeout(midnightTimerRef.current as any);
      }
      const msUntilMidnight = getMsUntilNextMidnight();
      midnightTimerRef.current = setTimeout(() => {
        checkAndUpdateDate();
        scheduleMidnightTimer(); // Reschedule for next day
      }, msUntilMidnight);
    };

    scheduleMidnightTimer();

    // 3. Listen to visibility change (user unlocks phone or switches back to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndUpdateDate();
        scheduleMidnightTimer(); // Re-align midnight timer in case device slept
      }
    };

    // 4. Listen to window focus (user clicks back into app)
    const handleFocus = () => {
      checkAndUpdateDate();
    };

    // 5. Listen to pageshow (Safari / mobile PWA back-forward cache and resume)
    const handlePageShow = () => {
      checkAndUpdateDate();
      scheduleMidnightTimer();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      if (midnightTimerRef.current) {
        clearTimeout(midnightTimerRef.current as any);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [checkAndUpdateDate]);

  return dateInfo;
}
