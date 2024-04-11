import { Request, Response } from 'express';
import Product from '../../models/Product';
import ctrlWrapper from '../../utils/ctrlWrapper';

const getAllProducts = ctrlWrapper(async (req: Request, res: Response) => {
  const { q = '' } = req.query as { q?: string };

  const products = await Product.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { article: { $regex: q, $options: 'i' } },
    ],
  });
  res.json(products);
});
// TODO: Add pagination

export default getAllProducts;
