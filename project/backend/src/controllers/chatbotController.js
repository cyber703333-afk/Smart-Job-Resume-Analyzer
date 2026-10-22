// const Application = require("../models/Application");

// // Simple rule-based chatbot: matches the user's message against known
// // intents by keyword, and for logged-in candidates can answer live
// // questions about their own application status by querying the database.
// // This avoids needing any external AI API key, while still giving a
// // genuinely useful, dynamic answer (not just a canned FAQ).

// const FAQ = [
//   {
//     keywords: ["apply", "how to apply", "how do i apply"],
//     answer: 'To apply: open a job from "Browse Jobs", click into its details page, upload your resume (PDF/DOC), and click "Apply now".',
//   },
//   {
//     keywords: ["post a job", "post job", "how to post"],
//     answer: 'Recruiters can post a job from the "Post a Job" page in their dashboard — fill in the title, location, type, salary, description and requirements, then publish.',
//   },
//   {
//     keywords: ["forgot password", "reset password", "change password"],
//     answer: "There's no self-service password reset yet in this version — please contact the admin to reset your password, or log in and update it from your profile if you remember your current password.",
//   },
//   {
//     keywords: ["save job", "bookmark", "saved jobs"],
//     answer: 'Click the ☆ star icon on any job card or job details page to save it. You can view all saved jobs from "Saved Jobs" in your candidate dashboard.',
//   },
//   {
//     keywords: ["interview", "schedule"],
//     answer: "If a recruiter shortlists you, they can propose interview time slots. You'll get a notification — check your Interviews page to pick a slot that works for you.",
//   },
//   {
//     keywords: ["match score", "match percentage", "how matched"],
//     answer: "Your match score is calculated by comparing the skills mentioned in your resume against the skills required for the job — it's shown to recruiters to help them prioritize applicants, and higher is better.",
//   },
//   {
//     keywords: ["contact", "support", "help"],
//     answer: 'You can reach out via the "Contact" page in the navbar, or just ask me here!',
//   },
// ];

// function matchFAQ(message) {
//   const lower = message.toLowerCase();
//   const hit = FAQ.find((entry) => entry.keywords.some((k) => lower.includes(k)));
//   return hit ? hit.answer : null;
// }

// async function chat(req, res) {
//   try {
//     const { message } = req.body;
//     if (!message) return res.status(400).json({ message: "message is required." });
//     const lower = message.toLowerCase();

//     // Live, personalized answer: "what's my application status"
//     if (
//       req.user?.role === "candidate" &&
//       (lower.includes("status") || lower.includes("my application"))
//     ) {
//       const apps = await Application.find({ candidate: req.user._id })
//         .populate("job", "title")
//         .sort({ createdAt: -1 })
//         .limit(5);

//       if (apps.length === 0) {
//         return res.json({ reply: "You haven't applied to any jobs yet — head to Browse Jobs to get started!" });
//       }

//       const lines = apps.map((a) => `• ${a.job?.title || "a job"}: ${a.status}`).join("\n");
//       return res.json({ reply: `Here's the status of your recent applications:\n${lines}` });
//     }

//     const faqAnswer = matchFAQ(message);
//     if (faqAnswer) return res.json({ reply: faqAnswer });

//     return res.json({
//       reply:
//         "I'm not sure about that one yet — try asking about how to apply, saving jobs, your application status, posting a job, or interviews. For anything else, use the Contact page.",
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Chatbot failed to respond.", error: err.message });
//   }
// }

// module.exports = { chat };




// const Anthropic = require("@anthropic-ai/sdk");
// const Application = require("../models/Application");

// const client = process.env.ANTHROPIC_API_KEY
//   ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
//   : null;

// const FALLBACK =
//   "I'm not sure about that one yet — try asking about how to apply, saving jobs, your application status, posting a job, or interviews. For anything else, use the Contact page.";

// const SYSTEM_PROMPT =
//   "You are the assistant of Smart Job Platform, a job portal where candidates browse and apply to jobs and recruiters post jobs and manage applicants. " +
//   "Help with: applying, saving jobs, application status, interviews, resumes, job search and career questions. " +
//   "Keep answers short (2-4 sentences). Reply in the same language the user writes in (English, Hindi or Hinglish). " +
//   "If asked something unrelated to jobs, careers or this platform, politely say you can only help with those. " +
//   "Do not invent platform features that you are not sure about.";

