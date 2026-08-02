const hotel= require("../models/hotel_info.model")

async function getProfile(req,res){
    try {
        const user=req.hotel;       
    if(!user){
        return res.status(400).json({
            message:"No user found"
        })
    }
    res.status(200).json({
        success:true,
        message:"Profile fetched successfully",
       data:user
    })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error fetching profile",
            error:error.message
        })
    }
        
}

async function updateProfile(req, res) {
  try {
    const hotelId = req.hotel.id;

    const {
      hotelName,
      owenerName,
      email,
      phone,
      address,
      city,
      pincode,
      logo,
      gstenable,
      gstnumber,
      gstper,
      fssaiNumber,
      openingtime,
      closetime,
      tables,
    } = req.body;

    const updateData = {
      hotelName,
      owenerName,
      email,
      phone,
      address,
      city,
      pincode,
      logo,
      gstenable,
      gstnumber,
      fssaiNumber,
      openingtime,
      closetime,
      // convert empty string -> undefined so Mongoose doesn't try to cast "" to Number
      gstper: gstper === "" || gstper === undefined ? undefined : Number(gstper),
      tables: tables === "" || tables === undefined ? undefined : Number(tables),
    };

    const updatedHotel = await hotel.findByIdAndUpdate(
      hotelId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedHotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: updatedHotel,
    });
  } catch (err) {
    console.error("updateProfile error:", err); // <-- log this and check your terminal
    return res.status(500).json({
      success: false,
      message: err.message || "Something went wrong while updating the profile.",
    });
  }
}
  
module.exports={
    getProfile,
    updateProfile
}
