const TenantProfile = require("../models/TenantProfile");

// ==========================
// Create or Update Profile
// ==========================
const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      preferredLocation,
      minBudget,
      maxBudget,
      moveInDate,
      occupation,
      foodPreference,
      smoking,
      drinking,
    } = req.body;

    let profile = await TenantProfile.findOne({
      tenant: req.user._id,
    });

    if (profile) {
      profile.preferredLocation = preferredLocation;
      profile.minBudget = minBudget;
      profile.maxBudget = maxBudget;
      profile.moveInDate = moveInDate;
      profile.occupation = occupation;
      profile.foodPreference = foodPreference;
      profile.smoking = smoking;
      profile.drinking = drinking;

      await profile.save();

      return res.status(200).json({
        success: true,
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
      occupation,
      foodPreference,
      smoking,
      drinking,
    });

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================
// Get Logged-in Tenant Profile
// ==========================
const getMyProfile = async (req, res) => {
  try {
    const profile = await TenantProfile.findOne({
      tenant: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createOrUpdateProfile,
  getMyProfile,
};