"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supply extends Model {
    static associate(models) {
      Supply.hasMany(models.Supply_Provider, { foreignKey: "supply_id" });
      Supply.hasMany(models.Supply_Order, { foreignKey: "supply_id" });
    }
  }
  Supply.init(
    {
      name: DataTypes.STRING, // tên
      code: DataTypes.STRING, // mã số
      unit: DataTypes.STRING, // đơn vị
      quantity: DataTypes.INTEGER, // số lượng
      unit_price: DataTypes.INTEGER, // đơn giá
      manufacturing_country: DataTypes.STRING, //nước sx
      amount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Supply",
    }
  );
  return Supply;
};
