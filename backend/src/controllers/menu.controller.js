const Menu=require("../models/menu.model")
const catagoryModel = require("../models/catagory.model");
const fs = require("fs");
const path = require("path");

async function addmenu(req, res) {

    if (!req.hotel) {
        return res.status(401).json({
            success: false,
            message: "Login First"
        });
    }

    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "Give correct info"
        });
    }

    try {

        const {
            dishName,
            categoryId,
            description,
            foodType,
            isAvailable,
        } = req.body;

        // Convert variants back to array
        const parsedVariants = JSON.parse(req.body.variants);

        const menuData = {
            _id:req.dishId,
            hotelId: req.hotel._id,

            dishName,

            categoryId,

            description,

            foodType,

            variants: parsedVariants,

            isAvailable: isAvailable === "true",


            // Store uploaded image name
            //

            // OR store full relative path
             image: req.file ? `/uploads/hotel_${req.hotel._id}/dishes/${req.file.filename}` : null

        };

        const dish = await Menu.create(menuData);

        res.status(201).json({
            success: true,
            message: "New dish added successfully",
            dish
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error adding new dish",
            error: error.message
        });

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

async function addCat(req,res) {
    console.log(req.hotel);
    if(! req.hotel){
        return res.status(400).json({
            message:"Login first "
        })
    }
    console.log(req.body);
    const {mainCategory,Catname}=req.body;
    if(! {mainCategory,Catname}){
        return res.status(400).json({
            message:"No api call"
        })
    }
    try {
  //............................
         await catagoryModel.create({
                        mainCategory:mainCategory,
                        Catname: Catname,
                        isDefault: false,
                        hotelId: req.hotel._id.toString(),
                    });

            res.status(201).json({
                message:"successfully Added the catagory",
                success:true

            })

        
    } catch (error) {

        res.status(500).json({
            message:"Something Error occur during adding the catagory",
            error:error.message,
            success:false
        })
        
    }

    
}

async function fethAllmenu(req,res) {
    if (!req.hotel) {
        return res.status(401).json({
            success: false,
            message: "Login First"
        });
    }
    
    try {
       const dishes = await Menu
    .find({ hotelId: req.hotel._id })
    .populate("categoryId");
    res.status(201).json({
        message:"All dishes fetched",
        success:true,
        dishes
    })
    } catch (error) {
        res.status(500).json({
            message:"error in fetching or finding database",
            success:false,
            error:error.message
        })
    }
    
}



async function deleteDish(req, res) {
    if (!req.hotel) {
        return res.status(401).json({
            success: false,
            message: "Login First"
        });
    }

    const id = req.params.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Make correct request"
        });
    }

    try {

        // Find the dish
        const dish = await Menu.findOne({
            _id: id,
            hotelId: req.hotel._id
        });

        if (!dish) {
            return res.status(404).json({
                success: false,
                message: "Dish not found"
            });
        }

        // Delete image from uploads folder
        if (dish.image) {
            const imagePath = path.join(__dirname, "../../", dish.image);

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Delete dish from MongoDB
        await Menu.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Successfully deleted dish"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message,
            message: "Dish not deleted, something went wrong!"
        });

    }
}

async function updateDish(req, res) {

    if (!req.hotel) {
        return res.status(401).json({
            success: false,
            message: "Login First"
        });
    }

    const { id } = req.params;

    try {

        // Find the dish belonging to this hotel
        const dish = await Menu.findOne({
            _id: id,
            hotelId: req.hotel._id
        });

        if (!dish) {
            return res.status(404).json({
                success: false,
                message: "Dish not found"
            });
        }

        const {
            dishName,
            categoryId,
            description,
            foodType,
            isAvailable,
        } = req.body;

        const parsedVariants = JSON.parse(req.body.variants);

        // If a new image is uploaded
        if (req.file) {

            // Delete old image if it exists
            if (dish.image) {

                const imagePath = path.join(
                    __dirname,
                    "../../",
                    dish.image.replace(/^[/\\]/, "")
                );

                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            // Save new image path
            dish.image = `/uploads/hotel_${req.hotel._id}/dishes/${req.file.filename}`;
        }

        // Update remaining fields
        dish.dishName = dishName;
        dish.categoryId = categoryId;
        dish.description = description;
        dish.foodType = foodType;
        dish.isAvailable = isAvailable === "true";
        dish.variants = parsedVariants;

        await dish.save();

        return res.status(200).json({
            success: true,
            message: "Dish updated successfully",
            dish
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Error updating dish",
            error: error.message
        });

    }
}

async function updateAvailable(req,res) {
      if (!req.hotel) {
        return res.status(401).json({
            success: false,
            message: "Login First"
        });
    }

    const id = req.params.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Make correct request"
        });
    }

       const { isAvailable } = req.body;


       try {

        const dish = await Menu.findOneAndUpdate(
            {
                _id: id,
                hotelId: req.hotel._id
            },
            {
                isAvailable
            },
            {
                    returnDocument: "after"
            }
        );

        if (!dish) {
            return res.status(404).json({
                success: false,
                message: "Dish not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Availability updated successfully",
            dish
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });

    }
    
}

module.exports={
    addmenu,
    showcat,
    addCat,
    fethAllmenu,
    deleteDish,
    updateDish,
    updateAvailable
}