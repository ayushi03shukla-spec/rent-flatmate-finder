const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },

    explanation: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate match records for the same tenant and listing
matchSchema.index({ tenant: 1, listing: 1 }, { unique: true });

module.exports = mongoose.model("Match", matchSchema);