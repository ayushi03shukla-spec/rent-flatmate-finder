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

    occupation: {
      type: String,
      default: "",
    },

    foodPreference: {
      type: String,
      enum: ["Veg", "Non-Veg", "Both"],
      default: "Both",
    },

    smoking: {
      type: Boolean,
      default: false,
    },

    drinking: {
      type: Boolean,
      default: false,
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