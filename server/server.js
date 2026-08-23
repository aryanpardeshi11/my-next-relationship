import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Expanded 50+ item pools for each satirical parameter
const AGES_POOL = [
  '12', '13', '14', '15', '16', '17', '18', '19', '45', '46',
  '47', '48', '49', '50', '51', '52', '53', '54', '55', '56',
  '57', '58', '59', '60', '61', '62', '63', '64', '65', '66',
  '67', '68', '69', '70', '71', '72', '73', '74', '75', '76',
  '77', '78', '79', '80', '81', '82', '83', '84', '85', '86',
  '87', '88', '89', '90'
];

const HEIGHTS_POOL = [
  `4'11" and ¾"`, `6'8"`, `5'2" (5'7" in boots)`, `6'1" (2mm exact)`, `4'9" big boots`,
  `7'0"`, `5'0" on tiptoes`, `6'5" and a half`, `4'10" exactly`, `6'11" giraffe`,
  `5'1" in heels`, `6'7" slouching`, `4'8" with hat`, `6'9" (nice)`, `5'3.5"`,
  `6'2" in socks`, `4'7" power stance`, `7'2" door-hitter`, `5'4" posture`, `6'6" giant`,
  `4'9.5"`, `6'10" benched`, `5'5" towering`, `6'4" stretched`, `7'3" ceiling`,
  `4'6" compact`, `6'3" barefoot`, `5'6" average`, `7'1" giant`, `4'8.5"`,
  `6'0" (rounded up)`, `5'1.5"`, `6'11.5"`, `4'5" miniature`, `7'4" sky high`,
  `5'7.5"`, `6'5.5"`, `4'11.9"`, `6'8.5"`, `5'3" exact`, `6'9.5"`,
  `4'10.5"`, `7'5" tower`, `5'8" posture`, `6'7.5"`, `4'4" micro`,
  `6'1.8"`, `5'9" normal`, `7'6" titan`, `4'9.9"`
];

const JOBS_POOL = [
  'Golf Ball Diver', 'Water Slide Tester', 'Line Stander', 'Fortune Writer', 'Pet Psychic',
  'Snake Milker', 'Odor Judge', 'Paint Inspector', 'Lego Separator', 'Dice Tester',
  'Armpit Smeller', 'Chicken Sexer', 'Queue Waiter', 'Furniture Tester', 'Pro Sleeper',
  'Cat Caddy', 'Meme Historian', 'Bed Tester', 'Duck Herder', 'Dog Food Taster',
  'Worm Picker', 'Iceberg Mover', 'Towel Sniffer', 'Ant Stunt Double', 'Volcano Monitor',
  'Professional Mourner', 'Grossologist', 'Golf Caddy For Cats', 'Dinosaur Bone Duster',
  'Feng Shui Consultant For Dogs', 'Scrapple Specialist', 'Ostrich Handler', 'Wrinkle Eraser',
  'Stunt Double For Statues', 'Pigeon Chaser', 'Teddy Bear Parachutist', 'Bubble Wrap Popper',
  'Gummy Bear Sculptor', 'Toothpaste Cap Screwer', 'Cereal Sorting Analyst', 'Unicorn Breeder',
  'Professional Whisperer', 'Sock Matcher', 'Snail Race Judge', 'Traffic Cone Placer',
  'Dust Bunny Wrangler', 'Tea Leaf Reader', 'Cloud Namer', 'Avocado Ripeness Judge', 'Meme Archaeologist'
];

