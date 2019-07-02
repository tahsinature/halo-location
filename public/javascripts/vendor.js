const socket = io("/");
const vendorSocket = io("/vendor");

let id;
let customerId; // for taken order (socket id)

vendorSocket.on("connect", () => {
  // console.log();
  socket.on("VENDOR_CREATED", ({ vendorId, socketId }) => {
    id = vendorId;
    const splittedSocketid = socketId.split("#", 2)[1];
    if (splittedSocketid === socket.id) {
      document.getElementById("vendor-id").textContent = vendorId;
    }
  });
  socket.on("CLIENT_DISCONNECTED", socketId => {
    if (customerId === socketId) {
      document.getElementById("map").style.display = "none";
      document.getElementById("client-dis").style.display = "block";
    }
  });

  socket.on("ORDER_PLACED", ({ vendorId, customerSocketId, clientId }) => {
    if (vendorId === id) {
      customerId = customerSocketId;
      document.getElementById("map").style.display = "block";
      document.getElementById("client-id").textContent = clientId;

      navigator.geolocation.watchPosition(s => {
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
});

vendorSocket.on("LOAD_CUSTOMER_LOCATION", ({ coords }) => {
  document.getElementById("cus-lat").textContent = coords.latitude;
  document.getElementById("cus-lon").textContent = coords.longitude;
});

function reloadApp() {
  location.reload();
}
