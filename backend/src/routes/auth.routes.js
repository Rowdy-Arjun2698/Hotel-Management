const express = require("express")
const {registerhotel,hotellogin,hotellogout}=require("../controllers/auth.controllers")
const router=express.Router();
const {authotel}=require("../middleware/auth.middleware")

router.post('/register',registerhotel)
router.post('/login',hotellogin)
router.get('/logout',authotel,hotellogout)



module.exports=router;