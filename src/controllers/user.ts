import User from '../database/model/user.model';
import { Request, Response } from 'express';
import * as argon2 from 'argon2';
// import jwt from 'jsonwebtoken';
import { generateToken } from '../helpers/token';
import httpStatus from '../helpers/httpStatus';
import { generateOtp } from '../helpers/otpGenerator';
import { sendEmail } from '../services/emailService';

const registerUser = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const isUserExit = await User.findOne({
      where: {
        email: email,
      },
    });
    if (isUserExit) {
      return res.status(httpStatus.Conflict).send({
        msg: 'User already exist',
      });
    }
    const otp = generateOtp();
    const hash = await argon2.hash(req.body.password);
    const loginType = req.body.loginType;
    const user = await User.create({
      ...req.body,
      password: hash,
      otp,
      otpExpiryDate: new Date(Date.now() + 10 * 60 * 1000),
      loginType: loginType || null,
    });
    const data = user.toJSON();

    const subject = 'Email verification';
    const message = `Your OTP code is: ${otp}`;
    sendEmail(email, subject, message);

    res.status(httpStatus.Created).send({
      data: data.uuid,
      msg: 'User created successfully',
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(httpStatus.InternalServerError).send('Internal Server Error'); // Handle errors appropriately
  }
};

const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'uuid', 'name', 'email'],
    });
    res.status(httpStatus.OK).send(users);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(httpStatus.InternalServerError).send('Internal Server Error');
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      where: {
        uuid: req.params.id,
      },
      attributes: ['id', 'uuid', 'name', 'email'],
    });
    if (!user) {
      return res.status(httpStatus.NotFound).send({
        msg: 'User not found',
      });
    }
    res.status(httpStatus.OK).send(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(httpStatus.InternalServerError).send('Internal Server Error');
  }
};

const updateUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    // const user = await sequelize.query(
    //   `select otp_expiry_date as otpExpiryDate from users where uuid = '${req.params.id}'`,
    // );

    if (!user) {
      return res.status(httpStatus.NotFound).send({
        msg: 'User not found',
      });
    }
    let result;
    if (req.body) {
      result = await User.update(
        {
          ...req.body,
        },
        {
          where: {
            uuid: req.params.id,
          },
          returning: true,
          // fields: ['email', 'id', 'uuid', 'name'],
        },
      );
    }
    const data = result && result[1][0].toJSON();
    res.status(httpStatus.Created).send({
      email: data?.email,
      id: data?.id,
      uuid: data?.uuid,
      name: data?.name,
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(httpStatus.InternalServerError).json('Internal Server Error');
  }
};

const deleteUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!user) {
      return res.status(httpStatus.NotFound).send({
        msg: 'User not found',
      });
    }
    await User.destroy({
      where: {
        uuid: req.params.id,
      },
    });
    res.status(httpStatus.OK).send({
      msg: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(httpStatus.InternalServerError).send('Internal Server Error');
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const isUserExit = await User.findOne({
      where: {
        email: email,
      },
      //attributes: ['password'],
    });
    if (!isUserExit) {
      return res.send({
        msg: 'User not found',
      });
    }

    const user = isUserExit.toJSON();

    const hashPassword = user.password;

    const isValidPassword = await argon2.verify(
      hashPassword,
      req.body.password,
    );

    if (isValidPassword) {
      // const token = jwt.sign(isUserExit.toJSON(), 'shhhhh');
      // const token = generateToken({
      //   email: user.email,
      //   id: user.id,
      //   userId: user.uuid,
      //   name: user.name,
      // });

      const otp = generateOtp();
      await User.update(
        {
          otp,
          otpExpiryDate: new Date(Date.now() + 10 * 60 * 1000),
        },
        {
          where: {
            email: email,
          },
          returning: true,
        },
      );
      const subject = 'Login email verification';
      const message = `Your OTP code is: ${otp}`;
      sendEmail(email, subject, message);
      return res.status(httpStatus.OK).send({
        msg: 'Otp sent successfully',
      });
    } else {
      return res.status(httpStatus.NotFound).send({
        msg: 'Incorret password',
      });
    }
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(httpStatus.InternalServerError).send('Internal Server Error'); // Handle errors appropriately
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email) {
      return res.status(httpStatus.BadRequest).send({
        message: 'Field email should not empty',
      });
    }

    const isUserExit = await User.findOne({
      where: {
        email,
        otp,
      },
    });

    if (!isUserExit) {
      return res.status(httpStatus.BadRequest).send({
        message: 'Invalid OTP',
      });
    }

    const user = isUserExit.toJSON();

    const OtpExpired = new Date() > new Date(user.otpExpiryDate);
    if (OtpExpired) {
      return res.status(httpStatus.BadRequest).send({
        message: 'OTP is expired',
      });
    }

    const token = generateToken({
      email: user.email,
      id: user.id,
      userId: user.uuid,
      name: user.name,
    });
    await User.update(
      {
        accessToken: token,
        refreshToken: token,
      },
      {
        where: {
          email,
        },
      },
    );

    const data = {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      name: user.name,
      accessToken: token,
      refreshToken: token,
    };

    res.status(httpStatus.Accepted).send({
      msg: 'Email verified successfully',
      data,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(httpStatus.InternalServerError).send('Internal Server Error');
  }
};

const resendOtp = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const user = User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(httpStatus.NotFound).send({
        msg: 'User not found',
      });
    }

    const otp = generateOtp();

    await User.update(
      {
        otp,
        otpExpiryDate: new Date(Date.now() + 10 * 60 * 1000),
      },
      {
        where: {
          email: email,
        },
        returning: true,
      },
    );
    const subject = 'OTP resend';
    const message = `Your OTP is ${otp}`;
    sendEmail(email, subject, message);
    res.status(httpStatus.OK).send({
      message: 'Otp resent successfully',
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(httpStatus.InternalServerError).send('Internal Server Error'); // Handle errors appropriately
  }
};

export {
  registerUser,
  getAllUser,
  getUserById,
  updateUserById,
  deleteUserById,
  loginUser,
  resendOtp,
  verifyEmail,
};
