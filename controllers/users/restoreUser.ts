import User from '../../models/User';
import ctrlWrapper from '../../utils/ctrlWrapper';
import { Request, Response } from 'express';
import requestError from '../../utils/requestError';

const restoreUser = ctrlWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { deleted: false });
  if (!user) {
    throw requestError(404, 'User not found');
  }
  console.info(
    'User was restored login:',
    user.login,
    ' e-mail:',
    user.email,
    ' id:',
    user._id,
  );
  res.status(200).json({ message: 'User restored' });
});

export default restoreUser;
