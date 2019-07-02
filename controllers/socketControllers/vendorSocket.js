const { Client } = require("../../models");
const { Vendor } = require("../../models");

module.exports = socket => {
  Vendor.create({ socketId: socket.id }).then(vendor => {
    global.io
      .emit(socket.id)
      .emit("VENDOR_CREATED", { vendorId: vendor.id, socketId: socket.id });
  });

  socket.on("SEND_LOC_TO_CLIENT", ({ customerId, coords, clientId }) => {
    const customerSocket = global.io.of("client");
    customerSocket.to(customerId).emit("LOAD_VENDOR_LOC", { coords });
  });
  socket.on("disconnect", async () => {
    const vendor = await Vendor.findOne({ where: { socketId: socket.id } });
    vendor.destroy().then(() => {
      global.io.emit("VENDOR_DISCONNECTED", {
        vendorId: vendor.id,
        vendorSocketId: socket.id
      });
    });
  });
};
