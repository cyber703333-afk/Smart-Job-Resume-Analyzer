const express = require("express");
const { getMyNotifications, markAllRead } = require("../controllers/notificationController");
const { protect, allowRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, allowRoles("candidate"), getMyNotifications);
router.patch("/read", protect, allowRoles("candidate"), markAllRead);

module.exports = router;
