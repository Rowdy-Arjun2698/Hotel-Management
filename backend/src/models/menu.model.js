const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Half, Full, Small, Large
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const menuSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hotel",
      required: true,
    },

    dishName: {
      type: String,
      required: true,
      trim: true,
    },

      categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    foodType: {
      type: String,
      enum: ["Veg", "Non-Veg", "Egg"],
      required: true,
    },

    variants: [
      variantSchema,
    ],

    isAvailable: {
      type: Boolean,
      default: true,
    },

    todayLimit: {
      type: Number,
      default: 0,
      min: 0,
    },

    todaySold: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalSold: {
      type: Number,
      default: 0,
      min: 0,
    },

    preparationTime: {
      type: Number, // Minutes
      default: 15,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Menu", menuSchema);