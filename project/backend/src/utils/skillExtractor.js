// Lightweight keyword-based skill extractor.
// Given free-text (a job description, or a resume), returns the known
// tech/soft skills it mentions. This is a simple NLP technique —
// dictionary + text matching — that needs no external AI API or network
// call, so it works fully offline.

const SKILL_DICTIONARY = [
  // frontend
  "html", "css", "javascript", "typescript", "react", "react.js", "redux", "vue",
  "angular", "next.js", "tailwind", "bootstrap", "sass",
  // backend
  "node.js", "node", "express", "express.js", "django", "flask", "spring boot",
  "rest api", "graphql", "microservices",
  // databases
  "mongodb", "mongoose", "mysql", "postgresql", "sql", "firebase", "redis",
  // languages
  "python", "java", "c++", "c#", "php", "golang", "ruby",
  // devops/tools
  "git", "github", "docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "linux",
  // data/ai
  "machine learning", "deep learning", "data analysis", "pandas", "numpy",
  "tensorflow", "pytorch", "nlp", "data structures", "algorithms",
  // soft / general
  "communication", "teamwork", "problem solving", "leadership", "agile", "scrum",
  "testing", "debugging", "api integration", "responsive design",
];

function extractSkills(text = "") {
  if (!text) return [];
  const lower = text.toLowerCase();
  const found = SKILL_DICTIONARY.filter((skill) => lower.includes(skill));
  // de-duplicate things like "node" vs "node.js" by preferring the longer match
  const deduped = found.filter(
    (skill) => !found.some((other) => other !== skill && other.includes(skill) && other.length > skill.length)
  );
  return [...new Set(deduped)].map((s) =>
    s.replace(/\b\w/g, (c) => c.toUpperCase()) // Title Case for display
  );
}

module.exports = { extractSkills, SKILL_DICTIONARY };
