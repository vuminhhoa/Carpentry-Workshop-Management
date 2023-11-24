"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    return queryInterface.bulkInsert("order_statuses", [
      {
        name: "Mới tạo",
        alias: "created",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Đang chuẩn bị",
        alias: "preparing",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Đã hoàn thành",
        alias: "completed",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
