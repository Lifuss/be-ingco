import { Request, Response } from 'express';
import Product from '../../models/Product';
import ctrlWrapper from '../../utils/ctrlWrapper';

const searchProducts = ctrlWrapper(async (req: Request, res: Response) => {
  const { q } = req.query;
  const products = await Product.find({
    $text: { $search: q as string },
  });

  res.json(products);
});

export default searchProducts;
