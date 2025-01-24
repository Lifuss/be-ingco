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
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
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
    role: updatedUser?.role,
    isVerified: updatedUser?.isVerified,
    isB2B: updatedUser?.isB2B,
    token: updatedUser?.token,
    favorites: updatedUser?.favorites,
    cart: updatedUser?.cart,
    cartRetail: updatedUser?.cartRetail,
    firstName: updatedUser?.firstName,
    lastName: updatedUser?.lastName,
    email: updatedUser?.email,
    phone: updatedUser?.phone,
  });
});

export default signin;
