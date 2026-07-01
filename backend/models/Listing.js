const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    rent: {
      type: Number,
      required: true,
    },

    deposit: {
      type: Number,
      default: 0,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
    },

    roomType: {
      type: String,
      enum: ["Single", "Double", "Shared"],
      required: true,
    },

    genderPreference: {
      type: String,
      enum: ["Male", "Female", "Any"],
      default: "Any",
    },

    occupancy: {
      type: Number,
      required: true,
    },

    amenities: [
      {
        type: String,
      },
    ],

    available: {
      type: Boolean,
      default: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Listing", listingSchema);