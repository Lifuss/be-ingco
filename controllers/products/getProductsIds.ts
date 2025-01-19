import { Request, Response } from 'express';
import ctrlWrapper from '../../utils/ctrlWrapper';
import Product from '../../models/Product';

const getProductsIds = ctrlWrapper(async (req: Request, res: Response) => {
  const products = await Product.find({}, 'slug');
  const productIds = products.map((product) => product.slug);

  res.status(200).json({ productIds });
});

export default getProductsIds;
