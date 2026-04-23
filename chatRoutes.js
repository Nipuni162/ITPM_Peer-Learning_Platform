const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getMessagesBySession, sendMessage } = require("../controllers/chatController");

router.get("/messages/:sessionId", authMiddleware, getMessagesBySession);
router.post("/send", authMiddleware, sendMessage);

module.exports = router;