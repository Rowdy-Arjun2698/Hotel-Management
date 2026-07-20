const express = require("express")
const router=express.Router();
const {authotel}=require("../middleware/auth.middleware")
const {addtables,gettables,deleteTable,updatetb}=require("../controllers/table.controller")

router.post('/addtable',authotel,addtables);

router.get('/getalltables',authotel,gettables);
router.delete('/delete_table/:id',authotel,deleteTable)
router.put('/updatetable/:id',authotel,updatetb)

module.exports=router;