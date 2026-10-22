const express = require("express");
const {
  proposeInterview,
  confirmInterview,
  getMyInterviewsAsCandidate,
  getMyInterviewsAsRecruiter,
} = require("../controllers/interviewController");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, allowRoles("recruiter"), proposeInterview);
router.patch("/:id/confirm", protect, allowRoles("candidate"), confirmInterview);
router.get("/candidate", protect, allowRoles("candidate"), getMyInterviewsAsCandidate);
router.get("/recruiter", protect, allowRoles("recruiter"), getMyInterviewsAsRecruiter);

module.exports = router;
