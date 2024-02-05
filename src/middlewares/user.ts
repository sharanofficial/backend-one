import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../helpers/token';
import httpStatus from '../helpers/httpStatus';

const checkValidUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(httpStatus.Unauthorized).json({ msg: 'Unauthorized' });
    }
    const authSplit = authHeader.split(' ');
    if (authSplit.length != 2) {
      return res.status(httpStatus.Unauthorized).send({
        msg: 'unauthorised: user id is in invalid format',
      });
    }
    const token = authSplit[1];
    verifyToken(token);
    next();
  } catch (error) {
    next(error);
  }
};

export { checkValidUser };
