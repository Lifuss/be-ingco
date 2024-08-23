import { Request, Response } from 'express';
import Product from '../../models/Product';
import ctrlWrapper from '../../utils/ctrlWrapper';

const getAllProducts = ctrlWrapper(async (req: Request, res: Response) => {
  const {
    q = '',
    page = '1',
    limit = '10',
    category = '',
  } = req.query as {
    q?: string;
    page?: string;
    limit?: string;
    category?: string;
  };

  let query = {
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { article: { $regex: q, $options: 'i' } },
    ],
  } as Record<string, unknown>;

  if (category) {
    query = {
      $and: [{ category }, query],
    };
  }

  const products = await Product.find(query)
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .populate('category')
    .sort({ sort: 'desc' });

  const total = await Product.countDocuments(query);

  const totalPages = Math.ceil(total / +limit);

  res.json({ products, total, totalPages });
});

export default getAllProducts;
