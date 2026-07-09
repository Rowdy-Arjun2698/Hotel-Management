const fs = require("fs");
const path = require("path");

function createHotelFolders(hotelId) {
    const hotelFolder = path.join(
        __dirname,
        "../../uploads",
        `hotel_${hotelId}`
    );

    const folders = ["logo", "dishes", "qr", "temp","accounts"];

    folders.forEach((folder) => {
        fs.mkdirSync(path.join(hotelFolder, folder), {
            recursive: true,
        });
    });
}

module.exports = createHotelFolders;