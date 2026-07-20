const Table = require("../models/tables.model");
const Qrcode = require("qrcode");
const path = require("path");
const fs = require("fs");



async function addtables(req,res){
    const hotelId=req.hotel._id.toString();
 
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

//delete table .....
async function deleteTable(req,res) {
     if (!req.hotel) {
        return res.status(401).json({
            success: false,
            message: "Login First"
        });
    }
  const id = req.params.id;
  if(!id){
    return res.status(400).json({
        success:false,
        message:"Invalid Table data !!"

    })
  }
 try {

        // Find the dish
        const table = await Table.findOne({
            _id: id,
            hotelId: req.hotel._id
        });

        if (!table) {
            return res.status(404).json({
                success: false,
                message: "Dish not found"
            });
        }

        // Delete image from uploads folder
        if (table.qr) {
            const qrpath = path.join(__dirname, "../../", table.qr);

            if (fs.existsSync(qrpath)) {
                fs.unlinkSync(qrpath);
            }
        }

        // Delete dish from MongoDB
        await Table.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Successfully deleted table"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message,
            message: "Table not deleted, something went wrong!"
        });

    }

    
}
//............update table.............................
async function updatetb(req, res) {
    if (!req.hotel) {
        return res.status(401).json({
            success: false,
            message: "Login First"
        });
    }

    const { id } = req.params;

    const {
        tableNumber,
        capacity,
        location,
        type
    } = req.body;

    if (!tableNumber || !capacity || !location || !type) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        const table = await Table.findOne({
            _id: id,
            hotelId: req.hotel._id
        });

        if (!table) {
            return res.status(404).json({
                success: false,
                message: "Table not found"
            });
        }

        table.tableNumber = tableNumber;
        table.capacity = capacity;
        table.location = location;
        table.type = type;

        await table.save();

        res.status(200).json({
            success: true,
            message: "Table updated successfully",
            table
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating table",
            error: error.message
        });
    }
}
module.exports={
    addtables,
    gettables,
    deleteTable,
    updatetb
}