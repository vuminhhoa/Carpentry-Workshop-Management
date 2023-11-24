const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { getList } = require("../utils/query.util");

exports.create = async (req, res) => {
  try {
    const { data, products, supplies } = req.body;
    let order;
    await db.sequelize.transaction(async (t) => {
      order = await db.Order.create(
        { ...data, status_id: 1 },
        {
          transaction: t,
        }
      );

      for (const product of products) {
        await db.Product.create(
          {
            ...product,
            order_id: order.id,
          },
          { transaction: t }
        );
      }

      for (const supply of supplies) {
        const isHas = await db.Supply.findOne({
          where: { id: supply.supply_id },
        });
        if (!isHas) {
          return errorHandler(res, err.SUPPLY_NOT_FOUND);
        }
        await db.Supply_Order.create(
          {
            ...supply,
            order_id: order.id,
          },
          { transaction: t }
        );
      }
    });

    return successHandler(res, {}, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.detail = async (req, res) => {
  try {
    let { id } = req?.query;
    const order = await db.Order.findOne({
      where: { id },
      include: [
        {
          model: db.Supply_Order,
          attributes: ["id", "quantity"],
          include: [
            {
              model: db.Supply,
            },
          ],
        },
        {
          model: db.Product,
        },
      ],
      raw: false,
    });
    if (!order) return errorHandler(res, err.ORDER_NOT_FOUND);
    return successHandler(res, { order }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.update = async (req, res) => {
  try {
    const { data, products, supplies } = req.body;
    await db.sequelize.transaction(async (t) => {
      const isHas = await db.Order.findOne({
        where: { id: data?.id },
      });
      if (!isHas) return errorHandler(res, err.ORDER_NOT_FOUND);
      await db.Order.update(data, {
        where: { id: data?.id },
        transaction: t,
      });
      await db.Supply_Order.destroy({
        where: { order_id: data?.id },
      });
      for (const supply of supplies) {
        await db.Supply_Order.create(
          {
            ...supply,
            order_id: isHas.id,
          },
          { transaction: t }
        );
      }
      await db.Product.destroy({
        where: { order_id: data?.id },
      });
      for (const product of products) {
        await db.Product.create( 
          {
            ...product,
            order_id: isHas.id,
          },
          { transaction: t }
        );
      }
    });

    return successHandler(res, {}, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.delete = async (req, res) => {
  try {
    const isHas = await db.Order.findOne({
      where: { id: req.body.id },
    });
    if (!isHas) return errorHandler(res, err.ORDER_NOT_FOUND);
    await db.Supply_Order.destroy({
      where: { order_id: req.body.id },
    });
    await db.Product.destroy({
      where: { order_id: req.body.id },
    });
    await db.Order.destroy({
      where: { id: req.body.id },
    });
    return successHandler(res, {}, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.search = async (req, res) => {
  try {
    let { limit, page, name, status_id, warehouse_id } = req?.query;

    let filter = {
      status_id,
      warehouse_id,
    };

    if (name) {
      filter = {
        ...filter,
        [Op.or]: [{ code: { [Op.like]: `%${name}%` } }],
      };
    }
    let include = [
      {
        model: db.Order_Status,
        attributes: ["id", "name"],
      },
    ];
    let orders = await getList(+limit, page, filter, "Order", include);
    return successHandler(res, { orders, count: orders.length }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};
