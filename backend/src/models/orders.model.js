const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
     
    },

    variantName: {
      type: String,
    
    },

    price: {
      type: Number,
   
    },

    quantity: {
      type: Number,
  
      min: 1,
    },

    status: {
      type: String,
      enum: ["Preparing", "Ready", "Served", "Cancelled"],
      default: "Preparing",
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
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

    items: [orderItemSchema],

    totalAmount: {
      type: Number,
     
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);