const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { getList } = require("../utils/query.util");
const cloudinary = require("../utils/cloudinary.util");

exports.create = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      const { data, carpenters } = req?.body;
      const timekeepingLogInDb = await db.Timekeeping_Log.findOne({
        where: {
          date: data.date,
        },
        transaction: t,
      });
      if (timekeepingLogInDb) {
        return errorHandler(res, err.TIMEKEEPING_LOG_DUPLICATED);
      } else {
        const timekeepingLog = await db.Timekeeping_Log.create({
          ...data,
          transaction: t,
        });
        for (const carpenter of carpenters) {
          const carpenterInDb = await db.Carpenter.findOne({
            where: { id: carpenter.carpenter_id },
          });
          if (!carpenterInDb) {
            await db.Carpenter_Timekeeping_Log.destroy({
              where: { timekeeping_log_id: timekeepingLog.id },
              transaction: t,
            });
            await db.Timekeeping_Log.destroy({
              where: { id: timekeepingLog.id },
              transaction: t,
            });
            return errorHandler(res, err.CARPENTER_NOT_FOUND, carpenter.id);
          } else {
            await db.Carpenter_Timekeeping_Log.create(
              {
                ...carpenter,
                timekeeping_log_id: timekeepingLog.id, // Liên kết carpenter_timekeeping_log với timekeeping_log
              },
              { transaction: t }
            );
          }
        }

        return successHandler(res, {}, 201);
      }
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.detail = async (req, res) => {
  try {
    const { date } = req?.query;
    const timekeeping_log = await db.Timekeeping_Log.findOne({
      where: { date },
      include: [
        {
          model: db.Carpenter_Timekeeping_Log,
          attributes: ["id", "work_number", "carpenter_id", "note"],
          include: [{ model: db.Carpenter, attributes: ["id", "name"] }],
        },
      ],
      raw: false,
    });
    return successHandler(res, { timekeeping_log }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};
exports.update = async (req, res) => {
  try {
    const { data, carpenters } = req?.body;
    let isHas;
    await db.sequelize.transaction(async (t) => {
      isHas = await db.Timekeeping_Log.findOne({
        where: { date: data.date },
      });
      if (!isHas) return errorHandler(res, err.TIMEKEEPING_LOG_NOT_FOUND);
      await db.Timekeeping_Log.update(data, {
        where: { date: data?.date },
      });

      await db.Carpenter_Timekeeping_Log.destroy(
        {
          where: {
            timekeeping_log_id: isHas.id,
          },
        },
        { transaction: t }
      );
      for (const carpenter of carpenters) {
        await db.Carpenter_Timekeeping_Log.create({
          ...carpenter,
          timekeeping_log_id: isHas.id,
        });
      }
    });

    return successHandler(res, {}, 201);
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.delete = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      let isHas = await db.Timekeeping_Log.findOne({
        where: { id: req?.body?.id },
      });
      if (!isHas) return errorHandler(res, err.TIMEKEEPING_LOG_NOT_FOUND);
      await db.Carpenter_Timekeeping_Log.destroy({
        where: { timekeeping_log_id: isHas.id },
        transaction: t,
      });
      await db.Timekeeping_Log.destroy({
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
    let timekeeping_logs = await db.Timekeeping_Log.findAll({
      include: [
        {
          model: db.Carpenter_Timekeeping_Log,
          attributes: ["carpenter_id", "work_number", "note"],
          include: [{ model: db.Carpenter, attributes: ["id", "name"] }],
        },
      ],
      attributes: ["id", "date", "note"],
      raw: false,
    });
    return successHandler(res, { timekeeping_logs }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};
