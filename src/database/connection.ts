import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('backendone', 'sharan-1', 'postgres', {
  host: 'localhost',
  dialect:
    'postgres' /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
});

export const dbSetup = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default sequelize;
