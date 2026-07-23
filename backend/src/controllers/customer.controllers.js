const jwt = require("jsonwebtoken");
const Menu=require("../models/menu.model")
const catagoryModel = require("../models/catagory.model");
const Table = require("../models/tables.model");
const Hotel = require("../models/hotel_info.model");
const Session = require("../models/session.model");


async function allfetch(req, res) {

    try {

        const { id } = req.params;


        if (!id) {
            return res.status(400).json({
                message: "Invalid table",
                success: false
            });
        }


        // Find table
        const table = await Table.findOne({_id:id});


        if (!table) {
            return res.status(404).json({
                message: "Table not found",
                success: false
            });
        }


        // Find hotel
        const hotel = await Hotel.findById(table.hotelId);


        if (!hotel) {
            return res.status(404).json({
                message: "Hotel not found",
                success: false
            });
        }



        // Check existing active session
        let session = await Session.findOne({
            tableId: table._id,
            status: "ACTIVE"
        });



        // Create new session if not available
        if (!session) {

            session = await Session.create({
                hotelId: hotel._id,
                tableId: table._id,
                status: "ACTIVE"
            });

        }



        // Create JWT
        const token = jwt.sign(
            {
                sessionId: session._id,
                tableId: table._id,
                hotelId: hotel._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );



        // Save JWT in cookie
        res.cookie(
            "customerSession",
            token,
            {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 2 * 60 * 60 * 1000
            }
        );


        return res.status(200).json({
            success: true,
            message: "Customer session created",
            hotel,
            table,
            session
        });


    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}


async function fetchMenu(req, res) {

    if (!req.hotel || !req.session || !req.table) {
        return res.status(400).json({
            message: "Scan it again",
            success: false
        });
    }

    try {

        const [dishes, cat] = await Promise.all([
            Menu.find({ hotelId: req.hotel._id }),
            catagoryModel.find({ hotelId: req.hotel._id })
        ]);

        return res.status(200).json({
            message: "Menu and categories fetched successfully",
            success: true,
            dishes,
            categories:cat
        });

    } catch (error) {

        return res.status(500).json({
            message: "Error fetching the data",
            success: false,
            error: error.message
        });

    }
}

module.exports ={
    allfetch,
    fetchMenu
}