const mongoose=require("mongoose");

const tableSchema=new mongoose.Schema({
    tableNumber:{
        type:Number,
        required:true
    },
    capacity:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    type:{
        enume:["AC","Non-AC","Outdoor"],
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
    hotelId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"hotel",
        required:true
    },
    qr:{
        type:String,
        required:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});
module.exports=mongoose.model("Table", tableSchema);