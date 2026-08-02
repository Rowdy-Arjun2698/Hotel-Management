const express=require("express");
const router=express.Router();
const {authotel}=require("../middleware/auth.middleware");
const {getProfile,updateProfile}=require("../controllers/profile.controller");

router.get('/fetch_profile',authotel,getProfile);
router.put('/update_profile',authotel,updateProfile);










module.exports=router;