const express= require("express")
const router=express.Router()
const Menu=require("../models/menu.model")
const {authotel}=require("../middleware/auth.middleware");
const { addmenu,showcat } = require("../controllers/menu.controller");

router.post('/addmenu',authotel,addmenu);
router.get('/fetch_cat',authotel,showcat);








module.exports=router;