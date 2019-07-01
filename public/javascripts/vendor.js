const socket = io("/");
const vendorSocket = io("/vendor");

let id;
let customerId; // for taken order

vendorSocket.on("connect", () => {
  // console.log();
  socket.on("VENDOR_CREATED", ({ vendorId, socketId }) => {
    id = vendorId;
    const splittedSocketid = socketId.split("#", 2)[1];
    if (splittedSocketid === socket.id) {
      document.getElementById("vendor-id").textContent = vendorId;
    }
  });
  socket.on("CLIENT_DISCONNECTED", id => {
    // console.log(`client: ${id} has been disconnected`);
  });

  socket.on("ORDER_PLACED", ({ vendorId, customerSocketId, clientId }) => {
    if (vendorId === id) {
      customerId = customerSocketId;
      document.getElementById("map").style.display = "block";
      document.getElementById("client-id").textContent = clientId;

      navigator.geolocation.watchPosition(s => {
        console.log(s);
        vendorSocket.emit("SEND_LOC_TO_CLIENT", {
          customerId,
          clientId,
          coords: {
            longitude: s.coords.longitude,
            latitude: s.coords.latitude
          }
        });
        document.getElementById("my-lat").textContent = s.coords.latitude;
        document.getElementById("my-lon").textContent = s.coords.longitude;
      });
    }
  });
  socket.on("LOAD_CUSTOMER_LOCATION", ({ customerSocketId, coords }) => {
    if (customerId === customerSocketId) {
      document.getElementById("cus-lat").textContent = coords.latitude;
      document.getElementById("cus-lon").textContent = coords.longitude;
    }
  });
});
