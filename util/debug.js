const debug = require("debug");
debug.enable("server:*");

module.exports.debugApp = debug("server:app");
module.exports.debugError = debug("server:error");