// const FAQ = [
//   {
//     keywords: ["apply", "how to apply", "how do i apply"],
//     answer: 'To apply: open a job from "Browse Jobs", click into its details page, upload your resume (PDF/DOC), and click "Apply now".',
//   },
//   {
//     keywords: ["post a job", "post job", "how to post"],
//     answer: 'Recruiters can post a job from the "Post a Job" page in their dashboard — fill in the title, location, type, salary, description and requirements, then publish.',
//   },
//   {
//     keywords: ["forgot password", "reset password", "change password"],
//     answer: "There's no self-service password reset yet in this version — please contact the admin to reset your password, or log in and update it from your profile if you remember your current password.",
//   },
//   {
//     keywords: ["save job", "bookmark", "saved jobs"],
//     answer: 'Click the ☆ star icon on any job card or job details page to save it. You can view all saved jobs from "Saved Jobs" in your candidate dashboard.',
//   },
//   {
//     keywords: ["interview", "schedule"],
//     answer: "If a recruiter shortlists you, they can propose interview time slots. You'll get a notification — check your Interviews page to pick a slot that works for you.",
//   },
//   {
//     keywords: ["match score", "match percentage", "how matched"],
//     answer: "Your match score is calculated by comparing the skills mentioned in your resume against the skills required for the job — it's shown to recruiters to help them prioritize applicants, and higher is better.",
//   },
//   {
//     keywords: ["contact", "support"],
//     answer: 'You can reach out via the "Contact" page in the navbar, or just ask me here!',
//   },
// ];

// function matchFAQ(message) {
//   const lower = message.toLowerCase();
//   const hit = FAQ.find((entry) => entry.keywords.some((k) => lower.includes(k)));
//   return hit ? hit.answer : null;
// }

// async function askAI(message) {
//   if (!client) return null; // API key nahi hai to AI skip
//   const response = await client.messages.create({
//     model: "claude-haiku-5-5",
//     max_tokens: 300,
//     system: SYSTEM_PROMPT,
//     messages: [{ role: "user", content: message }],
//   });
//   return response.content[0]?.text || null;
// }

// async function chat(req, res) {
//   try {
//     const { message } = req.body;
//     if (!message) return res.status(400).json({ message: "message is required." });
//     const lower = message.toLowerCase().trim();

//     // Greeting
//     if (/^(hi|hello|hey|namaste)\b/.test(lower)) {
//       return res.json({
//         reply: "Hi! I can help with applying to jobs, saved jobs, your application status, posting a job, and interviews. What would you like to know?",
//       });
//     }

//     // Live, personalized answer: "what's my application status"
//     if (
//       req.user?.role === "candidate" &&
//       (lower.includes("status") || lower.includes("my application"))
//     ) {
//       const apps = await Application.find({ candidate: req.user._id })
//         .populate("job", "title")
//         .sort({ createdAt: -1 })
//         .limit(5);

//       if (apps.length === 0) {
//         return res.json({ reply: "You haven't applied to any jobs yet — head to Browse Jobs to get started!" });
//       }

//       const lines = apps.map((a) => `• ${a.job?.title || "a job"}: ${a.status}`).join("\n");
//       return res.json({ reply: `Here's the status of your recent applications:\n${lines}` });
//     }

//     // Common questions: rules (free + fast)
//     const faqAnswer = matchFAQ(message);
//     if (faqAnswer) return res.json({ reply: faqAnswer });

//     // Everything else: AI (agar fail ho to purana fallback message)
//     try {
//       const aiReply = await askAI(message);
//       if (aiReply) return res.json({ reply: aiReply });
//     } catch (aiErr) {
//       console.error("AI CHATBOT ERROR:", aiErr.message);
//     }

//     return res.json({ reply: FALLBACK });
//   } catch (err) {
//     res.status(500).json({ message: "Chatbot failed to respond.", error: err.message });
//   }
// }

// module.exports = { chat };



const Application = require("../models/Application");
const Job = require("../models/Job");

console.log("chatbotController (Gemini version) loaded");

const SYSTEM_PROMPT =
  "You are the assistant of Smart Job Platform, a job portal where candidates browse and apply to jobs and recruiters post jobs. " +
  "Help with applying, saving jobs, application status, interviews, resumes, job search and career questions. " +
  "Keep answers short (2-4 sentences). Reply in the same language the user writes in (English, Hindi or Hinglish). " +
  "If asked something unrelated to jobs or careers, politely say you can only help with those.";

// ---------- Gemini AI ----------
async function askGemini(message) {
  if (!process.env.GEMINI_API_KEY) {
    console.log("AI SKIPPED: GEMINI_API_KEY nahi mili (.env check karo)");
    return null;
  }
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: { maxOutputTokens: 400 },
    }),
  });

  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data?.error?.message || `Gemini API error ${resp.status}`);
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

