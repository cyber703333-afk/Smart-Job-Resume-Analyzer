const express = require("express");
const { chat } = require("../controllers/chatbotController");
const { optionalAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/", optionalAuth, chat);

module.exports = router;
