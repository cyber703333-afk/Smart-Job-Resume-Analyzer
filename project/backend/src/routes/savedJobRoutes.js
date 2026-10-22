const express = require("express");
const { getSavedJobs, toggleSaveJob } = require("../controllers/savedJobController");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, allowRoles("candidate"), getSavedJobs);
router.post("/:jobId", protect, allowRoles("candidate"), toggleSaveJob);

module.exports = router;
