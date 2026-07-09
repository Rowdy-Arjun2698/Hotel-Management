const mongoose = require("mongoose")

async function connectDB(){
   try {
    await mongoose.connect(process.env.DB_URI)
    console.log("MongoDb connected ");
   } catch (error) {
    console.log("Error in connection :- ",error)
    
   }
}

module.exports=connectDB;