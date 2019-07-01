const { Sequelize } = require("sequelize");

module.exports.db1 = new Sequelize({
  dialect: "sqlite",
  storage: require("path").join(__dirname, "..", "db.sqlite"),
  logging: false
});
