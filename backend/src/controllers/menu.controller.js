const Menu=require("../models/menu.model")


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

module.exports={
    addmenu
}