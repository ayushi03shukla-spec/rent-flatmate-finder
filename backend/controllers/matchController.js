const Match = require("../models/Match");
const Listing = require("../models/Listing");
const TenantProfile = require("../models/TenantProfile");

const {
  calculateCompatibility,
} = require("../services/compatibilityService");

const createMatch = async (req, res) => {
  try {
    // Get tenant profile
    const profile = await TenantProfile.findOne({
      tenant: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Please create your tenant profile first.",
      });
    }

    // Get listing
    const listing = await Listing.findById(req.params.listingId);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found.",
      });
    }

    // Calculate compatibility
   const result = await calculateCompatibility(profile, listing);

    // Check if match already exists
    let match = await Match.findOne({
      tenant: req.user._id,
      listing: listing._id,
    });

    if (match) {
      match.score = result.score;
      match.explanation = result.explanation;

      await match.save();

      return res.status(200).json({
        message: "Compatibility updated.",
        match,
      });
    }

    // Create new match
    match = await Match.create({
      tenant: req.user._id,
      listing: listing._id,
      score: result.score,
      explanation: result.explanation,
    });

    res.status(201).json({
      message: "Compatibility calculated successfully.",
      match,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


module.exports = {
  createMatch,
};