const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
         req.dishId = new mongoose.Types.ObjectId();
        // Comes from authHotel middleware
        const hotelId = req.hotel._id.toString();

        const uploadPath = path.join(
            process.cwd(),
            "uploads",
            `hotel_${hotelId}`,
            "dishes"
        );

        // Create the dishes folder if it doesn't exist
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {

        const extension = path.extname(file.originalname);

        cb(null, req.dishId.toString() + extension);
    }

});

module.exports = multer({ storage });