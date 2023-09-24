const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { getList } = require("../utils/query.util");
const cloudinary = require("../utils/cloudinary.util");
const qr = require("qrcode");

exports.create = async (req, res) => {
  try {
    const data = req?.body;
    console.log(req.body);
    await db.sequelize.transaction(async (t) => {
      const carpenterInDb = await db.Carpenter.findOne({
        where: {
          phone: data?.phone,
        },
        attributes: ["id", "name", "phone"],
      });
      if (carpenterInDb)
        return errorHandler(res, err.EQUIPMENT_FIELD_DUPLICATED);
      let result;
      if (data?.image) {
        result = await cloudinary.uploader.upload(data?.image, {
          folder: "carpenter",
        });
      }

      await db.Carpenter.create(
        {
          ...data,
          image: result?.secure_url || null,
          status_id: 1,
        },
        { transaction: t }
      );

      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.detail = async (req, res) => {
  try {
    const { id } = req?.query;
    const carpenter = await db.Carpenter.findOne({
      where: { id },
      raw: false,
    });
    return successHandler(res, { carpenter }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};
exports.update = async (req, res) => {
  try {
    const data = req?.body;
    console.log(req.body);
    await db.sequelize.transaction(async (t) => {
      const isHas = await db.Carpenter.findOne({
        where: { id: data?.id },
      });
      if (!isHas) return errorHandler(res, err.EQUIPMENT_NOT_FOUND);

      let result;
      if (data?.image) {
        result = await cloudinary.uploader.upload(data?.image, {
          folder: "carpenter",
        });
      }
      await db.Carpenter.update(
        { ...data, image: result?.secure_url || null },
        { where: { id: data?.id }, transaction: t }
      );

      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.delete = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHas = await db.Carpenter.findOne({
        where: { id: req?.body?.id },
      });
      if (!isHas) return errorHandler(res, err.EQUIPMENT_NOT_FOUND);
      await db.Carpenter.destroy({
        where: { id: req?.body?.id },
        transaction: t,
      });
      return successHandler(res, {}, 201);
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.search = async (req, res) => {
  try {
    let { limit, page, name } = req?.query;

    let filter = {};

    if (name) {
      filter = {
        ...filter,
        [Op.or]: [{ name: { [Op.like]: `%${name}%` } }],
      };
    }
    let include = [];
    let carpenters = await getList(+limit, page, filter, "Carpenter", include);
    return successHandler(res, { carpenters, count: carpenters.length }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};
