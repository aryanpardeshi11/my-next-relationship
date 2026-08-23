# 💖 MY NEXT RELATIONSHIP

> **"Statistically Improbable. Highly Exaggerated. 100% Iconic."** 💀✨
>
> A full-stack, Gen-Z styled satirical matchmaking web app powered by Google Gemini AI (`gemini-2.5-flash`) & Express. Features real-time predictive text scrambling, a symmetrical 7-node wave path visualization, auto-generated sarcastic match imaginations, and 1-click Snapchat/Instagram 9:16 story export.

![Aesthetic](https://img.shields.io/badge/Aesthetic-Gen--Z_Neo--Brutalist-FF52A2)
![Stack](https://img.shields.io/badge/Stack-React_19_|_Vite_6_|_Node.js_|_Express_|_Google_Gemini-8B5CF6)
![Matchmaker](https://img.shields.io/badge/Matchmaker-Delusional_AI-00F0FF)
![Security](https://img.shields.io/badge/Security-Server--Side_API_Key-00E699)

---

## 🔮 What Is "My Next Relationship"?

Have you ever wondered what the universe (or a chaotic AI algorithm) has planned for your romantic future? Forget boring dating app profiles. **My Next Relationship** takes your basic inputs and runs them through a satirical, unhinged matchmaking engine.

Instead of standard dates, the **Predictive Match Path** generates 7 hilarous, statistically improbable parameters connected visually along a 3-peak wave path:

1. **Age**: Extreme numeric age strictly between `12–19` or `45–90` (e.g. `14`, `78`, `89`).
2. **Gender**: Identity selected randomly (e.g. `Male`, `Female`, `Non-binary`).
3. **Height**: Highly specific / unusual height (e.g. `4'11" and ¾"`, `6'8"`, `5'2" (5'7" in boots)`).
4. **Occupation**: Weird real-world jobs (e.g. `Golf Ball Diver`, `Water Slide Tester`, `Pet Psychic`).
5. **Personality**: Concise sarcastic trait (e.g. `Fears Tupperware`, `Ranks Soup Brands`).
6. **Primary Hobby**: Unique hobbies (e.g. `Bird Watching`, `Collecting Lint`, `Baking Micro-Pies`).
7. **Green Flag**: Sarcastic red-flag habit labeled as a green flag (e.g. `Claps On Landing`, `Wipes On Jeans`, `Brings Spreadsheet`).

---

## ⚡ Main Features & Gen-Z Capabilities

### 1. 📈 Symmetrical 7-Node SVG Wave Path & Text Scramble

- Renders 7 fixed nodes in a symmetrical 3-peak wave (`\/\/\`).
- Dark active polyline extends in real time while parameters scramble dynamically before locking on each node.
- Header tag: **`MATCHMAKER: DELUSIONAL AI`**.
- Intelligent responsive scroll hint (`← SWIPE HORIZONTALLY TO VIEW ALL 7 NODES →`) visible **only on mobile** and hidden on desktop.

### 2. 🔮 Auto-Generated Sarcastic AI Match Imagination

- As soon as Node 7 locks in, Gemini 2.5 Flash crafts a witty, 2–3 sentence exaggerated story of what dating or living with your match would actually look like.
- Includes a **`↻ RE-GENERATE`** button in the card header to re-roll stories anytime.
- Smart local fallback engine guarantees 100% uptime even if offline or if API quotas are reached.

### 3. 👻 Snapchat & Instagram 9:16 Story Exporter

- **`👻 SHARE MATCH SNAP`** button sits side-by-side with `I DESERVE BETTER ↺` in equal size.
- Uses `html2canvas` to render a high-res (960x540) vertical 9:16 story image card ready for Snapchat or Instagram Stories.
- **Clean Image Sharing**: Uses native Web Share API (`navigator.share`) to send **only the clean PNG image card** directly to Snapchat or WhatsApp without annoying text clutter.
- **Dynamic Site Link**: Displays the active host link (`my-next-relationship.vercel.app` / `my-next-relationship.onrender.com`) directly on the image card so friends can try it.

### 4. 🎨 Gen-Z Neo-Brutalist Design System

- High-contrast 3px black borders, hard 5px offset box shadows (`box-shadow: 5px 5px 0px #000`), pop color palette (Yellow `#FFE600`, Hot Pink `#FF52A2`, Cyan `#00F0FF`, Mint `#00E699`, Purple `#8B5CF6`).
- White Neo-Brutalist **`IT'S A PERFECT MATCH 😉`** banner card.
- Generous, clean vertical spacing throughout the workspace.

---

## 🔒 Security & Privacy

1. **Zero Client API Key Leak**: `GEMINI_API_KEY` is kept strictly on the Node/Express backend (`server/server.js`). Client bundles contain zero secrets.
2. **Local Fallback Engine**: If no API key is provided or network issues occur, the backend automatically uses a local fallback generator (`source: 'fallback'`).
3. **No User Tracking**: Inputs are processed in-memory and never logged or stored.

---

## 📂 Codebase Architecture

```text
my-next-relationship/
├── client/                         # React 19 + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── UserInputForm.jsx   # Centered Gen-Z input form
│   │   │   ├── ZigZagDiagram.jsx   # 7-Node SVG Wave Visualizer & Scramble
│   │   │   ├── MatchDescription.jsx # Sarcastic AI Story Generator
│   │   │   └── SocialShareModal.jsx # Snapchat / IG 9:16 Image Story Exporter
│   │   ├── App.jsx                 # Main application state & workflow
│   │   ├── index.css               # Neo-brutalist styling system
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json                # client dependencies (html2canvas, React 19)
│   └── vite.config.js
├── server/                         # Node.js + Express Backend
│   ├── server.js                   # Express routes (/api/generate, /api/describe)
│   ├── package.json
│   └── .env.example
├── DEPLOYMENT.md                   # Detailed deployment guide
├── package.json                    # Workspace orchestration
└── README.md                       # Project documentation
```

---

## 🛠️ Local Development Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/aryanpardeshi11/my-next-relationship.git
cd my-next-relationship

# 2. Install client & server dependencies
cd server && npm install
cd ../client && npm install

# 3. Start local development servers
# Terminal 1 (Server):
cd server && npm start

# Terminal 2 (Client):
cd client && npm run dev
```

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 📜 License

MIT License © 2026 **My Next Relationship** — Built with 💖 and a touch of delusion.
