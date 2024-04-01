import jwt from 'jsonwebtoken';
import requestError from '../utils/requestError';
import User from '../models/user';
import { NextFunction, Response } from 'express';
import { CustomRequest, IUser } from '../types/express';

const authentication = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { authorization = '' } = req.headers;

    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw requestError(401);
    }

    const secretKey: string = process.env.JWT_SECRET || 'default_secret';

    const { id } = jwt.verify(token, secretKey) as { id: string };

    const user = await User.findById(id);

    if (user && user.token && user.token === token) {
      req.user = user.toObject() as IUser;
    } else {
      throw requestError(401);
    }

    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (!error.status) {
      error.status = 401;
      error.message = 'Unauthorized';
    }
    next(error);
  }
};

export default authentication;
