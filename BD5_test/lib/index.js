let sq = require("sequelize");

let sequelize = new sq.Sequelize({
  dialect: "sqlite",
  storage: "./BD5_test/database.sqlite",
});

module.exports = { DataTypes: sq.DataTypes, sequelize };
