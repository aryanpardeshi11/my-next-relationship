# Deployment Guide - My Next Relationship

This guide details how to run **My Next Relationship** locally and deploy it securely to production. It includes instructions for **Standard Deployment** (GitHub Pages + Render) as well as **Anonymous Zero-Link Deployment** (Vercel CLI / Netlify Drop) so visitors never see or get redirected to your GitHub repository.

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

## 2. Deploying Backend (Express) to Render

Deploying the Express backend to [Render](https://render.com) keeps your `GEMINI_API_KEY` hidden securely away from client-side code. Render web services do **NOT** expose your GitHub profile link to public visitors.

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
3. Connect your repository `my-next-relationship` (or set repository visibility to Private).
4. Configure settings:
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

## 3. Anonymous Deployment (Hide GitHub Link Completely)

If you do NOT want your website visitors to know your GitHub profile or be redirected to GitHub, use one of the zero-link deployment methods below:

### Option A: Vercel CLI Deployment (Recommended)
Deploy static files directly from your local terminal without connecting or linking a public GitHub repository.

1. Create `.env.production` inside `client/`:
   ```env
   VITE_API_URL=https://my-next-relationship-api.onrender.com
   ```
2. Build static frontend bundle:
   ```bash
   cd client
   npm run build
   ```
3. Deploy directly via Vercel CLI:
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Deploy production dist directory
   vercel deploy --prod dist
   ```
- **Result**: Vercel hosts your app at a custom domain (e.g., `https://my-next-relationship.vercel.app`) with **ZERO backlinks, redirects, or mentions of GitHub**!

---

### Option B: Netlify Direct Drop
Deploy static files via drag-and-drop:

1. Build static frontend bundle:
   ```bash
   cd client
   echo "VITE_API_URL=https://my-next-relationship-api.onrender.com" > .env.production
   npm run build
   ```
2. Go to [Netlify Drop](https://app.netlify.com/drop).
3. Drag and drop the `client/dist` folder into Netlify.
4. **Result**: Your site is live instantly at `https://my-next-relationship.netlify.app` with zero link to GitHub!

---

## 4. Standard GitHub Pages Deployment (Alternative)

If you prefer using GitHub Pages:

### Step 1: Configure `homepage` and `VITE_API_URL`
1. Open `client/package.json` and add your GitHub Pages URL:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/my-next-relationship"
   ```
2. Create `.env.production` inside `client/`:
   ```env
   VITE_API_URL=https://my-next-relationship-api.onrender.com
   ```

### Step 2: Deploy to GitHub Pages
From root:
```bash
npm run deploy:client
```
Enable Pages under GitHub Repository **Settings** -> **Pages** (Source: `gh-pages` branch).
