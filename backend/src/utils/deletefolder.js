const fs = require("fs");
const path = require("path");

function deleteHotelFolders(hotelId) {
    const hotelFolder = path.join(
        __dirname,
        "../../uploads",
        `hotel_${hotelId}`
    );

    if (fs.existsSync(hotelFolder)) {
        fs.rmSync(hotelFolder, {
            recursive: true,
            force: true,
        });
        console.log("Hotel folder deleted successfully.");
    } else {
        console.log("Hotel folder does not exist.");
    }
}

module.exports = deleteHotelFolders;