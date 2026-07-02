const express = require("express");
const router = express.Router();

const {
  createOrUpdateProfile,
} = require("../controllers/profileController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// Only tenants can create/update their profile
router.post(
  "/",
  protect,
  authorize("tenant"),
  createOrUpdateProfile
);

module.exports = router;