const jwt = require("jsonwebtoken");
const Session = require("../models/session.model");


const customerAuth = async (req, res, next) => {

    try {

        // Get token from cookie
        const token = req.cookies.customerSession;


        if (!token) {
            return res.status(401).json({
                success:false,
                message:"Customer session not found"
            });
        }



        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );



        // Find session
        const session = await Session.findById(
            decoded.sessionId
        )
       



        if (!session) {

            res.clearCookie("customerSession");

            return res.status(401).json({
                success:false,
                message:"Session expired"
            });
        }



        // Check session status

        if(session.status !== "ACTIVE"){

            res.clearCookie("customerSession");

            return res.status(401).json({
                success:false,
                message:"Session is closed"
            });

        }



        // Attach session data

        req.session = session;
        req.hotel = session.hotelId;
        req.table = session.tableId;


        next();



    } catch(err){

        console.log(err);


        res.clearCookie("customerSession");


        return res.status(401).json({
            success:false,
            message:"Invalid customer session"
        });

    }

};


module.exports = customerAuth;