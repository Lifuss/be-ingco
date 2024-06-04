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
  })
    .sort({ updatedAt: -1 })
    .select('-password')
    .populate('orders', 'orderCode totalPrice status');

  res.json(users);
});

export default getAllUsers;
