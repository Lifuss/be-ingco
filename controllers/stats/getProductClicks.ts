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

  // Пошук продуктів з кліками в межах дат, з пагінацією
  const productClicks = await ProductStats.find({
    clickDates: { $gte: start, $lte: end },
  })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('productId', 'name') // Підтягуємо деталі продукту
    .lean(); // Перетворення документів у plain JavaScript об'єкти для підвищення продуктивності

  // Підрахунок загальної кількості документів
  const total = await ProductStats.countDocuments({
    clickDates: { $gte: start, $lte: end },
  });

  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages;

  res.status(200).json({
    message: 'Successful',
    page,
    totalPages,
    hasMore,
    productClicks,
  });
});

export default getProductClicks;
