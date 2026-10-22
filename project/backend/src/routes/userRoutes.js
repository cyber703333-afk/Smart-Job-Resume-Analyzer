const express = require("express");
const { updateProfile } = require("../controllers/userController");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();

router.patch("/profile", protect, allowRoles("candidate"), updateProfile);

module.exports = router;
