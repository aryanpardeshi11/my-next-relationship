# 💖 MY NEXT RELATIONSHIP (VER 2.0)

> **"Statistically Improbable. Highly Exaggerated. 100% Iconic."** 💀✨
>
> A full-stack, Gen-Z styled satirical matchmaking web app powered by Google Gemini AI (`gemini-2.5-flash`) & Express. Features real-time predictive text scrambling, a symmetrical 7-node wave path visualization, a Desperation Meter (1–100%), a 4-to-2 Pity System, interactive reaction chips, 5 Snapchat story themes, and 1-click 9:16 PNG story exports.

![Version](https://img.shields.io/badge/Version-2.0_Gen--Z_Edition-FF52A2)
![Aesthetic](https://img.shields.io/badge/Aesthetic-Gen--Z_Neo--Brutalist-FFE600)
![Stack](https://img.shields.io/badge/Stack-React_19_|_Vite_6_|_Node.js_|_Express_|_Google_Gemini-8B5CF6)
![Deployment](https://img.shields.io/badge/Live-my--next--relationship.vercel.app-00E5FF)

---

## 🔮 What Is "My Next Relationship"?

Have you ever wondered what the universe (or a chaotic AI algorithm) has planned for your romantic future? Forget boring dating app profiles. **My Next Relationship** takes your basic inputs and runs them through a satirical, unhinged matchmaking engine.

Instead of standard dates, the **Predictive Match Path** generates 7 hilarious, statistically improbable parameters connected visually along a 3-peak wave path:

1. **Age**: Extreme numeric age strictly between `12–19` or `45–90` (e.g. `14`, `78`, `89`).
2. **Gender**: Identity selected randomly (e.g. `Male`, `Female`, `Non-binary`).
3. **Height**: Highly specific / unusual height (e.g. `4'11" and ¾"`, `6'8"`, `5'2" (5'7" in boots)`).
4. **Occupation**: Weird real-world jobs (e.g. `Golf Ball Diver`, `Water Slide Tester`, `Pet Psychic`, `Dice Tester`).
5. **Personality**: Concise sarcastic trait (e.g. `Fears Tupperware`, `Aggressively Polite`, `Ranks Soup Brands`).
6. **Primary Hobby**: Unique hobbies (e.g. `Bird Watching`, `Collecting Lint`, `Baking Micro-Pies`).
7. **Green Flag**: Sarcastic red-flag habit labeled as a green flag (e.g. `Claps On Landing`, `Snoozes 12 Alarms`, `Brings Spreadsheet`).

---

## ⚡ Major V2.0 Features & Capabilities

### 1. 🆘 Desperation Meter (1–100% Range Slider)
- **Interactive Slider**: Allows users to set their level of romantic desperation (1–100%).
- **Dynamic Gen-Z Badges**: Displays dynamic tier badges based on value: `CHILL 🥱` (1-30%), `MEDIUM 😬` (31-65%), `HIGH 🆘` (66-85%), `MAX UNHINGED 🔥` (86-100%).
- **Parameter Pool Scaling**: High desperation scores amplify the chaos and wildness of generated match parameters!

### 2. 🏆 4-to-2 Pity System (Realistic Matches)
- **Balanced Match Progression**:
  - **Attempts 1, 2, 3, 4**: Chaotic / Statistically Improbable / Funny predictions.
  - **Attempts 5 & 6**: **Genuine & Realistic Matches** (`🏆 GENUINE REALISTIC MATCH UNLOCKED!`) featuring compatible partners (e.g., Architect & UX Designer).
- **Persistent Attempt Counter**: User attempt count (`matchAttemptCount`) is saved to `localStorage` and never resets or decreases across browser refreshes.

### 3. 💬 4 Interactive Reaction Badges
- **Express Yourself**: Right above the main action buttons, users can select how they feel about their match:
  - `😭 I ACCEPT MY FATE`
  - `🆘 SOMEONE SAVE ME`
  - `🤐 I'M SPEECHLESS`
  - `💀 RED FLAG MAGNET`
- **Dynamic 3D Pop Styling**: Unselected buttons start in clean white; clicking any button highlights it with a vibrant pop color and 3D shadow.

### 4. 👻 Snapchat & Instagram 9:16 Story Exporter
- **5 Custom Story Themes**:
  - 💛 `NEO YELLOW`
  - 🩷 `CYBER PINK`
  - 💚 `TOXIC GREEN`
  - 🩵 `HYPER CYAN`
  - 🖤 `DARK GOTH`
- **Visual Progress Bar & Contrast Safeguards**: Features a visual progress bar for desperation. If a theme's background matches a container box color (e.g., Yellow theme + Yellow box), the app automatically switches container colors for 100% pop contrast!
- **🎯 Prediction Attempt Header Badge**: Renders `PREDICTION ATTEMPT #...` on the extreme right of the story header.
- **Uniform White Match Imagination Box**: Ensures the sarcastic AI story box renders in crisp `#FFFFFF` with black text across all themes (including Dark Goth).

### 5. 🔗 Ultra-Clean Link Sharing
- **Compressed Match Codes**: Base64 array compression reduces shared URL length by >60%.
- **Single URL Native Attachment**: Web Share API payload passes clean site link (`https://my-next-relationship.vercel.app`) without duplicating URLs in chat messages.

---

## 🔒 Security & Privacy

1. **Zero Client API Key Leak**: `GEMINI_API_KEY` is kept strictly on the Node/Express backend (`server/server.js`). Client bundles contain zero secrets.
2. **Local Fallback Engine**: If no API key is provided or network issues occur, the system uses a robust local fallback generator with 50+ items per pool.
3. **No User Tracking**: Inputs are processed in-memory and never logged or stored.

---

## 📂 Codebase Architecture

```text
my-next-relationship/
├── client/                         # React 19 + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── UserInputForm.jsx   # Input form with Desperation Range Slider
│   │   │   ├── ZigZagDiagram.jsx   # 7-Node SVG Wave Visualizer & Scramble
│   │   │   ├── MatchDescription.jsx # Sarcastic AI Story Generator
│   │   │   └── SocialShareModal.jsx # Snapchat / IG 9:16 Image Story Exporter
│   │   ├── App.jsx                 # Main application state, Pity system, & Reaction state
│   │   ├── index.css               # Neo-brutalist styling system & keyframes
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json                # client dependencies (html2canvas, qrcode, React 19)
│   └── vite.config.js
├── server/                         # Node.js + Express Backend
│   ├── server.js                   # Express routes (/api/generate, /api/describe) & pools
│   ├── package.json
│   └── .env.example
├── DEPLOYMENT.md                   # Detailed Vercel / Render deployment guide
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
