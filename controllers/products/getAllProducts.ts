import { Request, Response } from 'express';
import Product from '../../models/Product';
import ctrlWrapper from '../../utils/ctrlWrapper';

const getAllProducts = ctrlWrapper(async (req: Request, res: Response) => {
  const {
    q = '',
    page = '1',
    limit = '10',
  } = req.query as { q?: string; page?: string; limit?: string };

  const products = await Product.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { article: { $regex: q, $options: 'i' } },
    ],
  })
    .skip((+page - 1) * +limit)
    .limit(+limit);

  const total = await Product.countDocuments({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { article: { $regex: q, $options: 'i' } },
    ],
  });

  const totalPages = Math.ceil(total / +limit);

  res.json({ products, total, totalPages });
});

export default getAllProducts;
