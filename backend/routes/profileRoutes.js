const express = require("express");
const router = express.Router();

const {
  createOrUpdateProfile,
  getMyProfile,
} = require("../controllers/profileController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// Get logged-in tenant profile
router.get(
  "/",
  protect,
  authorize("tenant"),
  getMyProfile
);

// Create or Update tenant profile
router.post(
  "/",
  protect,
  authorize("tenant"),
  createOrUpdateProfile
);

module.exports = router;