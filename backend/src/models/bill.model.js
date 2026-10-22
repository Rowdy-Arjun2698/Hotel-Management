
const mongoose = require("mongoose");

const billItemSchema = new mongoose.Schema(
  {
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
    },

    name: {
      type: String,
      required: true,
    },

    variantName: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    itemTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const billSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hotel",
      required: true,
    },

    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },

    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    items: {
      type: [billItemSchema],
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    cgstPercent: {
      type: Number,
      default: 2.5,
      min: 0,
    },

    cgst: {
      type: Number,
      required: true,
      min: 0,
    },

    sgstPercent: {
      type: Number,
      default: 2.5,
      min: 0,
    },

    sgst: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    paymentMethod: {
      type: String,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Only one bill per customer session.
billSchema.index({ sessionId: 1 }, { unique: true });

module.exports = mongoose.model("Bill", billSchema);
