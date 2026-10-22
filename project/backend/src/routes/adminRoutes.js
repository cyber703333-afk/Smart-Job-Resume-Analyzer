const express = require("express");
const { getStats, getAllUsers } = require("../controllers/adminController");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/stats", protect, allowRoles("admin"), getStats);
router.get("/users", protect, allowRoles("admin"), getAllUsers);

module.exports = router;
