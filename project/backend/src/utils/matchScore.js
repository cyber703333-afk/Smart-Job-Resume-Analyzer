const { extractSkills } = require("./skillExtractor");

// Computes how well a resume matches a job, as a percentage.
// Technique: extract known skills from both the resume text and the job's
// requirements/description, then score = (overlapping skills / job's total
// skills) * 100. This is a simple, explainable keyword-overlap matching
// algorithm — a common lightweight approach to resume-job matching.
function computeMatchScore(resumeText, job) {
  const jobText = [job.description || "", ...(job.requirements || [])].join(" ");
  const jobSkills = new Set(extractSkills(jobText).map((s) => s.toLowerCase()));
  const resumeSkills = new Set(extractSkills(resumeText).map((s) => s.toLowerCase()));

  if (jobSkills.size === 0) {
    return { score: null, matchedSkills: [], missingSkills: [] };
  }

  const matched = [...jobSkills].filter((s) => resumeSkills.has(s));
  const missing = [...jobSkills].filter((s) => !resumeSkills.has(s));
  const score = Math.round((matched.length / jobSkills.size) * 100);

  return {
    score,
    matchedSkills: matched.map((s) => s.replace(/\b\w/g, (c) => c.toUpperCase())),
    missingSkills: missing.map((s) => s.replace(/\b\w/g, (c) => c.toUpperCase())),
  };
}

module.exports = { computeMatchScore };
