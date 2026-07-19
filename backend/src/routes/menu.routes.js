const express= require("express")
const router=express.Router()
const Menu=require("../models/menu.model")
const {authotel}=require("../middleware/auth.middleware");
const { addmenu,showcat,addCat,fethAllmenu,deleteDish,updateDish,updateAvailable } = require("../controllers/menu.controller");
const upload = require("../middleware/multer");

router.post('/addmenu',authotel,upload.single("image"),addmenu);
router.get('/fetch_cat',authotel,showcat);
router.post('/addCat',authotel,addCat);
router.get('/fetch_dishes',authotel,fethAllmenu);
router.delete('/delete_dish/:id', authotel, deleteDish);
router.put('/update_dish/:id', authotel, upload.single("image"),updateDish);
router.patch('/isAvailable/:id',authotel,updateAvailable)





module.exports=router;