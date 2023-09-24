"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Equipment extends Model {
    static associate(models) {
      Equipment.belongsTo(models.Equipment_Status, { foreignKey: "status_id" });
    }
  }
  Equipment.init(
    {
      name: DataTypes.STRING,
      code: DataTypes.STRING,
      quantity: DataTypes.INTEGER, // số lượng
      manufacturing_country: DataTypes.STRING, // nước sản xuất
      unit: DataTypes.STRING, // đơn vị tính nhập chữ
      unit_price: DataTypes.INTEGER, // đơn vị tính nhập chữ
      amount: DataTypes.INTEGER, // đơn vị tính nhập chữ
    },
    {
      sequelize,
      modelName: "Equipment",
    }
  );
  return Equipment;
};
