const express = require("express")
const router=express.Router();
const {authotel}=require("../middleware/auth.middleware")
const {addtables,gettables}=require("../controllers/table.controller")

router.post('/addtable',authotel,addtables);

router.get('/getalltables',authotel,gettables);


module.exports=router;