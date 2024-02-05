import { DataTypes, ModelDefined } from 'sequelize';
import sequelize from '../connection';
import { UserAttributes, UserCreationAttributes } from '../../types/user';

const User: ModelDefined<UserAttributes, UserCreationAttributes> =
  sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      otpExpiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'otp_expiry_date',
      },
      accessToken: {
        type: DataTypes.STRING(1024),
        allowNull: true,
        field: 'access_token',
      },
      refreshToken: {
        type: DataTypes.STRING(1024),
        allowNull: true,
        field: 'refresh_token',
      },
      loginType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'login_type',
      },
    },
    {
      tableName: 'users',
    },
  );

// This creates table
// User.sync();

export default User;
