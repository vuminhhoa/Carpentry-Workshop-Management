"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supply_Export extends Model {
    static associate(models) {
      Supply_Export.belongsTo(models.Supply, {
        foreignKey: "supply_id",
      });
      Supply_Export.belongsTo(models.Export, {
        foreignKey: "export_id",
      });
    }
  }
  Supply_Export.init(
    {
      quantity: DataTypes.INTEGER, // theo chung tu
      actual_quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Supply_Export",
    }
  );
  return Supply_Export;
};
