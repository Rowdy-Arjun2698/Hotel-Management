const Order = require("../models/orders.model");




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
        "items.status": { $in: ["Preparing"] }
})
.populate("tableId")
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


module.exports={
    fetchActiveTables
}   