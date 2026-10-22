const express = require("express");
const { getAllJobs, getJobById, createJob, getMyJobs, getMyJobStats } = require("../controllers/jobController");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/", getAllJobs);
router.get("/mine", protect, allowRoles("recruiter"), getMyJobs);
router.get("/stats/mine", protect, allowRoles("recruiter"), getMyJobStats);
router.get("/:id", getJobById);
router.post("/", protect, allowRoles("recruiter"), createJob);

module.exports = router;
