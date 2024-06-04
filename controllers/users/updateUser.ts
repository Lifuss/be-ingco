import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { IUser } from '../../types/express';
import ctrlWrapper from '../../utils/ctrlWrapper';
import requestError from '../../utils/requestError';
import User from '../../models/User';
import validateUpdateInput from '../../utils/validateUpdateInput';

const updateUser = ctrlWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const body: Partial<IUser> = req.body;

  validateUpdateInput(id, body);

  const checkUser = await User.findOne({
    _id: { $ne: id },
    $or: [{ email: body.email }, { login: body.login }],
  });
  if (checkUser) {
    throw requestError(409, 'email or login already exists');
  }
  // пропрацювати емайл розсилку при зміні емайлу або паролю тощо.

  if (body.password) {
    body.password = await bcrypt.hash(body.password, 5);
  }

  const user = await User.findByIdAndUpdate(id, body, { new: true })
    .select('-password')
    .populate('orders', 'orderCode totalPrice status');

  if (!user) {
    throw requestError(404, 'User not found');
  }

  res.json(user);
});

export default updateUser;
