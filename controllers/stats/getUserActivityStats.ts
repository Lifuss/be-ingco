import { Request, Response } from 'express';
import User from '../../models/User';
import ctrlWrapper from '../../utils/ctrlWrapper';

const getLastWeekDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date;
};

const getUserActivityStats = ctrlWrapper(
  async (req: Request, res: Response) => {
    const {
      limit = 10,
      page = 1,
      startDate = getLastWeekDate(),
      endDate = new Date(),
    } = req.query;

    const numericLimit = +limit;
    const numericPage = +page;

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ message: 'Invalid date format' });
      return;
    }

    // Запит на вибірку користувачів, у яких `updatedAt` знаходиться в діапазоні
    const users = await User.find(
      {
        updatedAt: {
          $gte: start,
          $lte: end,
        },
      },
      'updatedAt',
    )
      .skip((numericPage - 1) * numericLimit)
      .limit(numericLimit);

    const total = await User.countDocuments({
      updatedAt: {
        $gte: start,
        $lte: end,
      },
    });

    const totalPages = Math.ceil(total / numericLimit);
    const hasMore = numericPage < totalPages;

    res.status(200).json({
      message: 'Successful',
      page: numericPage,
      totalPages,
      hasMore,
      users,
    });
  },
);

export default getUserActivityStats;
