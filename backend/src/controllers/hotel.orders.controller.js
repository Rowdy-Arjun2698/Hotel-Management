const Order = require("../models/orders.model");

// An order counts as "active" (still has work to do) if ANY item is
// still Preparing or Ready. No stored orderStatus field needed —
// this is derived live from the items array.
async function fetchActiveTables(req, res) {
  const hotel = req.hotel;

  if (!hotel) {
    return res.status(400).json({
      message: "Hotel not found",
    });
  }

  try {
    const orders = await Order.find({
      hotelId: hotel._id,
      items: {
        $elemMatch: { status: { $in: ["Preparing", "Ready"] } },
      },
    })
      .populate("tableId")
      .populate({
        path: "items.menuId",
        select: "dishName image foodType",
      })
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching active tables",
    });
  }
}

// Cancel the whole order — every item becomes Cancelled, no exceptions,
// no per-item condition. One action, applies to all items.
async function cancelOrder(req, res) {
  try {
    const { orderId } = req.params;
    const hotel = req.hotel;

    if (!hotel) {
      return res.status(400).json({
        success: false,
        message: "Hotel not found",
      });
    }

    const order = await Order.findOne({ _id: orderId, hotelId: hotel._id });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.items.forEach((item) => {
      item.status = "Cancelled";
    });

    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate("tableId")
      .populate("items.menuId");

    req.io?.to(`hotel_${order.hotelId}`).emit("orderUpdated", updatedOrder);

    return res.status(200).json({
      success: true,
      message: "Order cancelled",
      order: updatedOrder,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// Update a single item's status. That's it — no order-level field to
// keep in sync, because order status is just derived from this array
// whenever the frontend reads it.
async function updateItemStatus(req, res) {
  try {
    const { orderId, itemIndex } = req.params;
    const { status } = req.body;
    const hotel = req.hotel;

    if (!hotel) {
      return res.status(400).json({
        success: false,
        message: "Hotel not found",
      });
    }

    const validStatus = ["Preparing", "Ready", "Served", "Cancelled"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Status",
      });
    }

    const order = await Order.findOne({ _id: orderId, hotelId: hotel._id });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const idx = Number(itemIndex);

    if (Number.isNaN(idx) || !order.items[idx]) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    order.items[idx].status = status;

    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate("tableId")
      .populate("items.menuId");

    req.io?.to(`hotel_${order.hotelId}`).emit("orderUpdated", updatedOrder);

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  fetchActiveTables,
  updateItemStatus,
  cancelOrder,
};