const express = require("express");
const router = express.Router();

const {
  createListing,
  getAllListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing,
  searchListings,
} = require("../controllers/listingController");
const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");
router.get("/", getAllListings);

router.get("/search", searchListings);

router.get(
  "/my",
  protect,
  authorize("owner"),
  getMyListings
);

router.get("/:id", getListingById);

router.post(
  "/",
  protect,
  authorize("owner"),
  createListing
);
router.put(
  "/:id",
  protect,
  authorize("owner"),
  updateListing
);
router.delete(
  "/:id",
  protect,
  authorize("owner"),
  deleteListing
);

module.exports = router;