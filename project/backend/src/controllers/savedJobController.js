const SavedJob = require("../models/SavedJob");
const Job = require("../models/Job");

async function getSavedJobs(req, res) {
  try {
    const saved = await SavedJob.find({ candidate: req.user._id }).populate("job");
    const jobs = saved.filter((s) => s.job).map((s) => s.job.toSafeObject());
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch saved jobs.", error: err.message });
  }
}

async function toggleSaveJob(req, res) {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found." });

    const existing = await SavedJob.findOne({ candidate: req.user._id, job: jobId });
    if (existing) {
      await existing.deleteOne();
      return res.json({ saved: false });
    }

    await SavedJob.create({ candidate: req.user._id, job: jobId });
    res.json({ saved: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to update saved job.", error: err.message });
  }
}

module.exports = { getSavedJobs, toggleSaveJob };
