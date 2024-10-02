import { Request, Response } from 'express';
import ProductStats from 'models/ProductsStats';
import ctrlWrapper from 'utils/ctrlWrapper';

const getLastWeekDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date;
};

const getProductClicks = ctrlWrapper(async (req: Request, res: Response) => {
  const { startDate = getLastWeekDate(), endDate = new Date() } = req.query;

  const limit = parseInt(req.query.limit as string) || 10;
  const page = parseInt(req.query.page as string) || 1;

  const start = new Date(startDate as string);
  const end = new Date(endDate as string);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    res.status(400).json({ message: 'Invalid date format' });
    return;
  }

  // Агрегація для вибірки кліків за датами
  const productClicks = await ProductStats.aggregate([
    {
      $match: {
        clickDates: {
          $elemMatch: {
            $gte: start, // Фільтрація кліків більше або дорівнює startDate
            $lte: end, // Фільтрація кліків менше або дорівнює endDate
          },
        },
      },
    },
    {
      $project: {
        productId: 1,
        clicksInRange: {
          $size: {
            $filter: {
              input: '$clickDates', // Фільтруємо масив `clickDates`
              as: 'clickDate',
              cond: {
                $and: [
                  { $gte: ['$$clickDate', start] }, // Фільтрація за startDate
                  { $lte: ['$$clickDate', end] }, // Фільтрація за endDate
                ],
              },
            },
          },
        },
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'productDetails',
      },
    },
    {
      $unwind: '$productDetails',
    },
    {
      $project: {
        productId: 1,
        clicksInRange: 1,
        'productDetails.name': 1, // Показуємо назву продукту
      },
    },
  ]);

  const total = await ProductStats.countDocuments({
    clickDates: {
      $elemMatch: {
        $gte: start,
        $lte: end,
      },
    },
  });

  const totalPages = Math.ceil(total / +limit);
  const hasMore = +page < totalPages;

  res.status(200).json({
    message: 'Successful',
    page,
    totalPages,
    hasMore,
    productClicks,
  });
});

export default getProductClicks;
