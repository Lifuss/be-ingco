import { Request, Response } from 'express';
import Product from '../../models/Product';
import ctrlWrapper from '../../utils/ctrlWrapper';

export type TProductBody = {
  name: string;
  article: string;
  price: number;
  priceBulk: number;
  priceRetailRecommendation: number;
  description: string;
  imageUrl: string;
  countInStock: number;
  category?: string;
};

const createProduct = ctrlWrapper(async (req: Request, res: Response) => {
  const product = await Product.create(req.body as TProductBody);
  res.status(201).json(product);
});

export default createProduct;
