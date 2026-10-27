import { checkForRedFlags, generateIntelligentWellnessResponse } from '../../server/wellnessEngine.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Safety Red-Flag Check
    const redFlag = checkForRedFlags(message);
    if (redFlag) {
      const emergencyResponse = generateIntelligentWellnessResponse(message, context);
      return res.status(200).json({
        reply: emergencyResponse.text,
        suggestedAction: emergencyResponse.suggestedAction,
        safetyAlert: emergencyResponse.safetyAlert
      });
    }

    // Call Gemini Cloud API if key is present
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const systemPrompt = `You are Rosy, a warm, caring, intelligent wellness companion for an adult woman on a 240-day holistic fitness and self-care journey called "DEEPS MAGICAL JOURNEY — BODY, MIND & US ❤️".
Profile: 25 years old, 157.5 cm (5'2"), 88.5 kg, beginner, home workouts, treadmill is currently paused (using 13-min living room rhythm walks), prefers Indian food (South Indian / Bengaluru non-veg with veg alternatives).
Ethics: Never shame her body, never push extreme deficits or crash diets, never force exercise on period bleed days. Always distinguish between RAW/DRY and COOKED/READY-TO-EAT weights on kitchen scales. Urgent symptoms (chest pain, fainting, breathlessness) require immediate medical advice. Keep responses concise, warm, practical, and loving.`;

        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }] }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiText) {
            const localDecision = generateIntelligentWellnessResponse(message, context);
            return res.status(200).json({
              reply: aiText,
              suggestedAction: localDecision.suggestedAction,
              safetyAlert: null
            });
          }
        }
      } catch (geminiError) {
        console.warn('Gemini cloud call error, falling back to local engine:', geminiError.message);
      }
    }

    // Fallback to intelligent wellness engine
    const wellnessResult = generateIntelligentWellnessResponse(message, context);
    return res.status(200).json({
      reply: wellnessResult.text,
      suggestedAction: wellnessResult.suggestedAction,
      safetyAlert: wellnessResult.safetyAlert
    });

  } catch (err) {
    console.error('Vercel serverless error:', err);
    res.status(500).json({
      error: 'An unexpected error occurred in wellness companion service',
      details: err.message
    });
  }
}
