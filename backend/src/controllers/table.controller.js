const Table = require("../models/tables.model");
const Qrcode = require("qrcode");
const path = require("path");
const fs = require("fs");



async function addtables(req,res){
    const hotelId=req.hotel._id.toString();
    console.log(req.hotel._id)
    console.log(req.body)
    if(!hotelId){
        return res.status(400).json({
            message:"Hotel id not found"
        })
    }
    const{tableNumber,
        capacity,
        location,
        type}=req.body;

        if(!tableNumber || !capacity || !location || !type){
            return res.status(400).json({
                message:"All fields are required"
            })
        }
try {

        const table=await Table.create({
            tableNumber,
            capacity,
            location,
            type,
            hotelId
        });

        const tableid=table._id;
        const url=`http://localhost:5173/customer/${tableid}`;

       const qrFolder = path.join(
    __dirname,
    "../../uploads",
    `hotel_${hotelId}`,
    "qr"
);
console.log(url)
if (!fs.existsSync(qrFolder)) {
    fs.mkdirSync(qrFolder, { recursive: true });
}
   const qrpath = path.join(
    qrFolder,
    `table_${tableid}.png`
);
        await Qrcode.toFile(qrpath,url);

        table.qr = `uploads/hotel_${hotelId}/qr/table_${table._id}.png`;;
       await table.save();
        res.status(201).json({
            message: "Table added successfully",
            table: table
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding table",
            error
        });
    }   
}

async function gettables(req,res) {
    const user=req.hotel._id
if(!user){
    return res.status(400).json({
        message:"No user found"
    })
}
    const data=await Table.find({
        hotelId:user
})
    
    console.log(data)
try {
    res.status(201).json({
        success:true,
        message: "Fetched successfully",
        count: data.length,
        data
    })
} catch (error) {
    res.status(500).json({
        success:false,
        message:"Error fethcing "
    })
    
}

}

module.exports={
    addtables,
    gettables
}