const hotel= require("../models/hotel_info.model")
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken")
const createHotelFolders=require("../utils/createfolder")

async function registerhotel(req,res){

    const {hotelName,
    owenerName,
    email,
    password,
    phone,
    address,
    city,
     pincode,
     gstnumber,
    fssaiNumber,
     logo,
    tables,
    openingtime,
    closetime,
    gstenable,
    gstper}  =req.body;

    const isHotelAlreadyexists= await hotel.findOne({
        email
    })

    if(isHotelAlreadyexists){
        return res.status(400).json({
            message:"User already exists"
        })
    }

    const hashPassword = await bcrypt.hash(password,10);
    const hot=await hotel.create({
        hotelName,
    owenerName,
    email,
    password: hashPassword,
    phone,
    address,
    city,
     pincode,
     gstnumber,
    fssaiNumber,
     logo,
    tables,
    openingtime,
    closetime,
    gstenable,
    gstper
    })

    createHotelFolders(hot._id);

    const token=jwt.sign({
        id:hot._id,
    },process.env.JWT_SECRET)

        console.log

    res.cookie("token",token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    }  )

    res.status(201).json({
        message:"Hotel registed successfully",
        hotel:{
            _id:hot._id,
            email:hot.email,
            owenerName:hot.owenerName
        }
    })
}

async function hotellogin(req,res) {



    const {email,password}=req.body

        const user=await hotel.findOne({email})
        if(!user){
            res.status(401).json({
                message:"Invalid Email or Password"
            })
        }


        const isPasswordValid= await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
             res.status(401).json({
                message:"Invalid Email or Password"
            })

        }

          const token=jwt.sign({
        id:user._id,
    }, process.env.JWT_SECRET)

        
    res.cookie("token",token,
        {
        httpOnly: true,
  secure: false,      // localhost
  sameSite: "lax",
        }
    )

    res.status(201).json({
        message:"Hotel login succesfully",
        hotel:{
            _id:user._id,
            email:user.email,
            owenerName:user.owenerName
        }
    })
}

async function hotellogout(req,res) {
    res.clearCookie("token");
    res.status(200).json({
        message:"User logout successfully"
    })
    
}

module.exports={
    registerhotel,
    hotellogin,
    hotellogout

}
