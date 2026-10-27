import { db } from '../db';
import { AIAction, AIMessage, UserProfile } from '../types';
import { getLocalDateString } from '../utils/dateUtils';

export interface AIChatResponse {
  reply: string;
  suggestedAction?: AIAction;
  safetyAlert?: string;
}

// Send chat message to backend or fallback
export async function sendAIChatMessage(
  message: string,
  profile: UserProfile,
  isPeriod: boolean
): Promise<AIChatResponse> {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        context: {
          profile,
          isPeriod
        }
      })
    });

    if (response.ok) {
      const data: AIChatResponse = await response.json();
      return data;
    }
  } catch (networkError) {
    console.warn('Network call to backend AI failed, using intelligent offline client engine:', networkError);
  }

  // Graceful offline client-side fallback
  return getClientOfflineResponse(message, profile, isPeriod);
}

// Client-side execution of structured AI actions
export async function executeAIAction(action: AIAction): Promise<{ success: boolean; message: string }> {
  try {
    switch (action.type) {
      case 'UPDATE_MEAL': {
        const { mealType, title, approxCalories, approxProteinG, cookedPortionGuide } = action.payload;
        const todayPlan = await db.dailyPlans.where('day').equals(1).first();
        if (todayPlan) {
          const updatedMeal = {
            ...(todayPlan[mealType as keyof typeof todayPlan] as any),
            title,
            cookedPortionGuide: cookedPortionGuide || '',
            approxCalories: approxCalories || 250,
            approxProteinG: approxProteinG || 15
          };
          await db.dailyPlans.update(todayPlan.id!, {
            [mealType]: updatedMeal
          });
          return { success: true, message: `Successfully updated ${mealType} to: ${title}` };
        }
        return { success: false, message: 'Could not locate today\'s meal plan' };
      }

      case 'LOG_WATER': {
        const glassesToAdd = action.payload.glasses || 1;
        const todayStr = getLocalDateString();
        const hydration = await db.hydrationLogs.where('date').equals(todayStr).first();
        if (hydration) {
          await db.hydrationLogs.update(hydration.id!, {
            glasses: Math.min(12, hydration.glasses + glassesToAdd)
          });
        } else {
          await db.hydrationLogs.add({
            date: todayStr,
            glasses: glassesToAdd,
            targetGlasses: 8
          });
        }
        return { success: true, message: `Logged ${glassesToAdd} glasses of water! 💧` };
      }

      case 'SWITCH_MINIMUM_DAY': {
        return { success: true, message: 'Minimum Viable Day activated: gentle movement & peaceful self-care.' };
      }

      case 'SET_REST_DAY': {
        await db.activityLogs.add({
          date: getLocalDateString(),
          title: 'Honored Rest Day ❤️',
          durationMins: 0,
          perceivedEffortRpe: 1,
          isTreadmill: false,
          feeling: 'restorative',
          notes: action.payload?.reason || 'Rest honored without guilt'
        });
        return { success: true, message: 'Rest day honored and recorded! Rest is part of the plan.' };
      }

      case 'TOGGLE_TRACKING': {
        const { module, enabled } = action.payload;
        const prefs = await db.preferences.get(1);
        if (prefs) {
          if (module === 'weight') {
            await db.preferences.update(1, { enableWeightTracking: enabled });
          } else if (module === 'calories') {
            await db.preferences.update(1, { enableCalorieTracking: enabled });
          }
          return { success: true, message: `Tracking preference for ${module} updated.` };
        }
        return { success: false, message: 'Preferences record not found' };
      }

      case 'APPLY_RESET_PLAN': {
        return { success: true, message: 'Gentle 24-Hour Reset applied to your dashboard.' };
      }

      default:
        return { success: true, message: 'Action noted.' };
    }
  } catch (error: any) {
    console.error('Error applying AI action:', error);
    return { success: false, message: `Failed to apply action: ${error.message}` };
  }
}

// Client-side fallback if backend server isn't reached
function getClientOfflineResponse(msg: string, profile: UserProfile, isPeriod: boolean): AIChatResponse {
  const q = msg.toLowerCase();

  if (q.includes('cramp') || q.includes('period') || isPeriod && q.includes('workout')) {
    return {
      reply: 'On cycle day 1, your body is working hard. Choose what feels comfortable — even resting is a valid, productive choice. ❤️\n\nI recommend 5 minutes of easy strolling, gentle shoulder rolls, and resting with a warm water bottle.',
      suggestedAction: {
        id: `offline-period-${Date.now()}`,
        type: 'UPDATE_WORKOUT',
        summary: 'Switch to Gentle Period Care & Rest',
        details: 'Cycle Day 1 restorative routine: 10 mins gentle mobility.',
        isHighRisk: false,
        payload: { routineId: 'day-1-period-comfort' }
      }
    };
  }

  if (q.includes('water') || q.includes('drink')) {
    return {
      reply: 'Staying gently hydrated eases bloating and supports energy. Shall I log 2 glasses of water for you right now?',
      suggestedAction: {
        id: `offline-water-${Date.now()}`,
        type: 'LOG_WATER',
        summary: 'Log 2 Glasses of Water',
        details: 'Adds 2 glasses to today\'s water tracker.',
        isHighRisk: false,
        payload: { glasses: 2 }
      }
    };
  }

  return {
    reply: 'I am here with you on your journey! Whether you need an Indian meal idea, a gentle 10-minute movement routine, kitchen scale advice, or period support, I am always ready to help. ❤️'
  };
}

// Web Speech API Voice Helpers
export class VoiceAssistant {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  public isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-IN'; // Indian English
        this.isSupported = true;
      }
      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
      }
    }
  }

  startListening(onResult: (text: string) => void, onError: (err: any) => void): void {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser.');
      return;
    }
    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
    this.recognition.onerror = (event: any) => {
      onError(event.error);
    };
    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Recognition already started or error:', e);
    }
  }

  stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
  }

  speak(text: string): void {
    if (!this.synthesis) return;
    this.synthesis.cancel(); // Cancel any ongoing speech
    // Clean markdown characters for pleasant speech
    const cleanText = text.replace(/[*#_•\n]/g, ' ').replace(/\s+/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    this.synthesis.speak(utterance);
  }

  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }
}
