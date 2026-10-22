const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

async function getStats(req, res) {
  try {
    const [totalUsers, candidates, recruiters, totalJobs, totalApplications] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "candidate" }),
      User.countDocuments({ role: "recruiter" }),
      Job.countDocuments(),
      Application.countDocuments(),
    ]);

    res.json({ totalUsers, candidates, recruiters, totalJobs, totalApplications });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats.", error: err.message });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users.map((u) => u.toSafeObject()));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users.", error: err.message });
  }
}

module.exports = { getStats, getAllUsers };
