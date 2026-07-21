const express = require("express")
const router=express.Router();
const {authotel}=require("../middleware/auth.middleware")
const {allfetch,fetchMenu}=require("../controllers/customer.controllers");
const customerAuth = require("../middleware/customerAuth.middleware");

router.get('/start/:id',allfetch)
router.get('/menu',customerAuth,fetchMenu)





module.exports=router;