# Smart Job & Recruitment Management Platform

Full-stack project: **React (frontend)** + **Node.js/Express (backend)** + **MongoDB (database)**.

```
smart-job-recruitment-platform/
  frontend/    React + Vite app (see frontend/README.md)
  backend/     Express API + MongoDB models (see backend/README.md)
```

## Quick start (run both together)

### 1. Database
Install MongoDB locally (https://www.mongodb.com/try/download/community) and
make sure it's running, **or** create a free cluster on MongoDB Atlas and
copy its connection string.

### 2. Backend
```bash
cd backend
cp .env.example .env      # edit MONGO_URI / JWT_SECRET if needed
npm install
npm run seed               # optional: creates demo accounts + sample jobs
npm run dev                 # runs on http://localhost:5000
```

### 3. Frontend
Open a second terminal:
```bash
cd frontend
cp .env.example .env       # points at http://localhost:5000/api by default
npm install
npm run dev                 # runs on http://localhost:5173
```

### 4. Open the app
Visit `http://localhost:5173` in your browser.

## Demo logins (only if you ran `npm run seed`)
| Role      | Email                | Password |
|-----------|-----------------------|----------|
| Candidate | aman@example.com      | 1234     |
| Recruiter | priya@techcorp.com    | 1234     |
| Admin     | admin@platform.com    | 1234     |

Otherwise, use the **Sign up** page in the app to create a candidate or
recruiter account from scratch — it will be saved to your MongoDB database.

## Strong/AI features included
- 🤖 **AI Resume Matching** — when a candidate applies, their resume (PDF/DOCX) is parsed and compared against the job's requirements using keyword-overlap matching; a match % is shown to both candidate and recruiter, and applicants are sorted by best match.
- 🤖 **Auto Skill Extraction** — job descriptions are scanned for known skills automatically when a recruiter posts a job (no manual tagging needed).
- 🤖 **AI Chatbot** — a floating assistant (bottom-right, every page) answers FAQs and, for logged-in candidates, live questions like "what's my application status".
- 📊 **Recruiter Analytics Dashboard** — applications-per-job chart and hiring-funnel chart (Recharts).
- 📧 **Email Notifications** — candidates get an email when their application status changes (optional — works without email too, see backend `.env.example`).
- 📅 **Interview Scheduling** — recruiters propose time slots for shortlisted candidates; candidates pick one from their Interviews page.

## Tech stack
- **Frontend:** React.js, React Router, Recharts, plain CSS
- **Backend:** Node.js, Express.js, JWT authentication, Multer (resume uploads)
- **Database:** MongoDB (via Mongoose)

## What's connected now
- Login/Register → real accounts stored in MongoDB (`users` collection), passwords hashed with bcrypt
- Browse jobs / Post a job → real `jobs` collection
- Apply to a job → real resume file uploaded to the backend and stored on disk, application saved to `applications` collection
- Recruiter updates application status → updates MongoDB and creates a real notification document for the candidate
- Save/bookmark jobs, admin stats, candidate profile edits → all read/write real MongoDB data

See `backend/README.md` for the full API reference.