const PERSONALITIES_POOL = [
  'Fears Tupperware', 'Ranks Soup Brands', 'Eats Yellow Food', 'Quotes Old Movies', 'Competes W/ Toddlers',
  'Rates Eye Contact', 'Whispers To Plants', 'Refuses Tuesdays', 'Explains Memes', 'Counts Elevator Buttons',
  'Judges Cereal', 'Fears Toasters', 'Aggressively Polite', 'Argues With Siri', 'Ranks Spots',
  'Obsessed W/ Lint', 'Mirror Monologues', 'Rates Tap Water', 'Fears Bubble Wrap', 'Aggressively Chill',
  'Sings Microwave', 'Corrects Grammar', 'Monopolizes Trivia', 'Judges Handshakes', 'Fears Slow Wi-Fi',
  'Smells Book Pages', 'Ranks Door Knobs', 'Fears Bananas', 'Whispers To Ice', 'Counts Stairs Out Loud',
  'Rates Ceiling Fans', 'Judges Shoelaces', 'Argues With GPS', 'Obsessed W/ Receipts', 'Fears Pigeons',
  'Ranks Paper Clips', 'Talks To Houseplants', 'Evaluates Hugs', 'Fears Balloons', 'Quotes Cartoons',
  'Rates Sidewalk Cracks', 'Judges Napkins', 'Fears Static Electricity', 'Monopolizes AUX Cord',
  'Counts Car Colors', 'Rates Elevator Music', 'Fears Automatic Doors', 'Obsessed W/ Stickers',
  'Judges Toothpicks', 'Whispers To Switches'
];

const HOBBIES_POOL = [
  'Bird Watching', 'Collecting Lint', 'Baking Micro-Pies', 'Aggressive Origami', 'Cat Pitch Tuning',
  'Synchronized Mowing', 'Sock Sorting', 'Cloud Rating', 'Extreme Ironing', 'Pencil Sharpening',
  'Spoon Balancing', 'Elevator Riding', 'Leaf Collecting', 'Brick Stacking', 'Popping Bubbles',
  'Gnome Painting', 'Dust Bun Hunting', 'Tunnel Yodeling', 'Pebble Cataloging', 'Ant Race Betting',
  'Washing Marbles', 'Staring Contests', 'Noodle Sculpting', 'Button Counting', 'Tree Hugging',
  'Bread Tag Stacking', 'Competitive Napping', 'Marble Rolling', 'Bottle Cap Sorting', 'Snail Racing',
  'Puddle Jumping', 'Toothpick Towering', 'Rubber Band Chaining', 'Ticket Stub Archiving', 'Acorn Hoarding',
  'Yarn Untangling', 'Shoelace Braiding', 'Paper Crane Folding', 'Feather Collection', 'Magnet Hunting',
  'Stamp Licking', 'Coin Stacking', 'Soap Carving', 'Stick Fighting', 'Bubble Blower Tuning',
  'Doodle Rating', 'Cereal Box Reading', 'Lint Roller Racing', 'Paper Clip Chaining', 'Shadow Puppetry'
];

const GREEN_FLAGS_POOL = [
  'Claps On Landing', 'Wipes On Jeans', 'Brings Spreadsheet', 'Whispers "Nice" Paying', 'Listens 2.5x Speed',
  'Asks "Who Am I?"', 'Reply-All On Emails', 'Ketchup On Tacos', 'Pizza W/ Fork', 'Leaves 1 Sec Microwave',
  'Bites Ice Cream', 'Uses Unironic Emojis', 'Says "Irregardless"', 'Socks W/ Sandals', 'Double Dips Chips',
  'Spoils Endings', 'Leaves Carts Stray', '45 Min Showers', 'Chews Ice Loudly', 'Talks Thru Movies',
  'Milk Before Cereal', 'Uses Comic Sans', 'Snoozes 12 Alarms', 'Makes Bed At 11PM', 'Claps At Movie End',
  'Puts Ketchup On Eggs', 'Eats Apple Core', 'Wears Sunglasses Inside', 'Uses Speakerphone Publicly',
  'Leaves Doors Ajar', 'Takes 100 Selfies', 'Uses Typewriter', 'Drinks Pickle Juice', 'Eats Pizza Crust First',
  'Calls Everyone "Champ"', 'Wears Crocs To Weddings', 'Types With 2 Fingers', 'Leaves Caps Off Pens',
  'Says "Supposably"', 'Licks Knife Clean', 'Unplugs Wi-Fi At Night', 'Uses Flash On Photos',
  'Takes Notes In Crayon', 'Eats Kiwi Skin', 'Humms Loudly Shopping', 'Asks For Water No Ice',
  'Wears 3 Watches', 'Brings Own Hot Sauce', 'Reads Terms Of Service', 'Claps When Elevator Arrives'
];

