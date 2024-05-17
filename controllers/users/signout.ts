import { Response } from 'express';
import ctrlWrapper from '../../utils/ctrlWrapper';
import User from '../../models/User';
import { CustomRequest, IUser } from '../../types/express';

const signout = ctrlWrapper(async (req: CustomRequest, res: Response) => {
  const { _id } = req.user as IUser;
  await User.findByIdAndUpdate(_id, { token: '' });
  res.status(204).end();
});

export default signout;
