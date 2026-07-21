const mongoose = require("mongoose");


const sessionSchema = new mongoose.Schema(
{
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required:true
    },

    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Table",
        required:true
    },


    orders:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Order"
        }
    ],


    bill:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Bill",
        default:null
    },


    status:{
        type:String,
        enum:[
            "ACTIVE",
            "COMPLETED",
            "CANCELLED"
        ],
        default:"ACTIVE"
    },


    startedAt:{
        type:Date,
        default:Date.now
    },


    endedAt:{
        type:Date,
        default:null
    }

},
{
    timestamps:true
});


module.exports = mongoose.model(
    "Session",
    sessionSchema
);