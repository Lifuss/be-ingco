import User from '../../models/User';
import { IUser } from '../../types/express';
import ctrlWrapper from '../../utils/ctrlWrapper';
import { Request, Response } from 'express';
import requestError from '../../utils/requestError';

const createUser = ctrlWrapper(async (req: Request, res: Response) => {
  const user = req.body as IUser;

  const checkUser = await User.findOne({
    $or: [{ email: user.email }, { login: user.login }],
  });
  if (checkUser) {
    throw requestError(409, 'User already exists');
  }

  const newUser = await User.create(user);
  res.status(201).json(newUser);
});

export default createUser;
