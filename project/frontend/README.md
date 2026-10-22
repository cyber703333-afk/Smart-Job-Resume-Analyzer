# Smart Job & Recruitment Management Platform — Frontend

React + React Router frontend for the project. Now connects to a **real backend**
(Node.js/Express + MongoDB) instead of mock data — see `../backend`.

## Tech used
- React 18 + Vite
- React Router v6 (client-side routing)
- Plain CSS with design tokens (`src/index.css`) — no external UI library

## Setup

1. Make sure the backend is running first (see `../backend/README.md`).
2. Copy the env file and point it at your backend:
   ```bash
   cp .env.example .env
   ```
   Default assumes the backend runs on `http://localhost:5000`.
3. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```
4. Open the printed local URL (default `http://localhost:5173`).

## Demo logins
Only work if you ran `npm run seed` in the backend:
| Role      | Email                | Password |
|-----------|-----------------------|----------|
| Candidate | aman@example.com      | 1234     |
| Recruiter | priya@techcorp.com    | 1234     |
| Admin     | admin@platform.com    | 1234     |

Otherwise, use the **Sign up** page to create your own candidate/recruiter account.

## Project structure
```
src/
  api/            client.js – fetch() wrapper that talks to the backend REST API
  components/     Navbar (with notifications), Sidebar, StatusPill, JobCard (with save button),
                  DashboardLayout, ProtectedRoute
  context/        AppContext.jsx – auth (JWT via localStorage) + jobs + saved jobs + notifications,
                  all backed by real API calls
  data/           mockData.js – only used now for the STATUS constant / pill colors
  pages/          Home, About, Contact, Login, Register, JobListings, JobDetails
  pages/candidate/  CandidateApplications, CandidateSavedJobs, CandidateProfile
  pages/recruiter/  RecruiterJobs, PostJob, RecruiterApplicants
  pages/admin/       AdminDashboard
```

## Features included
- Public: Home (hero + stats + featured jobs), About, Contact, Job Listings (search/filter), Job Details
- Auth: Login & Register (role-based: candidate/recruiter), JWT stored in localStorage so refresh keeps you logged in
- Candidate: apply with real resume file upload (PDF/DOC, 5MB limit, stored on the backend), save/bookmark jobs, track application status, edit profile
- Recruiter: post jobs, view postings with live applicant counts, review applicants (with resume download link), update application status
- Notifications: candidates get a notification whenever a recruiter updates their application status (bell icon in navbar)
- Admin: platform-wide stats + user list, pulled live from the database

## How auth works here
On login/register, the backend returns a JWT + user object. The frontend stores
both in `localStorage` (`sjrmp_token`, `sjrmp_user`) so the session survives a
page refresh. Every protected API call sends `Authorization: Bearer <token>`.
