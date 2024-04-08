import { Request, Response } from 'express';
import User from '../../models/User';
import ctrlWrapper from '../../utils/ctrlWrapper';

const getAllUsers = ctrlWrapper(async (req: Request, res: Response) => {
  const { q = '', role = 'user' } = req.query as { q?: string; role?: string };

  const users = await User.find({
    $and: [
      { role },
      {
        $or: [
          { email: { $regex: q, $options: 'i' } },
          { login: { $regex: q, $options: 'i' } },
        ],
      },
    ],
  }).select('-password');

  res.json(users);
});

export default getAllUsers;
