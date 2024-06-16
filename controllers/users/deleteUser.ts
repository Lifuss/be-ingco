import User from '../../models/User';
import ctrlWrapper from '../../utils/ctrlWrapper';
import { Request, Response } from 'express';
import requestError from '../../utils/requestError';

const deleteUser = ctrlWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw requestError(404, 'User not found');
  }
  res.status(204).json({ message: 'User deleted' });
});

export default deleteUser;