// Fallback generator for development or when GEMINI_API_KEY is not set
function generateFallbackMatch(userAge, userGender, desperation = 75, attemptCount = 1) {
  // Pity System: After every 4 chaotic attempts, the next 2 attempts (5th & 6th) yield genuine realistic matches!
  if (attemptCount && (attemptCount % 6 === 5 || attemptCount % 6 === 0)) {
    const isSecond = (attemptCount % 6 === 0);
    return {
      age: isSecond ? '27' : '26',
      height: isSecond ? `5'11"` : `5'10"`,
      job: isSecond ? 'UX Designer' : 'Architect',
      gender: userGender === 'Male' ? 'Female' : 'Male',
      personality: isSecond ? 'Great Listener & Empathetic' : 'Makes Great Coffee',
      hobby: isSecond ? 'Weekend Hiking & Cooking' : 'Golden Hour Photography',
      greenFlag: isSecond ? 'Communicates Openly' : 'Remembers Your Birthday',
      isPerfectMatch: true
    };
  }

  let genders = ['Male', 'Female', 'Transgender Woman', 'Transgender Man', 'Non-binary', 'Agender'];
  if (userGender === 'Male') {
    genders = genders.filter(g => g !== 'Female');
  } else if (userGender === 'Female') {
    genders = genders.filter(g => g !== 'Male');
  }

  const pickFromPool = (arr) => {
    // High desperation (>= 80): Picks from chaotic upper half of array
    // Low desperation (<= 35): Picks from lower half
    // Medium desperation: Picks anywhere
    const len = arr.length;
    if (desperation >= 80) {
      const start = Math.floor(len * 0.4);
      const sub = arr.slice(start);
      return sub[Math.floor(Math.random() * sub.length)];
    } else if (desperation <= 35) {
      const end = Math.ceil(len * 0.6);
      const sub = arr.slice(0, end);
      return sub[Math.floor(Math.random() * sub.length)];
    }
    return arr[Math.floor(Math.random() * len)];
  };

  return {
    age: pickFromPool(AGES_POOL),
    height: pickFromPool(HEIGHTS_POOL),
    job: pickFromPool(JOBS_POOL),
    gender: pickFromPool(genders),
    personality: pickFromPool(PERSONALITIES_POOL),
    hobby: pickFromPool(HOBBIES_POOL),
    greenFlag: pickFromPool(GREEN_FLAGS_POOL),
    isPerfectMatch: false
  };
}

function generateFallbackDescription(match, user) {
  const { age, height, job, gender, personality, hobby, greenFlag } = match || {};
  const userAge = user?.age ? `${user.age} y/o` : null;
  const userGender = user?.gender || null;
  const userPrefix = (userAge && userGender) ? `As a ${userAge} ${userGender}, ` : (userGender ? `As a ${userGender}, ` : '');

  const scenarios = [
    `${userPrefix}your future with this ${height} ${gender || 'partner'} (${age} y/o) who works as a ${job || 'freelancer'} revolves around their core trait: "${personality || 'Fears Tupperware'}". Expect romantic dates where they compel you into ${hobby || 'Sock Sorting'} while treating "${greenFlag || 'Claps On Landing'}" as their non-negotiable love language.`,
    `Imagine a ${userAge || ''} ${userGender || 'person'} like you coming home to a ${age}-year-old ${job || 'Line Stander'} (${height}) whose entire vibe is "${personality || 'Rates Tap Water'}". They will drag you into aggressive sessions of ${hobby || 'Cloud Rating'} and unironically consider "${greenFlag || 'Brings Spreadsheet'}" to be peak emotional intimacy.`,
    `${userPrefix}dating this ${height} ${job || 'Pet Psychic'} means accepting that "${personality || 'Refuses Tuesdays'}" isn't just a quirk—it's a lifestyle. Between emergency sessions of ${hobby || 'Baking Micro-Pies'}, they will look you in the eye and declare "${greenFlag || 'Whispers Nice Paying'}" as their wedding vow.`
  ];
  return scenarios[Math.floor(Math.random() * scenarios.length)];
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'My Next Relationship API' });
});

