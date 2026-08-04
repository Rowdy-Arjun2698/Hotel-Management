const express = require("express")
const router=express.Router();
const {authotel}=require("../middleware/auth.middleware")
const {allfetch,fetchMenu,fetchOrder,confirmOrder}=require("../controllers/customer.controllers");
const customerAuth = require("../middleware/customerAuth.middleware");

router.get('/start/:id',allfetch)
router.get('/menu',customerAuth,fetchMenu)
router.get('/orders',customerAuth,fetchOrder)
router.post("/order/confirm", (req, res, next) => {
    console.log("Reached confirm route");
    next();
}, customerAuth, confirmOrder);





module.exports=router;