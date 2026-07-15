const express= require("express")
const router=express.Router()
const Menu=require("../models/menu.model")
const {authotel}=require("../middleware/auth.middleware");
const { addmenu,showcat,addCat } = require("../controllers/menu.controller");

router.post('/addmenu',authotel,addmenu);
router.get('/fetch_cat',authotel,showcat);
router.post('/addCat',authotel,addCat);








module.exports=router;