const Order = require("../models/orders.model");
const calculateOrderStatus = require("../utils/orderStatus");



async function fetchActiveTables(req,res){
   const hotel=req.hotel;
   console.log(hotel)
   if(!hotel){
    return res.status(400).json({
        message:"Hotel not found"
    })
   }    
   try {
    const orders = await Order.find({
  hotelId: hotel._id,
  "items.status": "Preparing",
})
  .populate("tableId")
  .populate({
    path: "items.menuId",
    select: "dishName image foodType",
  })
  .sort({ createdAt: 1 });
console.log(orders)

    res.status(200).json({
        success: true,
        orders
    });
    
   } catch (error) {
    res.status(500).json({
        success: false,
        message: "Error fetching active tables"
    });     
   }
}


// Update order item status


async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const hotel = req.hotel;
    console.log("from frontend", orderId, status, hotel);

    if (!hotel) {
      return res.status(400).json({
        success: false,
        message: "Hotel not found"
      });
    }

    const validStatus = [
      "Preparing",
      "Ready",
      "Served",
      "Cancelled",
    ];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Status",
      });
    }

    const order = await Order.findById({ _id: orderId, hotelId: hotel._id });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;

    // Optional:
    // If the entire order is marked Ready/Served/Cancelled,
    // update every non-cancelled item too.
    order.items.forEach((item) => {
      if (item.status !== "Cancelled") {
        item.status = status;
      }
    });

    // If you want to rely on your utility:
    order.orderStatus = calculateOrderStatus(order.items);

    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate("tableId")
      .populate("items.menuId");

    req.io
      ?.to(`hotel_${order.hotelId}`)
      .emit("orderUpdated", updatedOrder);

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};




module.exports={
    fetchActiveTables,
    updateOrderStatus,
};