import { Request, Response } from 'express';
import Product from '../../models/Product';
import ctrlWrapper from '../../utils/ctrlWrapper';

const getAllProducts = ctrlWrapper(async (req: Request, res: Response) => {
  const { q } = req.query;
  const query = q ? { name: { $regex: q as string, $options: 'i' } } : {};
  const products = await Product.find(query);
  res.json(products);
});

export default getAllProducts;
