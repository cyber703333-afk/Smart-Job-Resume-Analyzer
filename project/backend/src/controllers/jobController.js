const Job = require("../models/Job");
const Application = require("../models/Application");
const { extractSkills } = require("../utils/skillExtractor");

async function getAllJobs(req, res) {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs.map((j) => j.toSafeObject()));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs.", error: err.message });
  }
}

async function getJobById(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found." });
    res.json(job.toSafeObject());
  } catch (err) {
    res.status(404).json({ message: "Job not found." });
  }
}

async function createJob(req, res) {
  try {
    const { title, location, type, salary, description, requirements } = req.body;
    if (!title || !location || !description) {
      return res.status(400).json({ message: "Title, location and description are required." });
    }

    const requirementsList = Array.isArray(requirements)
      ? requirements
      : String(requirements || "")
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean);

    // AI/NLP step: auto-detect skills mentioned in the description + requirements,
    // so recruiters get structured skill tags even if they only wrote free text.
    const extractedSkills = extractSkills([description, ...requirementsList].join(" "));

    const job = await Job.create({
      title,
      location,
      type,
      salary,
      description,
      requirements: requirementsList,
      extractedSkills,
      recruiter: req.user._id,
      company: req.user.company || req.user.name,
    });

    res.status(201).json(job.toSafeObject());
  } catch (err) {
    res.status(500).json({ message: "Failed to create job.", error: err.message });
  }
}

async function getMyJobs(req, res) {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });

    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Application.countDocuments({ job: job._id });
        return { ...job.toSafeObject(), applicantCount };
      })
    );

    res.json(jobsWithCounts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your jobs.", error: err.message });
  }
}

async function getMyJobStats(req, res) {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });

    const perJob = await Promise.all(
      jobs.map(async (job) => {
        const applications = await Application.find({ job: job._id });
        const funnel = { Applied: 0, "Under Review": 0, Shortlisted: 0, Selected: 0, Rejected: 0 };
        applications.forEach((a) => {
          funnel[a.status] = (funnel[a.status] || 0) + 1;
        });
        const avgMatch =
          applications.filter((a) => a.matchScore != null).length > 0
            ? Math.round(
                applications.filter((a) => a.matchScore != null).reduce((sum, a) => sum + a.matchScore, 0) /
                  applications.filter((a) => a.matchScore != null).length
              )
            : null;
        return {
          jobId: job._id,
          title: job.title,
          totalApplications: applications.length,
          funnel,
          avgMatchScore: avgMatch,
        };
      })
    );

    const totals = perJob.reduce(
      (acc, j) => {
        acc.totalApplications += j.totalApplications;
        Object.keys(j.funnel).forEach((k) => (acc.funnel[k] = (acc.funnel[k] || 0) + j.funnel[k]));
        return acc;
      },
      { totalApplications: 0, funnel: { Applied: 0, "Under Review": 0, Shortlisted: 0, Selected: 0, Rejected: 0 } }
    );

    res.json({ totalJobs: jobs.length, totals, perJob });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats.", error: err.message });
  }
}

module.exports = { getAllJobs, getJobById, createJob, getMyJobs, getMyJobStats };
