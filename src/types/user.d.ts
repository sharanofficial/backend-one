import { Optional } from 'sequelize';

interface UserAttributes {
  id: number;
  uuid: number;
  name: string;
  email: string;
  password: string;
  otp: string;
  otpExpiryDate: Date;
  accessToken: string;
  refreshToken: string;
  loginType: string;
}
type UserOptionalAttributes = 'id' | 'uuid';

type UserCreationAttributes = Optional<UserAttributes, UserOptionalAttributes>;

export { UserCreationAttributes, UserAttributes };
