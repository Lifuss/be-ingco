import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../../models/User';
import requestError from '../../../utils/requestError';
import ctrlWrapper from '../../../utils/ctrlWrapper';

const signin = ctrlWrapper(async (req: Request, res: Response) => {
  const { login, password } = req.body;

  const user = await User.findOne({ login });
  if (!user) {
    throw requestError(404, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw requestError(401, 'Invalid password');
  }

  user.token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });

  await user.save();

  await user.populate('cart.productId');
  await user.populate('favorites');

  const responseUser = {
    ...user.toObject(),
    password: undefined,
  };
  res.json(responseUser);
});

export default signin;
