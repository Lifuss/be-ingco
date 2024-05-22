import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import User from '../../models/User';
import requestError from '../../utils/requestError';
import jwt from 'jsonwebtoken';
import ctrlWrapper from '../../utils/ctrlWrapper';

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
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: '48h',
  });
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { token },
    { new: true },
  )
    .select('-password')
    .populate('cart.productId')
    .populate('favorites');

  res.json({
    login: updatedUser?.login,
    token: updatedUser?.token,
    role: updatedUser?.role,
    isVerified: updatedUser?.isVerified,
    favorites: updatedUser?.favorites,
    cart: updatedUser?.cart,
  });
});

export default signin;
