const hotel=require("../models/hotel_info.model");
const jwt=require("jsonwebtoken");

async function  authotel(req,res,next){
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const hot=await hotel.findById(decoded.id);
        req.hotel=hot;
        next();
    } catch (error) {
        return res.status(401).json({
            message:"Invalid token"
        })
    }
}

module.exports={
    authotel
}