import { Request, Response } from 'express';
import User from '../../models/User';
import ctrlWrapper from '../../utils/ctrlWrapper';

const getAllUsers = ctrlWrapper(async (req: Request, res: Response) => {
  const {
    q = '',
    role = 'user',
    isB2B,
    isUserVerified,
  } = req.query as {
    q?: string;
    role?: string;
    isB2B?: boolean;
    isUserVerified?: boolean;
  };

  const users = await User.find({
    $and: [
      { role, isB2B, isVerified: isUserVerified },
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
