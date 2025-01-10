import { Request, Response } from 'express';
import ctrlWrapper from '../../utils/ctrlWrapper';
import Product from '../../models/Product';

const getProductsIds = ctrlWrapper(async (req: Request, res: Response) => {
  const products = await Product.find({}, '_id');
  const productIds = products.map((product) => product._id.toString());
  res.status(200).json({ productIds });
});

export default getProductsIds;
