const err = require("../errors/index");
const db = require("../models");
const { successHandler, errorHandler } = require("../utils/ResponseHandle");
const { Op } = require("sequelize");
const { getList } = require("../utils/query.util");
const cloudinary = require("../utils/cloudinary.util");
const qr = require("qrcode");
const { checkRoleFromToken } = require("../utils/auth.util");
const { getRoleEmailConfig } = require("../utils/query.util");
const { sequelize } = require("../models");
const { sendUnuseEquipmentEmail } = require("../utils/sendEmail.util");

exports.create = async (req, res) => {
  try {
  } catch (error) {}
};

exports.detailBasic = async (req, res) => {
  try {
  } catch (error) {}
};
exports.list = async (req, res) => {
  try {
  } catch (error) {}
};

exports.detail = async (req, res) => {
  try {
  } catch (error) {}
};

exports.update = async (req, res) => {
  try {
  } catch (error) {}
};

exports.delete = async (req, res) => {
  try {
  } catch (error) {}
};

exports.search = async (req, res) => {
  try {
  } catch (error) {}
};
