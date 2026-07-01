const Listing = require("../models/Listing");


// Create Listing
const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      rent,
      deposit,
      city,
      address,
      roomType,
      genderPreference,
      occupancy,
      amenities,
    } = req.body;

    const listing = await Listing.create({
      title,
      description,
      rent,
      deposit,
      city,
      address,
      roomType,
      genderPreference,
      occupancy,
      amenities,
      owner: req.user._id,
    });

    res.status(201).json({
      message: "Listing created successfully",
      listing,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
// Get All Listings
const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: listings.length,
      listings,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
// Get Single Listing
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("owner", "name email phone");

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    res.status(200).json(listing);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
// Update Listing
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    // Check Ownership
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only update your own listings.",
      });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Listing updated successfully",
      listing: updatedListing,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
// Delete Listing
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    // Check ownership
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only delete your own listings.",
      });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Listing deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Search Listings
const searchListings = async (req, res) => {
  try {
   const {
  city,
  roomType,
  genderPreference,
  minRent,
  maxRent,
  page = 1,
  limit = 10,
  sort = "-createdAt",
} = req.query;
    let filter = {};

    if (city) {
      filter.city = new RegExp(city, "i");
    }

    if (roomType) {
      filter.roomType = roomType;
    }

    if (genderPreference) {
      filter.genderPreference = genderPreference;
    }

    if (minRent || maxRent) {
      filter.rent = {};

      if (minRent) {
        filter.rent.$gte = Number(minRent);
      }

      if (maxRent) {
        filter.rent.$lte = Number(maxRent);
      }
    }

   const totalListings = await Listing.countDocuments(filter);

const listings = await Listing.find(filter)
  .populate("owner", "name email phone")
  .sort(sort)
  .skip((Number(page) - 1) * Number(limit))
  .limit(Number(limit));

res.status(200).json({
  totalListings,
  currentPage: Number(page),
  totalPages: Math.ceil(totalListings / Number(limit)),
  count: listings.length,
  listings,
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  searchListings,
};