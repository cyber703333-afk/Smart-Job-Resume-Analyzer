const Interview = require("../models/Interview");
const Application = require("../models/Application");
const Notification = require("../models/Notification");

// Recruiter proposes 2-4 interview time slots for a shortlisted/selected applicant.
async function proposeInterview(req, res) {
  try {
    const { applicationId, slots, notes } = req.body;
    if (!applicationId || !Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ message: "applicationId and at least one slot are required." });
    }

    const application = await Application.findById(applicationId).populate("job");
    if (!application) return res.status(404).json({ message: "Application not found." });
    if (String(application.job.recruiter) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only schedule interviews for your own job's applicants." });
    }

    const interview = await Interview.create({
      application: applicationId,
      job: application.job._id,
      recruiter: req.user._id,
      candidate: application.candidate,
      proposedSlots: slots.map((s) => new Date(s)),
      notes: notes || "",
    });

    await Notification.create({
      candidate: application.candidate,
      message: `You've been invited to an interview for "${application.job.title}". Pick a time that works for you.`,
    });

    res.status(201).json(interview.toSafeObject());
  } catch (err) {
    res.status(500).json({ message: "Failed to propose interview.", error: err.message });
  }
}

// Candidate confirms one of the proposed slots.
async function confirmInterview(req, res) {
  try {
    const { slot } = req.body;
    if (!slot) return res.status(400).json({ message: "slot is required." });

    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: "Interview not found." });
    if (String(interview.candidate) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only confirm your own interview." });
    }

    const chosen = interview.proposedSlots.find(
      (s) => new Date(s).toISOString() === new Date(slot).toISOString()
    );
    if (!chosen) return res.status(400).json({ message: "That slot wasn't offered for this interview." });

    interview.confirmedSlot = chosen;
    interview.status = "Confirmed";
    await interview.save();

    res.json(interview.toSafeObject());
  } catch (err) {
    res.status(500).json({ message: "Failed to confirm interview.", error: err.message });
  }
}

async function getMyInterviewsAsCandidate(req, res) {
  try {
    const interviews = await Interview.find({ candidate: req.user._id })
      .populate("job", "title company")
      .sort({ createdAt: -1 });
    res.json(
      interviews.map((i) => ({
        ...i.toSafeObject(),
        job: i.job ? { id: i.job._id, title: i.job.title, company: i.job.company } : null,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch interviews.", error: err.message });
  }
}

async function getMyInterviewsAsRecruiter(req, res) {
  try {
    const interviews = await Interview.find({ recruiter: req.user._id })
      .populate("job", "title")
      .populate("candidate", "name email")
      .sort({ createdAt: -1 });
    res.json(interviews.map((i) => i.toSafeObject()).map((obj, idx) => ({
      ...obj,
      jobTitle: interviews[idx].job?.title,
      candidateName: interviews[idx].candidate?.name,
      candidateEmail: interviews[idx].candidate?.email,
    })));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch interviews.", error: err.message });
  }
}

module.exports = {
  proposeInterview,
  confirmInterview,
  getMyInterviewsAsCandidate,
  getMyInterviewsAsRecruiter,
};
