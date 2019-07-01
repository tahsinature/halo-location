const { Model, DataTypes } = require("sequelize");
const { db1 } = require("../util/database");

class Vendor extends Model {}

Vendor.init(
  {
    socketId: {
      type: DataTypes.STRING
    }
  },
  {
    sequelize: db1,
    tableName: "vendor",
    modelName: "Vendor",
    underscored: true
  }
);

module.exports.Vendor = Vendor;
