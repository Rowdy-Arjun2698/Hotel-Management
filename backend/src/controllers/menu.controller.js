const Menu=require("../models/menu.model")
const catagoryModel = require("../models/catagory.model");

async function addmenu(req,res) {
     if(!req.hotel){
        return res.status(400).json({
            message:"Login First"
        })
     }

     if(!req.body){
        return res.status(400).json({
            message:"Give correct info"
        })
     }

   // creating the object for the dish collection 
   const {
  dishName,
  category,
  description,
  image,
  foodType,
  variants,
  isAvailable,
  todayLimit,
  todaySold,
  totalSold,
  preparationTime,
} = req.body;

const menuData = {
  hotelId: req.hotel._id.toString(), // From JWT
  dishName,
  category,
  description,
  foodType,
  variants,
  isAvailable,
  todaySold,
  totalSold,
};

try {
    const dish=await Menu.create(menuData)
    res.status(201).json({
        success:true,
        message:"Add new dish"
    })
    
} catch (error) {
    res.status(500).json({
        success:false,
        message: "error adding new dish",
        error:error
    })
    
}
 
    
}

async function showcat(req,res) {
    console.log(req.hotel);
    if(! req.hotel){
        return res.status(400).json({
            message:"Login first "
        })
    }

    try {
       const categories = await catagoryModel.find({
  hotelId: req.hotel._id.toString()
}); 
  res.status(200).json({
    categories,
    message:"Succefully fetched the catagory !!",
    success:true
  })
    } catch (error) {
         res.status(500).json({
    message:"something wrong",
    error:error.message,
    success:false
  })
    }
    
}

module.exports={
    addmenu,
    showcat
}