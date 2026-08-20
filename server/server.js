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
    '12', '13', '14', '15', '16', '17', '18', '19', '45', '47',
    '51', '54', '58', '62', '65', '69', '72', '75', '78', '81',
    '84', '87', '89', '91', '94'
  ];

  const heights = [
    `4'11" and ¾"`, `6'8"`, `5'2" (5'7" in boots)`, `6'1" (2mm exact)`, `4'9" big boots`,
    `7'0"`, `5'0" on tiptoes`, `6'5" and a half`, `4'10" exactly`, `6'11" giraffe`,
    `5'1" in heels`, `6'7" slouching`, `4'8" with hat`, `6'9" (nice)`, `5'3.5"`,
    `6'2" in socks`, `4'7" power stance`, `7'2" door-hitter`, `5'4" posture`, `6'6" giant`,
    `4'9.5"`, `6'10" benched`, `5'5" towering`, `6'4" stretched`, `7'3" ceiling`
  ];

  const jobs = [
    'Golf Ball Diver', 'Water Slide Tester', 'Line Stander', 'Fortune Writer', 'Pet Psychic',
    'Snake Milker', 'Odor Judge', 'Paint Inspector', 'Lego Separator', 'Dice Tester',
    'Armpit Smeller', 'Chicken Sexer', 'Queue Waiter', 'Furniture Tester', 'Pro Sleeper',
    'Cat Caddy', 'Meme Historian', 'Bed Tester', 'Duck Herder', 'Dog Food Taster',
    'Worm Picker', 'Iceberg Mover', 'Towel Sniffer', 'Ant Stunt Double', 'Volcano Monitor'
  ];

  const genders = [
    'Genderfluid', 'Agender', 'Non-binary', 'Cisgender Male', 'Transgender Woman',
    'Two-Spirit', 'Demigirl', 'Pangender'
  ];

  const personalities = [
    'Fears Tupperware', 'Ranks Soup Brands', 'Eats Yellow Food', 'Quotes Old Movies', 'Competes W/ Toddlers',
    'Rates Eye Contact', 'Whispers To Plants', 'Refuses Tuesdays', 'Explains Memes', 'Counts Elevator Buttons',
    'Judges Cereal', 'Fears Toasters', 'Aggressively Polite', 'Argues With Siri', 'Ranks Spots',
    'Obsessed W/ Lint', 'Mirror Monologues', 'Rates Tap Water', 'Fears Bubble Wrap', 'Aggressively Chill',
    'Sings Microwave', 'Corrects Grammar', 'Monopolizes Trivia', 'Judges Handshakes', 'Fears Slow Wi-Fi'
  ];

  const hobbies = [
    'Bird Watching', 'Collecting Lint', 'Baking Micro-Pies', 'Aggressive Origami', 'Cat Pitch Tuning',
    'Synchronized Mowing', 'Sock Sorting', 'Cloud Rating', 'Extreme Ironing', 'Pencil Sharpening',
    'Spoon Balancing', 'Elevator Riding', 'Leaf Collecting', 'Brick Stacking', 'Popping Bubbles',
    'Gnome Painting', 'Dust Bun Hunting', 'Tunnel Yodeling', 'Pebble Cataloging', 'Ant Race Betting',
    'Washing Marbles', 'Staring Contests', 'Noodle Sculpting', 'Button Counting', 'Tree Hugging'
  ];

  const greenFlags = [
    'Claps On Landing', 'Wipes On Jeans', 'Brings Spreadsheet', 'Whispers "Nice" Paying', 'Listens 2.5x Speed',
    'Asks "Who Am I?"', 'Reply-All On Emails', 'Ketchup On Tacos', 'Pizza W/ Fork', 'Leaves 1 Sec Microwave',
    'Bites Ice Cream', 'Uses Unironic Emojis', 'Says "Irregardless"', 'Socks W/ Sandals', 'Double Dips Chips',
    'Spoils Endings', 'Leaves Carts Stray', '45 Min Showers', 'Chews Ice Loudly', 'Talks Thru Movies',
    'Milk Before Cereal', 'Uses Comic Sans', 'Snoozes 12 Alarms', 'Makes Bed At 11PM', 'Claps At Movie End'
  ];

  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  return {
    age: getRandom(ages),
    height: getRandom(heights),
    job: getRandom(jobs),
    gender: getRandom(genders),
    personality: getRandom(personalities),
    hobby: getRandom(hobbies),
    greenFlag: getRandom(greenFlags)
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
- Age: extreme age strictly between 12-19 OR 45-90. NEVER 20-40. Output ONLY the numeric age number (e.g. "14", "78", "16", "89"). Do NOT include any parenthetical comments or text.
- Height: unusual specific height (e.g., "4'11 and ¾\"", "6'8\"", "5'3.5\"").
- Job: weird profession in 2-3 words (e.g. "Golf Ball Diver", "Water Slide Tester", "Pet Food Taster").
- Gender: inclusive gender identity (e.g. Agender, Genderfluid, Non-binary, Cisgender Male, Transgender Woman, Two-Spirit, Demigirl).
- Personality: short sarcastic trait in 2-3 words (e.g. "Fears Tupperware", "Ranks Soup Brands").
- Hobby: short weird hobby in 2-3 words (e.g. "Bird Watching", "Collecting Lint", "Micro-Pies").
- Green Flag: short sarcastic red-flag habit labeled as green flag in satire (e.g. "Claps On Plane Landing", "Brings Date Spreadsheet").

Output MUST be strictly valid JSON without markdown tags, backticks, or extra text. Format:
{
  "age": "...",
  "height": "...",
  "job": "...",
  "gender": "...",
  "personality": "...",
  "hobby": "...",
  "greenFlag": "..."
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
