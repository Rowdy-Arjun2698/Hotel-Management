const express= require("express")
const router=express.Router()
const Menu=require("../models/menu.model")
const {authotel}=require("../middleware/auth.middleware")

router.post('/addmenu',authotel,addmenu);








module.exports=router;