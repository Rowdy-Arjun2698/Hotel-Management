const { Server } = require("socket.io");

let io;

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("Connected:", socket.id);

        socket.on("joinHotel", (hotelId) => {
            socket.join(`hotel_${hotelId}`);
            console.log(`${socket.id} joined hotel_${hotelId}`);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected:", socket.id);
        });
    });
}

function getIO() {
    if (!io) {
        throw new Error("Socket.IO has not been initialized.");
    }
    return io;
}

module.exports = {
    initSocket,
    getIO,
};