import { Request, Response } from 'express';
import User from '../../models/User';
import ctrlWrapper from '../../utils/ctrlWrapper';

const getAllUsers = ctrlWrapper(async (req: Request, res: Response) => {
  const {
    q = '',
    role = 'user',
    isB2B,
    isUserVerified,
    isDeleted = 'true',
    page = '1',
    limit = '25',
  } = req.query as {
    q?: string;
    role?: string;
    isB2B?: boolean;
    isUserVerified?: boolean;
    isDeleted?: boolean;
    page?: string;
    limit?: string;
  };

  const isDeletedBoolean = isDeleted === 'true';

  const query = {
    $and: [
      { role, isB2B, isVerified: isUserVerified },
      {
        $or: [
          { email: { $regex: q, $options: 'i' } },
          { login: { $regex: q, $options: 'i' } },
        ],
      },
      { deleted: { $ne: !isDeletedBoolean } },
    ],
  };
  const users = await User.find(query)
    .sort({ updatedAt: -1 })
    .select('-password')
    .populate('orders', 'orderCode totalPrice status')
    .skip((+page - 1) * +limit)
    .limit(+limit);

  const total = await User.countDocuments(query);

  const totalPages = Math.ceil(total / +limit);

  res.json({ users, total, totalPages });
});

export default getAllUsers;
