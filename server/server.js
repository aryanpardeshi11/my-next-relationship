import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Fallback generator for development or when GEMINI_API_KEY is not set
function generateFallbackMatch(userAge, userGender) {
  const ages = [
    '14 (Mental age 72)',
    '16 (Thinks it is 1985)',
    '18 (Refuses to grow up)',
    '47 (Aggressively retired)',
    '62 (Has 9 cats and 1 parrot)',
    '78 (Tells stories about the war)',
    '89 (Ex-circus performer)'
  ];

  const heights = [
    `4'11" and ¾"`,
    `6'8"`,
    `5'2" (5'7" in boots)`,
    `6'1" and exactly 2 millimeters`,
    `4'9" with giant boots`,
    `7'0"`
  ];

  const jobs = [
    'Golf Ball Diver',
    'Water Slide Tester',
    'Professional Line Stander',
    'Fortune Cookie Writer',
    'Full-Time Pet Psychic',
    'Snake Milker',
    'Odor Judge',
    'Paint Drying Inspector'
  ];

  const genders = [
    'Genderfluid',
    'Agender',
    'Non-binary',
    'Cisgender Male',
    'Transgender Woman',
    'Two-Spirit',
    'Demigirl',
    'Pangender'
  ];

  const personalities = [
    'Fears Tupperware and speaks only in passive-aggressive whispers',
    'Obsessively ranks soup brands and rates your eye contact',
    'Unapologetically competitive at board games with toddlers',
    'Maintains eye contact for 4 seconds too long during introductions',
    'Communicates primarily through vintage movie quotes',
    'Refuses to acknowledge the existence of Tuesdays'
  ];

  const hobbies = [
    'Competitive bird watching',
    'Collecting vintage lint',
    'Baking micro-pies',
    'Aggressive origami',
    'Cataloging stray cats by vocal pitch',
    'Synchronized lawn mowing'
  ];

  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  return {
    age: getRandom(ages),
    height: getRandom(heights),
    job: getRandom(jobs),
    gender: getRandom(genders),
    personality: getRandom(personalities),
    hobby: getRandom(hobbies)
  };
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'My Next Relationship API' });
});

app.post('/api/generate', async (req, res) => {
  const { age: userAge, gender: userGender } = req.body || {};

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key')) {
    console.log('[API] GEMINI_API_KEY not configured. Using intelligent fallback match generator.');
    const fallbackData = generateFallbackMatch(userAge, userGender);
    return res.json({
      success: true,
      match: fallbackData,
      source: 'fallback',
      message: 'Generated using local fallback (Set GEMINI_API_KEY in server/.env for live Gemini output)'
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are a minimalist, comedic matchmaker API for a satire app called "My Next Relationship".
User details provided: Age: ${userAge || 'Not specified'}, Gender: ${userGender || 'Not specified'}.

Generate a sarcastic, harmless, lighthearted relationship match parameters object.
Strict Constraints:
- Age: extreme age strictly between 12-19 OR 45-90. NEVER 20-40. Include a quirky tag (e.g. "14 (Mental age 65)", "78", "16 (Thinks it's 1994)").
- Height: unusual or highly specific height format (e.g., "4'11 and ¾\"", "6'8\"", "5'3.5\"").
- Job: real but highly unusual/weird profession (e.g. "Golf Ball Diver", "Water Slide Tester", "Professional Line Stander", "Pet Food Taster").
- Gender: randomly select from a highly inclusive list of gender identities (e.g. Agender, Genderfluid, Non-binary, Cisgender Male, Transgender Woman, Two-Spirit, Demigirl, etc.).
- Personality: light, sarcastic, safe (e.g. "Fears Tupperware", "Only eats yellow food").
- Hobby: light, safe, weird hobby (e.g. "Competitive bird watching", "Collecting elevator buttons").

Output MUST be strictly valid JSON without markdown tags, backticks, or extra text. Format:
{
  "age": "...",
  "height": "...",
  "job": "...",
  "gender": "...",
  "personality": "...",
  "hobby": "..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    let matchData;
    try {
      // Clean backticks if any
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      matchData = JSON.parse(cleaned);
    } catch (e) {
      console.warn('[API] JSON parse error on Gemini output, falling back to clean data:', e);
      matchData = generateFallbackMatch(userAge, userGender);
    }

    return res.json({
      success: true,
      match: matchData,
      source: 'gemini'
    });
  } catch (error) {
    console.error('[API] Error calling Gemini API:', error.message);
    const fallbackData = generateFallbackMatch(userAge, userGender);
    return res.json({
      success: true,
      match: fallbackData,
      source: 'fallback_on_error',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`[API Server] Running on http://localhost:${PORT}`);
});
