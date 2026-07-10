const hotel= require("../models/hotel_info.model")
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken")
const createHotelFolders=require("../utils/createfolder")
const DEFAULT_CATEGORIES=require("../constant/defaultcatagory")
const deleteHotelFolders = require("../utils/deletefolder");
const catagoryModel = require("../models/catagory.model");

async function registerhotel(req, res) {
    const {
        hotelName,
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
        gstper,
    } = req.body;

    const isHotelAlreadyexists = await hotel.findOne({ email });

    if (isHotelAlreadyexists) {
        return res.status(400).json({
            message: "User already exists",
        });
    }

    let hot; // <-- Declare outside try

    try {
        const hashPassword = await bcrypt.hash(password, 10);

        hot = await hotel.create({
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
            gstper,
        });

        createHotelFolders(hot._id);

        const token = jwt.sign(
            { id: hot._id },
            process.env.JWT_SECRET
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        for (const category of DEFAULT_CATEGORIES) {
            await catagoryModel.create({
                mainCategory: category.mainCategory,
                Catname: category.Catname,
                isDefault: true,
                hotelId: hot._id,
            });
        }

        return res.status(201).json({
            message: "Hotel registered successfully",
            hotel: {
                _id: hot._id,
                email: hot.email,
                owenerName: hot.owenerName,
            },
        });

    } catch (error) {
        console.error(error);

        if (hot) {
            await catagoryModel.deleteMany({
                hotelId: hot._id,
            });

            await hotel.findByIdAndDelete(hot._id);

            await deleteHotelFolders(hot._id);
        }

        return res.status(500).json({
            success: false,
            message: "Error at the time of hotel registration",
        });
    }
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
