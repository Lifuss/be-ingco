import { Response } from 'express';
import User from '../../models/User';
import ctrlWrapper from '../../utils/ctrlWrapper';
import { CustomRequest, IUser } from '../../types/express';

const refreshUser = ctrlWrapper(async (req: CustomRequest, res: Response) => {
  const { _id } = req.user as IUser;

  const user = await User.findById(_id);

  res.status(200).json({
    login: user?.login,
    role: user?.role,
    isVerified: user?.isVerified,
    token: user?.token,
  });
});

export default refreshUser;
