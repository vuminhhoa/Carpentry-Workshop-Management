"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wood extends Model {
    static associate(models) {
    }
  }
  Wood.init(
    {
      name: DataTypes.STRING,
      quantity: DataTypes.INTEGER, // số lượng
      origin: DataTypes.STRING, // nước sản xuất
      unit: DataTypes.STRING, // đơn vị tính nhập chữ
      unit_price: DataTypes.INTEGER, // đơn vị tính nhập chữ
      amount: DataTypes.INTEGER, // đơn vị tính nhập chữ
    },
    {
      sequelize,
      modelName: "Wood",
    }
  );
  return Wood;
};
