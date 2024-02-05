'use strict';

const tableName = 'users';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        tableName, // table name
        'otp', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(tableName, 'otp_expiry_date', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.addColumn(tableName, 'access_token', {
        type: Sequelize.STRING(1024),
        allowNull: true,
      }),
      queryInterface.addColumn(tableName, 'refresh_token', {
        type: Sequelize.STRING(1024),
        allowNull: true,
      }),
      queryInterface.addColumn(tableName, 'login_type', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  async down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn(tableName, 'otp'),
      queryInterface.removeColumn(tableName, 'otp_expiry_date'),
      queryInterface.removeColumn(tableName, 'access_token'),
      queryInterface.removeColumn(tableName, 'refresh_token'),
      queryInterface.removeColumn(tableName, 'login_type'),
    ]);
  },
};
