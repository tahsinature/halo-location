var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.sendFile("index", { root: __dirname });
});
router.get("/client", function(req, res, next) {
  res.sendFile("client.html", {
    root: require("path").join(__dirname, "..", "public")
  });
});
router.get("/vendor", function(req, res, next) {
  res.sendFile("vendor.html", {
    root: require("path").join(__dirname, "..", "public")
  });
});

module.exports = router;
