# 🚀 User Guide — Local Setup & Cloud Deployment

Welcome to **urBackend**! This repository is an **NPM Workspaces Monorepo** containing three core microservices:
1. `apps/web-dashboard`: React/Vite Frontend Interface
2. `apps/dashboard-api`: SaaS Admin Backend (Control Plane)
3. `apps/public-api`: Core User API Backend (Data Plane)

All common logic is shared securely via the `@urbackend/common` package.

---

## 💻 1. How to Run Locally

Running this entire monorepo stack on your computer is insanely simple.

### Prerequisites
- Node.js v20+
- A running MongoDB instance (or MongoDB Atlas Free cluster)
- A running Redis instance (or Redis Cloud Free instance)

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/urBackend.git
   cd urBackend
   ```

2. **Install all dependencies globally:**
   *(Do not run inside sub-folders. This symlinks the workspaces perfectly).*
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Copy the example file to the root directory and fill in your actual credentials.
   ```bash
   cp .env.example .env
   ```

4. **Boot the entire stack!**
   Run the following command at the root directory:
   ```bash
   npm run dev
   ```
   *This single command will concurrently spin up the `dashboard-api` (port 1234), `public-api` (port 1235), and the Vite `web-dashboard` (port 5173).*

---

## ☁️ 2. Cloud Deployment — Render + Vercel

To deploy this monorepo to production for free, you will deploy it as 3 separate cloud services.

### 2.1 Backend 1: Dashboard API (Render)
This server exclusively manages Developer Accounts, API Keys, and Projects.
1. Create a **New Web Service** on [Render.com](https://render.com).
2. Connect your GitHub repository.
3. Apply the following crucial settings:
   - **Root Directory:** *(Leave completely Blank / Empty)*
   - **Build Command:** `npm install`
   - **Start Command:** `cd apps/dashboard-api && node src/app.js`
4. Add all environment variables from your `.env` (MongoDB, Redis, JWT Secrets etc). 
5. Deploy and save the generated live URL.

### 2.2 Backend 2: Public API (Render)
This server handles Public Schema routing, Data Insertion, and File Storage for end-users.
1. Create a **Second Web Service** on Render connected to the **exact same** repository.
2. Apply the following settings:
   - **Root Directory:** *(Leave completely Blank / Empty)*
   - **Build Command:** `npm install`
   - **Start Command:** `cd apps/public-api && node src/app.js`
3. Paste the exact same environment variables as Backend 1.
4. Deploy and save the generated live URL.

### 2.3 Frontend: Web Dashboard (Vercel)
This is the user interface developers use to interact with your SaaS.
1. Import the repository on [Vercel](https://vercel.com).
2. Open **"Edit"** on the Root Directory setting and select: `apps/web-dashboard`
3. Vercel will auto-detect the Vite framework.
4. Under Environment Variables, add:
   - `VITE_API_URL` = `<Your Dashboard API Render URL>`
5. Click **Deploy**. Vercel will automatically run `npm install` at the root and build your dashboard.

---

## 🐳 3. Self-Hosting via Docker

If you prefer self-hosting on a VPS (like DigitalOcean, AWS EC2, or Hetzner), this repository includes battle-tested, multistage Dockerfiles and a root `docker-compose.yml`.

1. Clone your repo onto your server.
2. Ensure your `.env` file is placed exactly at the root directory.
3. Run the complete orchestration:
   ```bash
   docker-compose up -d --build
   ```
This single command will automatically download the Node.js alpine images, run the workspace installations, and securely boot up MongoDB, Redis, the Dashboard API, and the Public API in perfectly isolated containers!
