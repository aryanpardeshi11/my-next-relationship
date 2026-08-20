# Deployment Guide - My Next Relationship

This guide details how to run **My Next Relationship** locally and deploy it securely to **GitHub Pages** (Frontend) and **Render** (Express Backend).

---

## 1. Local Development Setup

### Prerequisites
- Node.js (v18+)
- npm

### Step 1: Install Dependencies
From the root directory, run:
```bash
npm run install:all
```
This installs dependencies for both `client/` and `server/` as well as root orchestration tools.

### Step 2: Configure Environment Variables
Copy `.env.example` in the `server` directory to `.env`:
```bash
cp server/.env.example server/.env
```
Open `server/.env` and add your Google Gemini API Key:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```
> *Note: If `GEMINI_API_KEY` is left blank, the server will automatically use the built-in smart fallback generator for local testing.*

### Step 3: Run the Application
Run both frontend and backend concurrently:
```bash
npm run dev
```
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## 2. Deploying Backend to Render

Deploying the Express backend to [Render](https://render.com) keeps your `GEMINI_API_KEY` hidden securely away from client-side code.

### Step 1: Push Code to GitHub
Initialize Git and push your repository to GitHub:
```bash
git init
git add .
git commit -m "Initial commit of My Next Relationship fullstack app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/my-next-relationship.git
git push -u origin main
```

### Step 2: Create a Web Service on Render
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository `my-next-relationship`.
4. Configure the settings:
   - **Name:** `my-next-relationship-api`
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Under **Environment Variables**, add:
   - Key: `GEMINI_API_KEY`, Value: `[Your Actual Gemini API Key]`
   - Key: `NODE_ENV`, Value: `production`
6. Click **Create Web Service**.
7. Once deployed, copy your Render API URL (e.g., `https://my-next-relationship-api.onrender.com`).

---

## 3. Deploying Frontend to GitHub Pages

### Step 1: Configure `homepage` and `VITE_API_URL`
1. Open `client/package.json` and add your GitHub Pages URL:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/my-next-relationship"
   ```
2. Create a `.env.production` file inside `client/`:
   ```env
   VITE_API_URL=https://my-next-relationship-api.onrender.com
   ```
   *(Replace with your actual Render service URL).*

### Step 2: Deploy to GitHub Pages
From the root directory, execute:
```bash
npm run deploy:client
```
Or inside `client/`:
```bash
cd client
npm run deploy
```
This builds the React app into `client/dist` and pushes it to the `gh-pages` branch on GitHub automatically.

### Step 3: Enable GitHub Pages
1. Go to your GitHub repository **Settings** -> **Pages**.
2. Set **Source** to `Deploy from a branch`.
3. Select branch `gh-pages` and folder `/ (root)`.
4. Save. Your app will be live at `https://YOUR_USERNAME.github.io/my-next-relationship`!
