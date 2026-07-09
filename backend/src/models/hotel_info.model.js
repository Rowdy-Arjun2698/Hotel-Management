const mongoose = require("mongoose")

const hotelSchema=new mongoose.Schema({
    hotelName:{
        type: String,
        required:true
    },
    owenerName:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
     pincode:{
        type:String,
        required:true
    },
     gstnumber:{
        type:String,
    },
    fssaiNumber:{
        type:String
    },
     logo:{
        type:String,
        
    },
    tables:{
        type:Number
    },
    openingtime:{
        type:String
    },
    closetime:{
        type:String
    },
    gstenable: {
        type: Boolean
    },
    gstper:{
        type:Number
    }
},{
    timestamps: true
});

const hotel=mongoose.model("hotel",hotelSchema);

module.exports=hotel;
