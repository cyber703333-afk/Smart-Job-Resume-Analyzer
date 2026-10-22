# Smart Job & Recruitment Management Platform — Backend

Node.js + Express + MongoDB (Mongoose) REST API for the platform.

## Setup

1. Install MongoDB locally, or create a free cluster on MongoDB Atlas.
2. Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. (Optional but recommended) Seed demo data:
   ```bash
   npm run seed
   ```
   This creates 3 demo accounts and 3 sample jobs — same as the old mock data:
   | Role      | Email                | Password |
   |-----------|-----------------------|----------|
   | Candidate | aman@example.com      | 1234     |
   | Recruiter | priya@techcorp.com    | 1234     |
   | Admin     | admin@platform.com    | 1234     |

5. Start the server:
   ```bash
   npm run dev      # with nodemon (auto-restart)
   # or
   npm start
   ```
   Server runs on `http://localhost:5000` by default.

## Folder structure
```
backend/
  server.js              Express app entry point
  src/
    config/db.js          MongoDB connection
    models/                Mongoose schemas (User, Job, Application, Notification, SavedJob)
    middleware/
      auth.js               JWT verification + role guard
      upload.js             Multer config for resume uploads
    controllers/            Route handler logic
    routes/                 Express routers
    utils/
      generateToken.js       JWT signing helper
      seed.js                 Demo data seeder
  uploads/resumes/         Uploaded resume files are stored here
```

## API reference

### Auth
| Method | Endpoint            | Access  | Description                     |
|--------|----------------------|---------|----------------------------------|
| POST   | `/api/auth/register` | Public  | Create candidate/recruiter account |
| POST   | `/api/auth/login`    | Public  | Log in, returns JWT + user       |
| GET    | `/api/auth/me`       | Private | Get current logged-in user       |

### Jobs
| Method | Endpoint         | Access            | Description                  |
|--------|-------------------|-------------------|-------------------------------|
| GET    | `/api/jobs`        | Public            | List all jobs                |
| GET    | `/api/jobs/:id`    | Public            | Get one job                  |
| GET    | `/api/jobs/mine`   | Recruiter only    | Jobs posted by current user + applicant counts |
| POST   | `/api/jobs`        | Recruiter only    | Create a new job posting     |

### Applications
| Method | Endpoint                     | Access          | Description                          |
|--------|--------------------------------|-----------------|----------------------------------------|
| POST   | `/api/applications`            | Candidate only  | Apply to a job (multipart/form-data: `jobId`, `resume` file) |
| GET    | `/api/applications/mine`       | Candidate only  | My applications, with job details      |
| GET    | `/api/applications/job/:jobId` | Recruiter only  | Applicants for one of my jobs          |
| PATCH  | `/api/applications/:id`        | Recruiter only  | Update an applicant's status (also creates a notification) |

### Saved jobs
| Method | Endpoint                  | Access          | Description                   |
|--------|-----------------------------|-----------------|---------------------------------|
| GET    | `/api/saved-jobs`           | Candidate only  | List my saved/bookmarked jobs |
| POST   | `/api/saved-jobs/:jobId`    | Candidate only  | Toggle save/unsave a job       |

### Notifications
| Method | Endpoint                 | Access          | Description                |
|--------|----------------------------|-----------------|-------------------------------|
| GET    | `/api/notifications`      | Candidate only  | My notifications            |
| PATCH  | `/api/notifications/read` | Candidate only  | Mark all as read             |

### Admin
| Method | Endpoint            | Access      | Description                     |
|--------|-----------------------|-------------|-----------------------------------|
| GET    | `/api/admin/stats`    | Admin only  | Platform-wide counts             |
| GET    | `/api/admin/users`    | Admin only  | List all users                   |

### Interviews
| Method | Endpoint                     | Access         | Description                              |
|--------|--------------------------------|----------------|---------------------------------------------|
| POST   | `/api/interviews`              | Recruiter only | Propose interview slots for an application (`applicationId`, `slots`, `notes`) |
| PATCH  | `/api/interviews/:id/confirm`  | Candidate only | Confirm one of the proposed slots (`slot`) |
| GET    | `/api/interviews/candidate`    | Candidate only | My interview invitations                  |
| GET    | `/api/interviews/recruiter`    | Recruiter only | Interviews I've proposed                  |

### Chatbot
| Method | Endpoint         | Access             | Description                                             |
|--------|--------------------|--------------------|-------------------------------------------------------------|
| POST   | `/api/chatbot`     | Public (optional auth) | Send `{ message }`, get `{ reply }`. Logged-in candidates get live answers about their own application status. |

### User profile
| Method | Endpoint             | Access          | Description                |
|--------|------------------------|-----------------|-------------------------------|
| PATCH  | `/api/users/profile`  | Candidate only  | Update name/education/skills |

## Auth flow
All private routes expect a header:
```
Authorization: Bearer <JWT token>
```
The token is returned from `/api/auth/login` and `/api/auth/register`, and is
what the frontend stores (in memory / localStorage) to stay logged in.

## Resume files
Uploaded resumes are saved to `uploads/resumes/` and served statically at
`http://localhost:5000/uploads/resumes/<filename>`. The API response for an
application includes `resumeUrl` with this path.

## AI features — how they actually work
No external AI API or API key is required — everything below runs locally:

- **Skill extraction** (`src/utils/skillExtractor.js`): a dictionary of ~50 common
  tech/soft skills is matched against free text (job descriptions). This is a classic
  keyword-based NLP technique.
- **Resume parsing** (`src/utils/resumeParser.js`): extracts plain text from uploaded
  PDF (`pdf-parse`) or DOCX (`mammoth`) resumes.
- **Match scoring** (`src/utils/matchScore.js`): extracts skills from both the resume
  text and the job, then `score = (matched skills / job's total skills) × 100`. This
  runs automatically every time a candidate applies (see `applicationController.applyToJob`).
- **Chatbot** (`src/controllers/chatbotController.js`): rule-based intent matching
  for FAQs, plus a live database query for "what's my application status" when the
  candidate is logged in.

## Email setup (optional)
Fill in `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (and optionally `SMTP_FROM`) in `.env`
to enable real emails on application submission and status changes. Leave them blank
and the app works exactly the same — emails are just skipped silently.
For Gmail: enable 2-Step Verification on the account, then create an
[App Password](https://myaccount.google.com/apppasswords) and use that as `SMTP_PASS`
(not your normal Gmail password).
