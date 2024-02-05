'use strict';

const tableName = 'users';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(tableName, {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      uuid: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      name: Sequelize.DataTypes.STRING,
      email: Sequelize.DataTypes.STRING,
      password: Sequelize.DataTypes.STRING,
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable(tableName);
  },
};
