const express = require("express");
const router = express.Router();

const {
  createMatch,
} = require("../controllers/matchController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

router.post(
  "/:listingId",
  protect,
  authorize("tenant"),
  createMatch
);

module.exports = router;