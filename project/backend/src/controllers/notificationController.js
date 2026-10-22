const Notification = require("../models/Notification");

async function getMyNotifications(req, res) {
  try {
    const notifications = await Notification.find({ candidate: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications.map((n) => n.toSafeObject()));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications.", error: err.message });
  }
}

async function markAllRead(req, res) {
  try {
    await Notification.updateMany({ candidate: req.user._id, read: false }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to update notifications.", error: err.message });
  }
}

module.exports = { getMyNotifications, markAllRead };
