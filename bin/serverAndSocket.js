const app = require("../app");
const http = require("http");
const server = http.createServer(app);

const socketIO = require("socket.io");
const io = socketIO(server);
global.io = io;

io.of("/client").on(
  "connection",
  require("../controllers/socketControllers/clientSocket")
);
io.of("/vendor").on(
  "connection",
  require("../controllers/socketControllers/vendorSocket")
);

module.exports.server = server;
