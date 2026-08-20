# 💖 MY NEXT RELATIONSHIP

> **"Hope you find your perfect match..."**
> 
> A full-stack, Gen-Z styled satirical matchmaking web app powered by Google Gemini AI (`gemini-2.5-flash`) & Express. Features real-time predictive text scrambling, a symmetrical 7-node wave path visualization, and zero-leak API security.

![Gen-Z Aesthetic](https://img.shields.io/badge/Aesthetic-Gen--Z_Neo--Brutalist-FF52A2)
![Stack](https://img.shields.io/badge/Stack-React_19_|_Vite_6_|_Node.js_|_Express_|_Google_Gemini-8B5CF6)
![Security](https://img.shields.io/badge/Security-Server--Side_API_Key-00E699)

---

## 📖 The Storyline

Have you ever wondered what the universe has in store for your romantic future? Look no further. **My Next Relationship** takes your age and gender and runs it through a comedic, AI-powered predictive engine. 

Instead of generic dating app matches, the **Predictive Match Path** generates 7 hilarious, statistically improbable parameters connected visually along a symmetrical wave diagram:

1. **Age**: Extreme numeric age strictly between `12–19` or `45–90` (e.g. `14`, `78`, `89`).
2. **Gender**: Inclusive identity selected randomly (e.g. `Genderfluid`, `Agender`, `Non-binary`).
3. **Height**: Highly specific / unusual height (e.g. `4'11" and ¾"`, `6'8"`, `5'2" (5'7" in boots)`).
4. **Occupation**: Weird real-world jobs (e.g. `Golf Ball Diver`, `Water Slide Tester`, `Pet Psychic`).
5. **Personality**: Concise sarcastic trait (e.g. `Fears Tupperware`, `Ranks Soup Brands`).
6. **Primary Hobby**: Unique hobbies (e.g. `Bird Watching`, `Collecting Lint`, `Baking Micro-Pies`).
7. **Green Flag**: Sarcastic red-flag habit labeled as a green flag (e.g. `Claps On Landing`, `Wipes On Jeans`, `Brings Spreadsheet`).

---

## ⚡ Features & Visual Design

- **Vibrant Gen-Z Neo-Brutalism**: Bold 3px black borders, hard 6px offset shadows (`box-shadow: 6px 6px 0px #000`), pop color accents (Yellow `#FFE600`, Hot Pink `#FF52A2`, Cyan `#00F0FF`, Mint `#00E699`, Purple `#8B5CF6`), and crisp JetBrains Mono & Inter typography.
- **Symmetrical 7-Node Wave Diagram**: Responsive SVG rendering 7 fixed nodes in a symmetrical 3-peak wave (`\/\/\`).
- **Real-Time Predictive Text Scramble**: A bold dark line draws progressively between nodes while text scrambles in real time before locking on each predicted match parameter.
- **100% Uniform 11px Font Size**: Fixed, perfectly readable font size across all cards with $35\text{px}$ clearance margins above and below nodes to guarantee ZERO card-to-node overlap.
- **Mobile Responsive**: Fully responsive layout with smooth touch-enabled horizontal scrolling (`minWidth: 720px`) for mobile devices.

---

## 🔒 Privacy & Zero-Leak Security

Your privacy and API security are guaranteed:
1. **Server-Side API Key Storage**: The Google Gemini API key (`GEMINI_API_KEY`) is stored strictly in server-side `.env` environment variables. Client bundles contain ZERO credentials.
2. **Smart Fallback Engine**: If no API key is provided or network issues occur, the backend automatically uses a 25+ item local fallback generator (`source: 'fallback'`) with identical response formatting.
3. **No User Tracking**: User inputs are processed in-memory and never logged, stored, or shared.

---

## 🛠️ Quick Start (Local Setup)

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/my-next-relationship.git
cd my-next-relationship

# 2. Install dependencies for root, client, and server
npm run install:all

# 3. Configure server environment (Optional: add Gemini API Key)
cp server/.env.example server/.env

# 4. Launch local dev environment
npm run dev
```

- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🚀 Anonymous Deployment (Hide GitHub Repository Link)

If you want to deploy the app publicly **without revealing or redirecting to your GitHub profile**, follow these recommended zero-link deployment methods:

### Method A: Vercel CLI (Frontend) + Render (Backend)

#### 1. Deploy Backend on Render (Private Service)
1. Go to [Render Dashboard](https://dashboard.render.com/) -> **New Web Service**.
2. Connect your repository (set repository visibility to **Private**).
3. Set **Root Directory**: `server`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server.js`
6. Add Environment Variable: `GEMINI_API_KEY` = `your_actual_key`
7. Copy your deployed backend URL: `https://my-next-relationship-api.onrender.com`.

> *Render Web Services do NOT display your GitHub repo link to public visitors!*

#### 2. Deploy Frontend via Vercel CLI (Direct Anonymous Upload)
Deploy directly from your command line without linking any public GitHub repo:
```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to client directory
cd client

# Set backend API URL for production build
echo "VITE_API_URL=https://my-next-relationship-api.onrender.com" > .env.production

# Build static bundle
npm run build

# Deploy dist folder directly to Vercel
vercel deploy --prod dist
```
- **Result**: Vercel gives you a clean URL (e.g. `https://my-next-relationship.vercel.app`) with **ZERO links or redirects to GitHub**!

---

### Method B: Netlify Drag-and-Drop (Direct Static Hosting)

1. Build the production bundle:
   ```bash
   cd client
   echo "VITE_API_URL=https://my-next-relationship-api.onrender.com" > .env.production
   npm run build
   ```
2. Go to [Netlify Drop](https://app.netlify.com/drop).
3. Drag & drop the `client/dist` folder into Netlify.
4. **Result**: Your app is deployed instantly at `https://my-next-relationship.netlify.app` with zero connection or reference to GitHub!

---

## 📂 Project Architecture

```
my-next-relationship/
├── client/                     # React 19 + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── UserInputForm.jsx   # Centered Gen-Z input form
│   │   │   └── ZigZagDiagram.jsx   # 7-Node Symmetrical Wave Visualizer
│   │   ├── App.jsx                 # App state & header logo reset
│   │   ├── index.css               # Neo-brutalist styling system
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── server/                     # Node.js + Express Backend
│   ├── server.js               # /api/generate Gemini API & Fallback Engine
│   ├── package.json
│   └── .env.example
├── DEPLOYMENT.md               # Detailed deployment guide
├── package.json                # Root workspace orchestration
└── README.md                   # Project documentation
```

---

## 📜 License

MIT License © 2026 My Next Relationship
