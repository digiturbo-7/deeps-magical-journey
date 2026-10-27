import { WorkoutRoutine } from '../types';

export const WORKOUT_ROUTINES: WorkoutRoutine[] = [
  // DAY 1 SPECIAL MENSTRUAL COMFORT (OCTOBER 24, 2026)
  {
    id: 'day-1-period-comfort',
    title: 'Cycle Day 1: Gentle Period Comfort & Rest',
    category: 'period_care',
    targetEnergyLevel: 'low_energy',
    durationMins: 12,
    rpeEffort: 'RPE 1-2 (Ultra gentle, restorative, zero pressure)',
    isPeriodDay1Suitable: true,
    warmupNotes: 'No rushing. Sip warm water or ginger tea, slip into loose comfortable clothes, and pause whenever your body asks.',
    cooldownNotes: 'Lie down comfortably with a warm pillow or hot water pack on your lower abdomen. Breathe gently into your belly.',
    exercises: [
      {
        name: 'Slow Living Room Stroll or Gentle Rest',
        durationOrReps: '3 to 5 minutes',
        demonstrationNotes: 'Walk at a calm, soothing pace around your room, or choose to sit comfortably if cramps are active.',
        chairModifiedOption: 'Seated gentle foot tapping to keep gentle circulation without standing.',
        safetyCheck: 'If cramps feel intense, skip walking entirely. Rest is 100% productive and honored.'
      },
      {
        name: 'Gentle Seated / Standing Shoulder Rolls',
        durationOrReps: '10 slow backward rolls + 5 forward',
        demonstrationNotes: 'Inhale lift shoulders towards ears, exhale softly release down and back. Releases upper back tension.',
        chairModifiedOption: 'Perform sitting comfortably on your bed or sofa with back supported.',
        safetyCheck: 'Keep movements soft, slow, and fluid.'
      },
      {
        name: 'Standing or Seated Gentle Side Reach',
        durationOrReps: '5 slow breaths each side',
        demonstrationNotes: 'Reach one arm overhead gently, breathing into the side of your ribs. No deep bending.',
        chairModifiedOption: 'Place one hand on your chair armrest and gently stretch the opposite arm upwards.',
        safetyCheck: 'Avoid any pulling sensation near your lower abdomen.'
      },
      {
        name: 'Gentle Cat-Cow or Seated Spinal Waves',
        durationOrReps: '6 to 8 slow breaths',
        demonstrationNotes: 'On hands and knees with soft cushion, or seated on a chair: inhale arch chest gently, exhale round upper back.',
        chairModifiedOption: 'Hands on knees while seated: gently curve and open chest with each breath.',
        safetyCheck: 'Do not overextend. Keep the range small and soothing for the lower back.'
      },
      {
        name: 'Relaxed Diaphragmatic Belly Breathing',
        durationOrReps: '3 minutes',
        demonstrationNotes: 'Hands resting gently on lower belly. Feel belly softly rise on inhale and fall on exhale. Eases uterine cramping.',
        chairModifiedOption: 'Supported recline with feet elevated on a cushion.',
        safetyCheck: 'Never hold your breath. Keep rhythm natural.'
      }
    ]
  },

  // DAY 2 PERIOD MOVEMENT (OCTOBER 25, 2026)
  {
    id: 'day-2-period-gentle-flow',
    title: 'Cycle Day 2: Light Walking & Pelvic Mobility',
    category: 'period_care',
    targetEnergyLevel: 'low_energy',
    durationMins: 15,
    rpeEffort: 'RPE 2-3 (Comfortable talking, easy pace)',
    isPeriodDay1Suitable: true,
    warmupNotes: '2 minutes of easy ankle circles and slow arm circles.',
    cooldownNotes: 'Gentle seated hamstring stretch and 2 minutes of relaxed breathing.',
    exercises: [
      {
        name: 'Easy Comfortable Walking',
        durationOrReps: '6 to 8 minutes',
        demonstrationNotes: 'Continuous easy-paced walking indoors or flat outdoor path.',
        chairModifiedOption: 'Seated marching with soft arm swings.',
        safetyCheck: 'Keep speed modest. If fatigue kicks in, pause and hydrate.'
      },
      {
        name: 'Seated Pelvic Tilts & Hip Openers',
        durationOrReps: '8 to 10 slow reps',
        demonstrationNotes: 'Sit tall on a sturdy chair, gently tilt pelvis forward and back, soothing lower back ache.',
        chairModifiedOption: 'Natural chair movement.',
        safetyCheck: 'Gentle motion only; stop if sharp pinch.'
      },
      {
        name: 'Standing Wall Chest Stretch',
        durationOrReps: '30 seconds per side',
        demonstrationNotes: 'Hand flat against wall at shoulder height, gently turn torso away to open chest.',
        chairModifiedOption: 'Interlace fingers behind back or hold towel.',
        safetyCheck: 'Keep neck relaxed and shoulders away from ears.'
      }
    ]
  },

  // TREADMILL ALTERNATIVE 1: 13-MINUTE LIVING ROOM STEADY RHYTHM WALK (MATCHES EXACT 13-MIN TREADMILL BASELINE)
  {
    id: 'living-room-rhythm-walk',
    title: '13-Min Living Room Rhythm Walk (Treadmill Alternative)',
    category: 'walking',
    targetEnergyLevel: 'normal',
    durationMins: 13,
    rpeEffort: 'RPE 3-4 (Moderate brisk pace, talk-test passed, zero equipment)',
    isPeriodDay1Suitable: false,
    warmupNotes: 'Treadmill replacement walk: Put on your favorite soothing music or podcast, slip into comfortable shoes or grip socks, and pace with a natural rhythm. Matches your 5.0 km/h treadmill baseline with zero joint stress.',
    cooldownNotes: 'Wonderful stroll, Deep! Drink 1 glass of room-temperature water and take 3 deep belly breaths.',
    exercises: [
      {
        name: 'Indoor Room & Hallway Pacing (Warmup)',
        durationOrReps: '2 minutes',
        demonstrationNotes: 'Walk smoothly across your living room or hallway at an easy, relaxing pace. Roll shoulders down and back, breathing gently into your belly.',
        chairModifiedOption: 'Seated rhythmic foot tapping and light shoulder rolls.',
        safetyCheck: 'Ensure floor is dry and unobstructed. Keep steps soft and light.'
      },
      {
        name: 'Steady Living Room Pacing Walk (Speed 5.0 Equivalent)',
        durationOrReps: '7 minutes continuous',
        demonstrationNotes: 'Step at a continuous, steady brisk pace back and forth across the room. Swing your arms naturally at a 90-degree angle to boost gentle circulation. You should comfortably be able to speak a full sentence.',
        chairModifiedOption: 'Seated brisk march in place with alternating arm swings.',
        safetyCheck: 'Maintain talk-test intensity: moderate breathing, never gasping.'
      },
      {
        name: 'Living Room Side-Step Touches & Light Sway',
        durationOrReps: '2 minutes',
        demonstrationNotes: 'Step to the right, tap left foot; step to the left, tap right foot. Keeps heart rate elevated while working hip stability with zero impact.',
        chairModifiedOption: 'Seated wide-to-narrow toe taps.',
        safetyCheck: 'Keep knees soft and slightly bent.'
      },
      {
        name: 'Cooling Down Stroll & Overhead Recovery Breaths',
        durationOrReps: '2 minutes',
        demonstrationNotes: 'Gradually slow your steps to a calm stroll. Inhale reach arms overhead, exhale gently letting arms float down.',
        chairModifiedOption: 'Seated calm breathing with hand on heart.',
        safetyCheck: 'Never stop abruptly. Allow heart rate to glide down slowly.'
      }
    ]
  },

  // TREADMILL ALTERNATIVE 2: 12-MINUTE LOW-IMPACT STEP & SWAY CARDIO
  {
    id: 'indoor-step-touch-cardio',
    title: '12-Min Low-Impact Step & Sway Cardio (No Equipment)',
    category: 'walking',
    targetEnergyLevel: 'normal',
    durationMins: 12,
    rpeEffort: 'RPE 3-4 (Gentle living room cardio, easy on knees & ankles)',
    isPeriodDay1Suitable: false,
    warmupNotes: 'Stand with feet hip-width apart. A lively, fun walking routine you can do in front of the TV or with music while the treadmill is unavailable.',
    cooldownNotes: 'Roll your shoulders, smile, and hydrate with warm water.',
    exercises: [
      {
        name: 'Side Step-Touch with Gentle Arm Waves',
        durationOrReps: '3 minutes',
        demonstrationNotes: 'Step right, tap left; step left, tap right. Add gentle arm sways. Low impact, zero jumping, perfect calorie burner.',
        chairModifiedOption: 'Perform seated on a sturdy chair, tapping toes side to side.',
        safetyCheck: 'Land softly on the whole foot.'
      },
      {
        name: 'Soft Low-Knee March & Front Reach',
        durationOrReps: '3 minutes',
        demonstrationNotes: 'March softly on the spot, lifting knees just a few inches while reaching both hands forward at chest level.',
        chairModifiedOption: 'Seated marching with alternating knee lifts.',
        safetyCheck: 'Hold back of a chair if you need balance support.'
      },
      {
        name: 'Alternating Heel Taps & Chest Openers',
        durationOrReps: '3 minutes',
        demonstrationNotes: 'Tap alternating heels out in front while opening elbows wide to stretch chest and shoulders.',
        chairModifiedOption: 'Seated heel taps with gentle chest expansion.',
        safetyCheck: 'Keep core gently engaged, spine long.'
      },
      {
        name: 'Slow Sway & Restorative Heart Hug',
        durationOrReps: '3 minutes',
        demonstrationNotes: 'Sway gently side to side, cross arms over chest for a gentle self-hug, and breathe deeply.',
        chairModifiedOption: 'Seated gentle breathing with hands resting on thighs.',
        safetyCheck: 'Focus on calming the nervous system.'
      }
    ]
  },

  // TREADMILL ALTERNATIVE 3: 15-MINUTE BALCONY / TERRACE / GARDEN WALK
  {
    id: 'outdoor-balcony-walk',
    title: '15-Min Balcony, Terrace or Garden Fresh Air Walk',
    category: 'walking',
    targetEnergyLevel: 'normal',
    durationMins: 15,
    rpeEffort: 'RPE 3 (Refreshing outdoor stroll, natural daylight & vitamin D)',
    isPeriodDay1Suitable: false,
    warmupNotes: 'Step out onto your balcony, terrace, apartment corridor, or garden. Breathe in the open air.',
    cooldownNotes: 'Rest hands on your balcony railing, take 5 slow breaths into the fresh breeze.',
    exercises: [
      {
        name: 'Open Air Continuous Stride',
        durationOrReps: '10 minutes',
        demonstrationNotes: 'Walk back and forth along your balcony, terrace, or garden path with long, relaxed strides.',
        chairModifiedOption: 'Sit outdoors in natural sunlight, doing gentle ankle and wrist rolls.',
        safetyCheck: 'Wear comfortable walking shoes or supportive footwear.'
      },
      {
        name: 'Standing Wall / Railing Calf Stretch',
        durationOrReps: '3 minutes',
        demonstrationNotes: 'Place hands on wall or railing at chest height. Step one leg back, press heel into floor to gently release calves.',
        chairModifiedOption: 'Seated calf stretch with towel under ball of foot.',
        safetyCheck: 'Gentle stretch sensation only, never pain.'
      },
      {
        name: 'Fresh Air Deep Belly Breathing',
        durationOrReps: '2 minutes',
        demonstrationNotes: 'Stand tall, hands on hips or belly. Slow 4-count inhale through nose, gentle 6-count exhale through mouth.',
        chairModifiedOption: 'Seated comfortable posture.',
        safetyCheck: 'Keep shoulders relaxed and jaw unclenched.'
      }
    ]
  },

  // TREADMILL SESSION (PAUSED UNTIL MACHINE BECOMES AVAILABLE)
  {
    id: 'treadmill-beginner-custom',
    title: 'Treadmill Walk: Speed 5.0 & Incline 2% (Paused until machine ready)',
    category: 'treadmill',
    targetEnergyLevel: 'normal',
    durationMins: 13,
    rpeEffort: 'RPE 3-4 (Moderate comfortable walking, talk-test passed)',
    isPeriodDay1Suitable: false,
    warmupNotes: 'Warmup: 2 minutes at Speed 3.5 km/h, Incline 0%. Focus on upright posture and natural arm swing. (Use when treadmill is accessible)',
    cooldownNotes: 'Cooldown: 2 minutes at Speed 3.0 km/h, Incline 0%. Drink 1 glass of water.',
    exercises: [
      {
        name: 'Treadmill Main Walk (Speed 5.0 km/h, Incline 2%)',
        durationOrReps: '9 minutes continuous',
        demonstrationNotes: 'Walk tall with shoulders relaxed, heels striking gently and rolling forward through toes. You should be able to speak a sentence without gasping.',
        chairModifiedOption: 'If treadmill is unavailable, use the 13-Min Living Room Rhythm Walk.',
        safetyCheck: 'Safety clip attached. Stop immediately if you experience chest tightness, dizziness, or lightheadedness.'
      }
    ]
  },

  // CHAIR-SUPPORTED BEGINNER STRENGTH
  {
    id: 'chair-beginner-strength',
    title: 'Living Room Chair Mobility & Low-Impact Strength',
    category: 'gentle_strength',
    targetEnergyLevel: 'normal',
    durationMins: 15,
    rpeEffort: 'RPE 3-4 (Gentle muscle activation, zero joint stress)',
    isPeriodDay1Suitable: false,
    warmupNotes: '1 minute seated deep breathing and shoulder rolls.',
    cooldownNotes: 'Seated reach to toes and gentle neck release.',
    exercises: [
      {
        name: 'Chair Sit-to-Stands (Beginner Squats)',
        durationOrReps: '8 to 10 controlled reps',
        demonstrationNotes: 'Sit on a sturdy dining chair with feet flat, push through whole foot to stand up tall, then slowly sit back down.',
        chairModifiedOption: 'Keep hands on chair armrests or thighs for steady support.',
        safetyCheck: 'Knees tracking over toes, keep chest open.'
      },
      {
        name: 'Wall Push-Ups',
        durationOrReps: '8 to 10 reps',
        demonstrationNotes: 'Stand arm\'s length from wall, hands flat at shoulder height, bend elbows and gently press away.',
        chairModifiedOption: 'Step closer to wall to reduce resistance.',
        safetyCheck: 'Engage core gently; keep neck neutral.'
      },
      {
        name: 'Standing Calf Raises with Chair Support',
        durationOrReps: '12 smooth reps',
        demonstrationNotes: 'Hold back of chair for balance, rise onto balls of feet, hold 1 sec, lower down with control.',
        chairModifiedOption: 'Can be performed seated with moderate downward hand pressure on knees.',
        safetyCheck: 'Hold chair firmly for steady balance.'
      },
      {
        name: 'Standing Glute Kickbacks (Chair Supported)',
        durationOrReps: '10 reps each leg',
        demonstrationNotes: 'Hands on back of chair, gently squeeze glute and extend one leg straight back 4-6 inches.',
        chairModifiedOption: 'Seated glute squeezes holding for 5 seconds.',
        safetyCheck: 'Do not arch lower back. Movement comes from the hip.'
      }
    ]
  },

  // 10-MINUTE QUICK RESTORATIVE (MINIMUM VIABLE DAY)
  {
    id: 'minimum-viable-movement',
    title: 'Minimum Viable Movement: 7-Minute Gentle Reset',
    category: 'mobility',
    targetEnergyLevel: 'low_energy',
    durationMins: 7,
    rpeEffort: 'RPE 1-2 (Effortless circulation and breath)',
    isPeriodDay1Suitable: true,
    warmupNotes: 'Take 3 deep grounding breaths.',
    cooldownNotes: 'Hand on heart, acknowledge yourself for showing up.',
    exercises: [
      {
        name: 'Gentle Stroll or Standing Sway',
        durationOrReps: '3 minutes',
        demonstrationNotes: 'Just move gently around your living room with no distance or step count pressure.',
        chairModifiedOption: 'Seated torso side-to-side gentle sway.',
        safetyCheck: 'Wear supportive indoor slippers or clean walking shoes.'
      },
      {
        name: 'Standing Overhead Reach & Sigh',
        durationOrReps: '5 deep breaths',
        demonstrationNotes: 'Inhale reach up tall, exhale with an audible sigh letting shoulders sink down.',
        chairModifiedOption: 'Seated arm raise.',
        safetyCheck: 'Soft knees, no dizzy sudden movements.'
      },
      {
        name: 'Seated Ankle & Wrist Circles',
        durationOrReps: '10 circles each way',
        demonstrationNotes: 'Roll wrists and ankles slowly to release joint stiffness after sitting.',
        chairModifiedOption: 'Natural seated posture.',
        safetyCheck: 'Fluid, unforced movement.'
      }
    ]
  }
];
