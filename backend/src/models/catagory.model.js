const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    mainCategory: {
      type: String,
      enum: ["Food", "Beverages"],
      required: true,
    },

    Catname: {
      type: String,
      required: true,
      trim: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// A hotel cannot have duplicate category names


module.exports = mongoose.model("catagoryModel", categorySchema);