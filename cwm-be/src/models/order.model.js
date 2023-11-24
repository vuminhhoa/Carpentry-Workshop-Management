"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Order_Status, { foreignKey: "status_id" });
      Order.hasMany(models.Product, { foreignKey: "order_id" });
      Order.hasMany(models.Supply_Order, { foreignKey: "order_id" });
    }
  }
  Order.init(
    {
      customer: DataTypes.STRING,
      order_date: DataTypes.DATE,
      address: DataTypes.STRING,
      phone: DataTypes.STRING,
      advance_payment: DataTypes.INTEGER,
      advance_payment_date: DataTypes.DATE,
      full_payment_date: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
