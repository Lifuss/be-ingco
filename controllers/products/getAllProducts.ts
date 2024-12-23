import { Request, Response } from 'express';
import Product from '../../models/Product';
import ctrlWrapper from '../../utils/ctrlWrapper';

type SortValueType =
  | 'default'
  | 'popular'
  | 'cheep'
  | 'expensive'
  | 'popular'
  | 'name';

const getAllProducts = ctrlWrapper(async (req: Request, res: Response) => {
  const {
    q = '',
    page = '1',
    limit = '10',
    category = '',
    sortValue = 'default',
    isRetail = 'true',
  } = req.query as {
    q?: string;
    page?: string;
    limit?: string;
    category?: string;
    sortValue: SortValueType;
    isRetail: 'true' | 'false';
  };

  const isRetailBool = isRetail === 'true';

  const query: Record<string, unknown> = {
    ...(q && {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { article: { $regex: q, $options: 'i' } },
      ],
    }),
    ...(category && { category }),
  };

  const sortOptions: Record<SortValueType, Record<string, 1 | -1>> = {
    default: { sort: 1, createdAt: 1 },
    popular: { rrcSale: -1, sort: 1, createdAt: 1 },
    cheep: isRetailBool
      ? { priceRetailRecommendation: 1, sort: 1, createdAt: 1 }
      : { price: 1, sort: 1, createdAt: 1 },
    expensive: isRetailBool
      ? { priceRetailRecommendation: -1, rrcSale: -1, sort: 1, createdAt: 1 }
      : { price: -1, sort: 1, createdAt: 1 },
    name: { name: 1, sort: 1, createdAt: 1 },
  };

  const sort = sortOptions[sortValue];
  const skip = (+page - 1) * +limit;

  const projection = isRetailBool ? '-priceBulk -price' : '';

  const [products, total] = await Promise.all([
    Product.find(query, projection)
      .skip(skip)
      .limit(+limit)
      .populate('category')
      .sort(sort),
    Product.countDocuments(query),
  ]);
  const totalPages = Math.ceil(total / +limit);

  res.json({ total, sort: sortValue, totalPages, products });
});

export default getAllProducts;
