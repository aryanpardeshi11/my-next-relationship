# My Next Relationship

> A stark minimalist, full-stack single-page application that generates hilarious, sarcastic, and statistically improbable relationship match parameters using the Google Gemini API.

![Aesthetic](https://img.shields.io/badge/Aesthetic-Stark_Minimalism-111111)
![Stack](https://img.shields.io/badge/Stack-React_|_Express_|_Gemini_API-blue)

---

## ⚡ Features

- **Stark Minimalist UI:** Solid `#F9F9F9` background with a subtle 1px light gray grid pattern, sharp 0px borders, and pure Inter/Helvetica sans-serif typography. Zero gradients, zero bubble buttons, zero emojis.
- **Secure Gemini API Backend:** Node.js/Express backend handles Gemini API calls (`gemini-2.5-flash`), keeping API keys hidden from client-side code.
- **SVG Zig-Zag Diagram:** Responsive SVG component drawing sharp zig-zag polyline paths connecting circular nodes for Age, Height, Job, Gender, Personality, and Primary Hobby.
- **Data Constraints:**
  - Extreme ages strictly between 12-19 or 45-90 with quirky tags (e.g. "14 (Mental age 65)").
  - Unusual/specific heights (e.g., `4'11 and ¾"`, `6'8"`).
  - Weird professions (e.g. "Golf Ball Diver", "Water Slide Tester").
  - Highly inclusive gender identities.
  - Sarcastic, harmless personality traits & hobbies.
- **Deployment Ready:** Configured for frontend hosting on GitHub Pages and backend hosting on Render.

---

## 🛠️ Quick Start

```bash
# 1. Install dependencies
npm run install:all

# 2. Add your Gemini API Key to server/.env
cp server/.env.example server/.env

# 3. Launch local dev server
npm run dev
```

For full production deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).
