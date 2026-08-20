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
    '15 (Mental age 90)',
    '74 (Tells war stories)',
    '19 (Refuses adulthood)',
    '47 (Retired early)',
    '62 (Has 9 cats)',
    '78 (Thinks it is 1994)',
    '89 (Ex-circus star)'
  ];

  const heights = [
    `4'11" and ¾"`,
    `6'8"`,
    `5'2" (5'7" in boots)`,
    `6'1" (2mm exact)`,
    `4'9" big boots`,
    `7'0"`
  ];

  const jobs = [
    'Golf Ball Diver',
    'Water Slide Tester',
    'Line Stander',
    'Fortune Writer',
    'Pet Psychic',
    'Snake Milker',
    'Odor Judge',
    'Paint Inspector'
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
    'Fears Tupperware',
    'Ranks Soup Brands',
    'Eats Yellow Food',
    'Quotes Old Movies',
    'Competes With Toddlers',
    'Rates Eye Contact'
  ];

  const hobbies = [
    'Bird Watching',
    'Collecting Lint',
    'Baking Micro-Pies',
    'Aggressive Origami',
    'Cat Pitch Tuning',
    'Synchronized Mowing'
  ];

  const redFlags = [
    'Claps On Landing',
    'Wipes On Jeans',
    'Brings Spreadsheet',
    'Whispers "Nice" Paying',
    'Listens 2.5x Speed',
    'Asks "Who Am I?"',
    'Reply-All On Emails'
  ];

  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  return {
    age: getRandom(ages),
    height: getRandom(heights),
    job: getRandom(jobs),
    gender: getRandom(genders),
    personality: getRandom(personalities),
    hobby: getRandom(hobbies),
    redFlag: getRandom(redFlags)
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
CRITICAL FORMAT RULE: Keep EVERY value CONCISE and SHORT (max 2 to 4 words, max 20 characters) so text fits cleanly inside visual UI cards without overflowing.

Strict Constraints:
- Age: extreme age strictly between 12-19 OR 45-90. Include a short tag (e.g. "14 (Mental age 65)", "78", "16 (Thinks it's 1994)").
- Height: unusual specific height (e.g., "4'11 and ¾\"", "6'8\"", "5'3.5\"").
- Job: weird profession in 2-3 words (e.g. "Golf Ball Diver", "Water Slide Tester", "Pet Food Taster").
- Gender: inclusive gender identity (e.g. Agender, Genderfluid, Non-binary, Cisgender Male, Transgender Woman, Two-Spirit, Demigirl).
- Personality: short sarcastic trait in 2-3 words (e.g. "Fears Tupperware", "Ranks Soup Brands").
- Hobby: short weird hobby in 2-3 words (e.g. "Bird Watching", "Collecting Lint", "Micro-Pies").
- Red Flag: short sarcastic habit in 2-4 words (e.g. "Claps On Plane Landing", "Brings Date Spreadsheet").

Output MUST be strictly valid JSON without markdown tags, backticks, or extra text. Format:
{
  "age": "...",
  "height": "...",
  "job": "...",
  "gender": "...",
  "personality": "...",
  "hobby": "...",
  "redFlag": "..."
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
