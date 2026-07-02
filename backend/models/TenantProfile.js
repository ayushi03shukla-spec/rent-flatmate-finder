const mongoose = require("mongoose");

const tenantProfileSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    preferredLocation: {
      type: String,
      required: true,
    },

    minBudget: {
      type: Number,
      required: true,
    },

    maxBudget: {
      type: Number,
      required: true,
    },

    moveInDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "TenantProfile",
  tenantProfileSchema
);