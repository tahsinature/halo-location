const vendorList = document.getElementById("vendor-list");
const map = document.getElementById("map");
const socket = io("/");
const clientSocket = io("/client");
let id;
let connectedVendors = [];

clientSocket.on("CLIENT_CREATED", ({ vendorIds, clientId }) => {
  id = clientId;
  document.getElementById("client-id").textContent = clientId;
  connectedVendors = vendorIds;
  renderVendors();
});

function order(vendorId) {
  clientSocket.emit("PLACE_ORDER", { vendorId, id });
}
socket.on("VENDOR_CREATED", ({ vendorId }) => {
  connectedVendors.unshift(vendorId);
  renderVendors();
});
socket.on("ORDER_PLACED", ({ vendorId, customerSocketId, vendorSocketId }) => {
  const splittedSocketid = customerSocketId.split("#", 2)[1];
  if (splittedSocketid === socket.id) {
    document.getElementById("vendor-id").textContent = vendorId;
    document.getElementById("map").style.display = "block";
    document.getElementById("vendor-holder").style.display = "none";
    navigator.geolocation.watchPosition(s => {
      clientSocket.emit("updateLoc", {
        customerSocketId,
        vendorSocketId,
        coords: {
          longitude: s.coords.longitude,
          latitude: s.coords.latitude
        }
      });
      document.getElementById("my-lat").textContent = s.coords.latitude;
      document.getElementById("my-lon").textContent = s.coords.longitude;
    });
  }

  connectedVendors.find((ele, index) => {
    if (ele === vendorId) connectedVendors.splice(index, 1);
  });
  renderVendors();
});
socket.on("VENDOR_DISCONNECTED", id => {
  connectedVendors.find((ele, index) => {
    if (ele === id) connectedVendors.splice(index, 1);
  });
  renderVendors();
});
socket.on("LOAD_VENDOR_LOC", ({ customerId, coords, clientId }) => {
  if (clientId === id) {
    document.getElementById("ven-lat").textContent = coords.latitude;
    document.getElementById("ven-lon").textContent = coords.longitude;
  }
});

function renderVendors() {
  let str = `<ul>`;
  connectedVendors.forEach(id => {
    str += `<li onClick="order(${id})">${id}</li>`;
  });
  str += `</ul>`;
  vendorList.innerHTML = str;
}
