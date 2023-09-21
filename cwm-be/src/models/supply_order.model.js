"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supply_Order extends Model {
    static associate(models) {
      Supply_Order.belongsTo(models.Supply, { foreignKey: "supply_id" });
      Supply_Order.belongsTo(models.Order, { foreignKey: "order_id" });
    }
  }
  Supply_Order.init(
    { quantity: DataTypes.INTEGER },
    {
      sequelize,
      modelName: "Supply_Order",
    }
  );
  return Supply_Order;
};
