const express = require("express");
const {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect, allowRoles } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/", protect, allowRoles("candidate"), upload.single("resume"), applyToJob);
router.get("/mine", protect, allowRoles("candidate"), getMyApplications);
router.get("/job/:jobId", protect, allowRoles("recruiter"), getApplicantsForJob);
router.patch("/:id", protect, allowRoles("recruiter"), updateApplicationStatus);

module.exports = router;
