const Interest = require("../models/Interest");
const Listing = require("../models/Listing");
const { sendEmail } = require("../services/emailService");

// ===============================
// Tenant sends interest request
// ===============================
const sendInterest = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId)
      .populate("owner", "name email");

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    // Prevent owner from sending interest to own listing
    if (listing.owner._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot send interest to your own listing.",
      });
    }

    // Check duplicate request
    const alreadySent = await Interest.findOne({
      tenant: req.user._id,
      listing: listing._id,
    });

    if (alreadySent) {
      return res.status(400).json({
        message: "Interest request already sent.",
      });
    }

    const interest = await Interest.create({
      tenant: req.user._id,
      listing: listing._id,
      owner: listing.owner._id,
      status: "Pending",
    });
    await sendEmail(
  listing.owner.email,
  "🏠 New Interest in Your Listing",
  `
    <h2>Hello ${listing.owner.name},</h2>

    <p><strong>${req.user.name}</strong> is interested in your listing.</p>

    <p>
      <b>Listing:</b> ${listing.title}<br>
      <b>City:</b> ${listing.city}<br>
      <b>Rent:</b> ₹${listing.rent}
    </p>

    <p>Please login to review the request.</p>
  `
);

    const populatedInterest = await Interest.findById(interest._id)
      .populate("tenant", "name email phone")
      .populate("owner", "name email")
      .populate("listing", "title city rent");

    res.status(201).json({
      success: true,
      message: "Interest request sent successfully.",
      interest: populatedInterest,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// Owner views received requests
// ===============================
const getOwnerInterests = async (req, res) => {
  try {
    const interests = await Interest.find({
      owner: req.user._id,
    })
      .populate("tenant", "name email phone")
      .populate("listing", "title city rent")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interests.length,
      interests,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// Owner accepts/rejects request
// ===============================
const updateInterestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Accepted or Rejected.",
      });
    }

    const interest = await Interest.findById(req.params.id);

    if (!interest) {
      return res.status(404).json({
        message: "Interest request not found.",
      });
    }

    if (interest.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized.",
      });
    }

    interest.status = status;
    await interest.save();

    const updatedInterest = await Interest.findById(interest._id)
      .populate("tenant", "name email phone")
      .populate("listing", "title city rent");
      await sendEmail(
  updatedInterest.tenant.email,
  `Your Interest Request has been ${status}`,
  `
    <h2>Hello ${updatedInterest.tenant.name},</h2>

    <p>Your interest request has been <b>${status}</b>.</p>

    <p>
      <b>Listing:</b> ${updatedInterest.listing.title}<br>
      <b>City:</b> ${updatedInterest.listing.city}<br>
      <b>Rent:</b> ₹${updatedInterest.listing.rent}
    </p>

    <p>Thank you for using Rent & Flatmate Finder.</p>
  `
);
      await sendEmail(
  updatedInterest.tenant.email,
  `Your Interest Request has been ${status}`,
  `
    <h2>Hello ${updatedInterest.tenant.name},</h2>

    <p>Your request for the following listing has been <b>${status}</b>.</p>

    <p>
      <b>Listing:</b> ${updatedInterest.listing.title}<br>
      <b>City:</b> ${updatedInterest.listing.city}<br>
      <b>Rent:</b> ₹${updatedInterest.listing.rent}
    </p>

    <p>Thank you for using Rent & Flatmate Finder.</p>
  `
);

    res.status(200).json({
      success: true,
      message: `Interest ${status.toLowerCase()} successfully.`,
      interest: updatedInterest,
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
  sendInterest,
  getOwnerInterests,
  updateInterestStatus,
};