const { Model, DataTypes } = require("sequelize");
const { db1 } = require("../util/database");

class Client extends Model {}

Client.init(
  {
    socketId: {
      type: DataTypes.STRING
    }
  },
  {
    sequelize: db1,
    tableName: "client",
    modelName: "Client",
    underscored: true
  }
);

module.exports.Client = Client;
