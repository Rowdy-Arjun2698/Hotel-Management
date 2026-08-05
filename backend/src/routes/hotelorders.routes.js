const express= require("express")
const router=express.Router()
const {authotel}=require("../middleware/auth.middleware");
const { fetchActiveTables,updateOrderStatus } = require("../controllers/hotel.orders.controller");

router.get('/active_tables',authotel,fetchActiveTables);
router.patch('/update_item_status/:orderId/:itemIndex',authotel,updateOrderStatus);






module.exports=router;