app.post('/api/describe', async (req, res) => {
  const { match, user } = req.body || {};
  if (!match) {
    return res.status(400).json({ success: false, error: 'Match data is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key')) {
    console.log('[API] GEMINI_API_KEY not configured for description. Using intelligent local sarcastic fallback.');
    return res.json({
      success: true,
      description: generateFallbackDescription(match, user),
      source: 'fallback'
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const userDesc = (user && user.age && user.gender) ? `The user seeking the match is a ${user.age} year old ${user.gender}.` : '';
    const prompt = `You are a sarcastic, comedic matchmaker AI for a satire app.
${userDesc}
Given this predicted relationship match profile:
- Age: ${match.age}
- Height: ${match.height}
- Job: ${match.job}
- Gender: ${match.gender}
- Personality Trait: ${match.personality || match.trait}
- Primary Hobby: ${match.hobby}
- Green Flag: ${match.greenFlag || match.redFlag}

Write a short (2 to 3 sentences), highly exaggerated, witty, sarcastic imagination/scenario of what dating or living with this person would actually be like for the user (${user?.age ? user.age + ' y/o ' : ''}${user?.gender || 'user'}). Highlight the hilarious contrast between the user's profile and their match.
Strictly return ONLY the plain text description (max 280 characters). Do NOT include markdown tags, quotes, or JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const description = response.text ? response.text.trim() : generateFallbackDescription(match, user);
    return res.json({
      success: true,
      description,
      source: 'gemini'
    });
  } catch (error) {
    console.error('[API] Error generating description via Gemini API:', error.message || error);
    return res.json({
      success: true,
      description: generateFallbackDescription(match, user),
      source: 'fallback_on_error'
    });
  }
});



app.post('/api/generate', async (req, res) => {
  const { age: userAge, gender: userGender, desperation = 75, attemptCount = 1 } = req.body || {};

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key')) {
    console.log('[API] GEMINI_API_KEY not configured. Using intelligent fallback match generator.');
    const fallbackData = generateFallbackMatch(userAge, userGender, desperation, attemptCount);
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
- Gender: gender identity.${userGender === 'Male' ? ' CRITICAL RULE: User selected Male, so do NOT predict "Female" as match gender. Select from: Male, Transgender Woman, Transgender Man, Non-binary, Agender.' : userGender === 'Female' ? ' CRITICAL RULE: User selected Female, so do NOT predict "Male" as match gender. Select from: Female, Transgender Woman, Transgender Man, Non-binary, Agender.' : ' (e.g. Male, Female, Transgender Woman, Transgender Man, Non-binary, Agender).'}
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
      if (userGender === 'Male' && matchData.gender === 'Female') {
        matchData.gender = getRandom(['Male', 'Transgender Woman', 'Transgender Man', 'Non-binary', 'Agender']);
      } else if (userGender === 'Female' && matchData.gender === 'Male') {
        matchData.gender = getRandom(['Female', 'Transgender Woman', 'Transgender Man', 'Non-binary', 'Agender']);
      }
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
    const errorMsg = error.message || '';
    const isRateLimit = error.status === 429 || errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('Quota');

    if (isRateLimit) {
      console.warn('[API] Gemini API Rate Limit (429) hit. Returning sarcastic local fallback match so UI never breaks.');
    } else {
      console.error('[API] Error calling Gemini API:', errorMsg);
    }

    const fallbackData = generateFallbackMatch(userAge, userGender);
    return res.json({
      success: true,
      match: fallbackData,
      source: isRateLimit ? 'fallback_rate_limit' : 'fallback_on_error',
      message: isRateLimit
        ? 'Gemini API quota reached. Generated seamless sarcastic fallback match.'
        : 'Generated fallback match due to server error.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`[API Server] Running on http://localhost:${PORT}`);
});
