const Application = require("../models/Application");
const Job = require("../models/Job");
const Notification = require("../models/Notification");
const { STATUS_VALUES } = require("../models/Application");
const { extractResumeText } = require("../utils/resumeParser");
const { computeMatchScore } = require("../utils/matchScore");
const { sendStatusEmail, sendApplicationConfirmation } = require("../utils/mailer");

async function applyToJob(req, res) {
  try {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ message: "jobId is required." });
    if (!req.file) return res.status(400).json({ message: "Resume file is required." });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found." });

    const existing = await Application.findOne({ job: jobId, candidate: req.user._id });
    if (existing) {
      return res.status(409).json({ message: "You've already applied to this job." });
    }

    // AI step: read the resume text and score it against this job's skills.
    const resumeText = await extractResumeText(req.file.path);
    const { score, matchedSkills, missingSkills } = computeMatchScore(resumeText, job);

    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      resumeOriginalName: req.file.originalname,
      resumePath: req.file.path,
      matchScore: score,
      matchedSkills,
      missingSkills,
    });

    await sendApplicationConfirmation({ candidateId: req.user._id, jobTitle: job.title });

    res.status(201).json(application.toSafeObject());
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You've already applied to this job." });
    }
    res.status(500).json({ message: "Failed to submit application.", error: err.message });
  }
}

async function getMyApplications(req, res) {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate("job")
      .sort({ createdAt: -1 });

    const result = applications
      .filter((a) => a.job) // guard against deleted jobs
      .map((a) => ({
        ...a.toSafeObject(),
        job: a.job.toSafeObject(),
      }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications.", error: err.message });
  }
}

async function getApplicantsForJob(req, res) {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found." });
    if (String(job.recruiter) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only view applicants for your own jobs." });
    }

    // sort best-matching candidates first (nulls last), so the AI score is actually useful
    const applications = await Application.find({ job: job._id })
      .populate("candidate", "name email")
      .sort({ matchScore: -1, createdAt: -1 });

    const result = applications.map((a) => ({
      ...a.toSafeObject(),
      candidate: {
        id: a.candidate._id,
        name: a.candidate.name,
        email: a.candidate.email,
      },
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applicants.", error: err.message });
  }
}

async function updateApplicationStatus(req, res) {
  try {
    const { status } = req.body;
    if (!STATUS_VALUES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${STATUS_VALUES.join(", ")}` });
    }

    const application = await Application.findById(req.params.id).populate("job");
    if (!application) return res.status(404).json({ message: "Application not found." });
    if (String(application.job.recruiter) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only update applicants for your own jobs." });
    }

    application.status = status;
    await application.save();

    await Notification.create({
      candidate: application.candidate,
      message: `Your application for "${application.job.title}" is now ${status}.`,
    });

    // Best-effort email — never fails the request if SMTP isn't configured.
    await sendStatusEmail({
      candidateId: application.candidate,
      jobTitle: application.job.title,
      status,
    });

    res.json(application.toSafeObject());
  } catch (err) {
    res.status(500).json({ message: "Failed to update status.", error: err.message });
  }
}

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
};
