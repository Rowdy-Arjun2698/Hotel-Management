const express= require("express")
const router=express.Router()
const {authotel}=require("../middleware/auth.middleware");
const { fetchActiveTables } = require("../controllers/hotel.orders.controller");

router.get('/active_tables',authotel,fetchActiveTables);







module.exports=router;