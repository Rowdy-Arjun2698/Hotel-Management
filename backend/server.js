require("dotenv").config();

const http = require("http");

const app = require("./src/app");
const connectdb = require("./src/db/db");
const { initSocket } = require("./src/socket/socket");

const port = 3000;

connectdb();

const server = http.createServer(app);

initSocket(server);

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});