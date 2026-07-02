const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");

const { protect } = require("../middleware/authMiddleware");

// Send a message
router.post("/", protect, sendMessage);

// Get conversation
router.get("/:userId/:listingId", protect, getMessages);

module.exports = router;