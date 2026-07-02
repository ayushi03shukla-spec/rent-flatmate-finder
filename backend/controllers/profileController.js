const TenantProfile = require("../models/TenantProfile");

// Create or Update Tenant Profile
const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      preferredLocation,
      minBudget,
      maxBudget,
      moveInDate,
    } = req.body;

    let profile = await TenantProfile.findOne({
      tenant: req.user._id,
    });

    if (profile) {
      profile.preferredLocation = preferredLocation;
      profile.minBudget = minBudget;
      profile.maxBudget = maxBudget;
      profile.moveInDate = moveInDate;

      await profile.save();

      return res.status(200).json({
        message: "Profile updated successfully",
        profile,
      });
    }

    profile = await TenantProfile.create({
      tenant: req.user._id,
      preferredLocation,
      minBudget,
      maxBudget,
      moveInDate,
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createOrUpdateProfile,
};