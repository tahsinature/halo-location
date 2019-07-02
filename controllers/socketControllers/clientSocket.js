const { Client } = require("../../models");
const { Vendor } = require("../../models");

module.exports = socket => {
  Client.create({ socketId: socket.id }).then(client => {
    Vendor.findAll({ order: [["created_at", "DESC"]], raw: true }).then(
      vendors => {
        socket.emit("CLIENT_CREATED", {
          clientId: client.id,
          vendorIds: vendors.length > 0 ? vendors.map(ele => ele.id) : []
        });
      }
    );
  });
  socket.on("PLACE_ORDER", async ({ vendorId, id: clientId }) => {
    const vendor = await Vendor.findByPk(vendorId);
    global.io.emit("ORDER_PLACED", {
      vendorId,
      clientId,
      customerSocketId: socket.id,
      vendorSocketId: vendor.socketId
    });
  });
  socket.on(
    "SEND_CLIENT_LOCATION_TO_VENDOR",
    ({ customerSocketId, vendorSocketId, coords }) => {
      const vendorIO = global.io.of("vendor");
      vendorIO.to(vendorSocketId).emit("test", coords);
      global.io.emit("LOAD_CUSTOMER_LOCATION", { customerSocketId, coords });
    }
  );
  socket.on("disconnect", async () => {
    const client = await Client.findOne({ where: { socketId: socket.id } });
    client.destroy().then(() => {
      global.io.emit("CLIENT_DISCONNECTED", client.id);
    });
  });
};
