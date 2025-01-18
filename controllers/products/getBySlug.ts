import { Request, Response } from 'express';
import ctrlWrapper from '../../utils/ctrlWrapper';
import Product from '../../models/Product';

const getBySlug = ctrlWrapper(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug });

  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }
  res.json(product);
});

export default getBySlug;
