import { isBefore } from 'date-fns';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import ctrlWrapper from '../../../utils/ctrlWrapper';
import requestError from '../../../utils/requestError';

const resetPassword = ctrlWrapper(async (req: Request, res: Response) => {
  const { resetToken, newPassword } = req.body;

  const user = await User.findOne({ resetToken });

  if (
    !user ||
    !user.resetTokenExpires ||
    isBefore(user.resetTokenExpires, new Date())
  ) {
    throw requestError(400, 'Token is invalid or has expired');
  }

  const hashPassword = await bcrypt.hash(newPassword, 5);
  user.token = '';
  user.password = hashPassword;
  user.resetToken = '';
  user.resetTokenExpires = undefined;

  await user.save();

  res.status(200).json({ message: 'Password has been reset successfully' });
});

export default resetPassword;
