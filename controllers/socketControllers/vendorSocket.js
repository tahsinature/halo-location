const { Client } = require("../../models");
const { Vendor } = require("../../models");

module.exports = socket => {
  Vendor.create({ socketId: socket.id }).then(vendor => {
    global.io
      .emit(socket.id)
      .emit("VENDOR_CREATED", { vendorId: vendor.id, socketId: socket.id });
  });

  socket.on("SEND_LOC_TO_CLIENT", ({ customerId, coords, clientId }) => {
    console.log(coords);
    global.io.emit("LOAD_VENDOR_LOC", { customerId, coords, clientId });
  });
  socket.on("disconnect", async () => {
    const vendor = await Vendor.findOne({ where: { socketId: socket.id } });
    vendor.destroy().then(() => {
      global.io.emit("VENDOR_DISCONNECTED", vendor.id);
    });
  });
};
