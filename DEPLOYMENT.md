# 🚀 Campus Placement Portal - Deployment Guide

## Project Structure
```
placement-portal/
├── client/          ← Next.js Frontend (deploy on Vercel)
└── server/          ← Node.js Backend  (deploy on Railway/Render)
```

---

## 📦 Local Development (First Time Setup)

### 1. Setup Backend (Server)
```bash
cd server
npm install
cp .env.example .env       # Fill in your MongoDB URI and JWT secret
npm run dev                # Starts on http://localhost:5000
```

### 2. Setup Frontend (Client)
```bash
cd client
npm install
cp .env.example .env.local  # Set NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev                 # Starts on http://localhost:3000
```

---

## 🌐 Production Deployment

### Step 1: Deploy Backend on Railway (Free)

1. Go to https://railway.app → Sign up with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select this repo → choose the `server/` folder
4. Add these **Environment Variables** in Railway dashboard:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_strong_secret_key
   CLIENT_URL=https://your-frontend.vercel.app
   GEMINI_API_KEY=your_gemini_key (optional)
   ```
5. Railway will auto-deploy and give you a URL like:
   `https://your-app.railway.app`

**Alternative: Render.com**
- Go to https://render.com → New Web Service
- Connect GitHub → set Root Directory to `server`
- Build: `npm install`, Start: `node server.js`
- Add same environment variables

---

### Step 2: Deploy Frontend on Vercel (Free)

1. Go to https://vercel.com → Sign up with GitHub
2. Click **"New Project"** → Import your GitHub repo
3. Set **Root Directory** to `client`
4. Add **Environment Variable**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   ```
5. Click **Deploy** → Vercel gives you a live URL!

---

### Step 3: Update CORS on Backend

After deploying frontend, update the `CLIENT_URL` env var in Railway:
```
CLIENT_URL=https://your-app.vercel.app
```

---

## 🗄️ MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com → Sign up (free)
2. Create a cluster (M0 Free tier)
3. Database Access → Add user with password
4. Network Access → Add IP → **Allow from anywhere** (0.0.0.0/0)
5. Click **Connect** → **Connect your application** → Copy connection string
6. Replace `<password>` with your user password

Connection string looks like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/placement-portal
```

---

## ✅ Features Included

### Student Portal
- 🔐 Register / Login
- 📋 Browse all job listings
- 🔍 Search & filter jobs
- 💼 View job details
- ⚡ One-click apply
- 📊 Track application status
- 👤 Edit profile (CGPA, skills, branch, college)

### Company Portal
- 🔐 Register / Login
- 📝 Post new jobs
- 📋 View all posted jobs
- 👥 See applicants per job
- ✅ Update applicant status (Shortlist / Select / Reject)
- 🗑️ Delete job postings

### Backend API
- JWT Authentication
- Role-based access (student / company)
- All CRUD operations
- File upload support (resume)
- AI resume analyzer (Gemini)

---

## 🔗 Quick Links After Deployment

- Frontend: `https://your-app.vercel.app`
- Backend health: `https://your-backend.railway.app/`
- Login: `https://your-app.vercel.app/auth/login`
- Register: `https://your-app.vercel.app/auth/register`

---

## 📝 Notes

- The demo credentials in the login page are just hints — create real accounts
- MongoDB Atlas free tier is enough for a college-level placement portal
- Railway free tier gives 500 hours/month (enough for testing)
- Vercel is completely free for personal projects
