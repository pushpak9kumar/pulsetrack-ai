# 🏋️‍️ PulseTrack AI - Smart Fitness Tracker

PulseTrack AI ek full-stack fitness tracking application hai jo users ko apne workouts log karne, goals set karne, aur **AI-powered personalized feedback** lene me madad karta hai.

## 🚀 Live Demo
- **Frontend:** [Vercel Link Here]
- **Backend:** [Render/Railway Link Here]

## ✨ Features
- 🔐 **Authentication:** Secure JWT-based login/signup.
- 🏋️ **Workout Logging:** Log workouts with type, duration, and calories.
- 🎯 **Goal Tracking:** Set weekly minute goals and track progress with a dynamic progress bar.
- 🤖 **AI Coach:** Integrated Google Gemini API to provide personalized performance analysis, tips, and nutrition suggestions.
- 🗑️ **CRUD Operations:** Create, read, and delete workouts with optimistic UI updates.
- 🏆 **Gamification:** Earn XP and level up based on workout consistency.

## 🛠️ Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express.js
- **Databases:** 
  - MongoDB (NoSQL) for Workouts
  - PostgreSQL (via Prisma ORM) for Users & Goals
- **AI Integration:** Google Gemini 2.5 Flash API
- **Authentication:** JSON Web Tokens (JWT)

## 📂 Project Structure
```text
pulsetrack-ai/
├── backend/
│   ├── src/
│   │   ├── controllers/ (Auth, User, Workout, AI)
│   │   ├── middleware/ (Auth protection)
│   │   ├── models/ (Mongoose schemas)
│   │   ├── routes/ (API endpoints)
│   │   └── services/ (AI service)
│   └── prisma/ (PostgreSQL schema)
└── frontend/
    └── src/
        ├── components/ (Navbar)
        ├── context/ (AuthContext)
        ├── pages/ (Dashboard, Login, LogWorkout)
        └── services/ (API interceptor)