// ---------- FAQ rules ----------
const FAQ = [
  {
    keywords: ["how to apply", "how do i apply", "apply kaise", "apply kare"],
    answer: 'To apply: open a job from "Browse Jobs", click into its details page, upload your resume (PDF/DOC), and click "Apply now".',
  },
  {
    keywords: ["post a job", "post job", "how to post"],
    answer: 'Recruiters can post a job from the "Post a Job" page in their dashboard — fill in the title, location, type, salary, description and requirements, then publish.',
  },
  {
    keywords: ["forgot password", "reset password", "change password"],
    answer: "There's no self-service password reset yet in this version — please contact the admin to reset your password.",
  },
  {
    keywords: ["save job", "bookmark", "saved jobs"],
    answer: 'Click the ☆ star icon on any job card or job details page to save it. You can view all saved jobs from "Saved Jobs" in your candidate dashboard.',
  },
  {
    keywords: ["match score", "match percentage", "how matched"],
    answer: "Your match score compares the skills in your resume with the skills required for the job. Higher is better, and recruiters use it to prioritize applicants.",
  },
  {
    keywords: ["thank", "thanks", "thx", "shukriya", "dhanyavad"],
    answer: "You're welcome! Let me know if you need anything else.",
  },
  {
    keywords: ["contact page", "contact support"],
    answer: 'You can reach out via the "Contact" page in the navbar, or just ask me here!',
  },
];

function matchFAQ(message) {
  const lower = message.toLowerCase();
  const hit = FAQ.find((entry) => entry.keywords.some((k) => lower.includes(k)));
  return hit ? hit.answer : null;
}

// ---------- Job search from DB ----------
const STOP_WORDS = new Set([
  "i", "me", "my", "a", "an", "the", "is", "are", "am", "of", "for", "in", "on", "to", "and", "or",
  "any", "some", "show", "find", "need", "want", "looking", "job", "jobs", "role", "roles",
  "available", "there", "kya", "hai", "mujhe", "chahiye", "dikhao", "batao",
]);

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function searchJobs(message) {
  const words = message
    .toLowerCase()
    .replace(/[^a-z0-9+#. ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));

  // Sirf chhote (1-3 word) queries par DB search, lambe sawal AI ko jayenge
  if (words.length === 0 || words.length > 3) return [];

  const regexes = words.map((w) => new RegExp(escapeRegex(w), "i"));
  return Job.find({
    $or: [
      { title: { $in: regexes } },
      { company: { $in: regexes } },
      { location: { $in: regexes } },
      { type: { $in: regexes } },
      { requirements: { $in: regexes } },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(5);
}

const FALLBACK =
  "I couldn't find anything for that. Try a skill or role (like React, Python, Intern), or ask about how to apply, saving jobs, your application status, posting a job, or interviews. For anything else, use the Contact page.";

// ---------- Main handler ----------
async function chat(req, res) {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "message is required." });
    const lower = message.toLowerCase().trim();

    // 1. Greeting
    if (/^(h+i+|h+e+l+o+|hlo+|helo+|hey+|namaste|namaskar)\b/.test(lower)) {
      return res.json({
        reply: "Hi! Ask me how to apply, post a job, save jobs, or check your application status. You can also type a skill like React or Python to find matching jobs.",
      });
    }

    // 2. Live: candidate ka application status
    if (
      req.user?.role === "candidate" &&
      (lower.includes("status") || lower.includes("my application"))
    ) {
      const apps = await Application.find({ candidate: req.user._id })
        .populate("job", "title")
        .sort({ createdAt: -1 })
        .limit(5);

      if (apps.length === 0) {
        return res.json({ reply: "You haven't applied to any jobs yet — head to Browse Jobs to get started!" });
      }
      const lines = apps.map((a) => `• ${a.job?.title || "a job"}: ${a.status}`).join("\n");
      return res.json({ reply: `Here's the status of your recent applications:\n${lines}` });
    }

    // 3. FAQ rules
    const faqAnswer = matchFAQ(message);
    if (faqAnswer) return res.json({ reply: faqAnswer });

    // 4. Chhota query (jaise "react", "python ludhiana") -> DB se jobs
    const jobs = await searchJobs(message);
    if (jobs.length > 0) {
      const lines = jobs
        .map((j) => `• ${j.title} at ${j.company} (${j.location}) - ${j.salary}`)
        .join("\n");
      return res.json({ reply: `I found these matching jobs:\n${lines}\n\nOpen Browse Jobs to view details and apply.` });
    }

    // 5. Baaki sab -> Gemini AI
    try {
      const aiReply = await askGemini(message);
      if (aiReply) return res.json({ reply: aiReply });
    } catch (aiErr) {
      console.error("GEMINI ERROR:", aiErr.message);
    }

    return res.json({ reply: FALLBACK });
  } catch (err) {
    res.status(500).json({ message: "Chatbot failed to respond.", error: err.message });
  }
}

module.exports = { chat };