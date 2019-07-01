const dbs = require("../util/database");
const { Sequelize } = require("sequelize");
const { SequelizeHelper } = require("sequelize-utility");
const dbHelper = new SequelizeHelper(dbs, Sequelize);

const { Vendor } = require("./vendor");
const { Client } = require("./client");

// dbHelper.syncAllForce();

module.exports = { Vendor, Client, dbHelper };
