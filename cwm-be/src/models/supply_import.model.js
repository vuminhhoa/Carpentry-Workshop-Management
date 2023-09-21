"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supply_Import extends Model {
    static associate(models) {
      Supply_Import.belongsTo(models.Supply, {
        foreignKey: "supply_id",
      });
      Supply_Import.belongsTo(models.Import, {
        foreignKey: "import_id",
      });
    }
  }
  Supply_Import.init(
    {
      quantity: DataTypes.INTEGER, // theo yeu cau
      actual_quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Supply_Import",
    }
  );
  return Supply_Import;
};
