const express = require("express");
const router = express.Router();

const {
  sendInterest,
  getOwnerInterests,
  getTenantInterests,
  updateInterestStatus,
} = require("../controllers/interestController");
const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

// Tenant sends interest
router.post(
  "/:listingId",
  protect,
  authorize("tenant"),
  sendInterest
);
router.get(
  "/my",
  protect,
  authorize("tenant"),
  getTenantInterests
);

// Owner views all requests
router.get(
  "/",
  protect,
  authorize("owner"),
  getOwnerInterests
);

// Owner accepts/rejects
router.patch(
  "/:id",
  protect,
  authorize("owner"),
  updateInterestStatus
);

module.exports = router;