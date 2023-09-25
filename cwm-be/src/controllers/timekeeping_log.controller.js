const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { getList } = require("../utils/query.util");
const cloudinary = require("../utils/cloudinary.util");

exports.create = async (req, res) => {
  try {
    await db.sequelize.transaction(async (t) => {
      const { date, carpenters } = req?.body;
      const timekeepingLogInDb = await db.Timekeeping_Log.findOne({
        where: {
          date: date,
        },
        transaction: t,
      });
      if (timekeepingLogInDb) {
        return errorHandler(res, err.TIMEKEEPING_LOG_DUPLICATED);
      } else {
        const timekeepingLog = await db.Timekeeping_Log.create({
          date,
          transaction: t,
        });
        let total_timekeeping = 0;
        for (const carpenter of carpenters) {
          const carpenterInDb = await db.Carpenter.findOne({
            where: { id: carpenter.id },
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
                carpenter_id: carpenter.id,
                work_number: carpenter.work_number,
                timekeeping_log_id: timekeepingLog.id, // Liên kết carpenter_timekeeping_log với timekeeping_log
              },
              { transaction: t }
            );
            total_timekeeping += Number(carpenter.work_number);
          }
        }
        await db.Timekeeping_Log.update(
          {
            total_carpenter: carpenters.length,
            total_timekeeping: total_timekeeping,
          },
          { where: { id: timekeepingLog.id }, transaction: t }
        );

        return successHandler(res, {}, 201);
      }
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

exports.detail = async (req, res) => {
  try {
    const { id } = req?.query;
    const timekeepingLog = await db.Timekeeping_Log.findOne({
      where: { id },
      include: [
        {
          model: db.Carpenter_Timekeeping_Log,
          attributes: ["id", "work_number", "carpenter_id"],
          include: [{ model: db.Carpenter, attributes: ["id", "name"] }],
        },
      ],
      raw: false,
    });
    return successHandler(res, { timekeepingLog }, 200);
  } catch (error) {
    return errorHandler(res, error);
  }
};
exports.update = async (req, res) => {
  try {
    const { date, carpenters_update, carpenters_add, carpenters_remove } =
      req?.body;
    let isHas;
    await db.sequelize.transaction(async (t) => {
      isHas = await db.Timekeeping_Log.findOne({
        where: { date: date },
      });
      if (!isHas) return errorHandler(res, err.TIMEKEEPING_LOG_NOT_FOUND);

      for (const carpenter of carpenters_update) {
        await db.Carpenter_Timekeeping_Log.update(
          {
            work_number: carpenter.work_number,
          },
          { where: { carpenter_id: carpenter.id } },
          { transaction: t }
        );
      }
      for (const carpenter of carpenters_add) {
        await db.Carpenter_Timekeeping_Log.create(
          {
            carpenter_id: carpenter.id,
            work_number: carpenter.work_number,
            timekeeping_log_id: isHas.id,
          },
          { transaction: t }
        );
      }
      for (const carpenter of carpenters_remove) {
        await db.Carpenter_Timekeeping_Log.destroy(
          {
            where: {
              carpenter_id: carpenter.id,
            },
          },
          { transaction: t }
        );
      }
    });
    const new_carpenters = await db.Carpenter_Timekeeping_Log.findAll({
      where: { timekeeping_log_id: isHas.id },
    });
    let new_total_timekeeping = 0;
    for (const carpenter of new_carpenters) {
      new_total_timekeeping += carpenter.work_number;
    }
    await db.Timekeeping_Log.update(
      {
        total_carpenter: new_carpenters.length,
        total_timekeeping: new_total_timekeeping,
      },
      { where: { id: isHas.id } }
    );

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
    let { limit, page, name, year, month, sortByDate } = req?.query;
    let filter = {};
    let include = [];

    let startDate, endDate, orderSort;

    if (year && !month) {
      startDate = new Date(year, 0);
      endDate = new Date(year, 12);
      filter = { date: { [Op.between]: [startDate, endDate] } };
    }
    console.log(startDate, endDate);

    if (year && month) {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0);
      filter = { date: { [Op.between]: [startDate, endDate] } };
    }

    if (name) {
      filter = {
        ...filter,
      };
    }

    if (sortByDate) {
      orderSort = sortByDate === "asc" ? [["date", "ASC"]] : [["date", "DESC"]];
    }
    let timekeepingLogs = await getList(
      +limit,
      page,
      filter,
      "Timekeeping_Log",
      include,
      orderSort
    );
    return successHandler(
      res,
      { timekeepingLogs, count: timekeepingLogs.length },
      200
    );
  } catch (error) {
    return errorHandler(res, error);
  }
};
