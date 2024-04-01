import { Request, Response } from 'express';
import Product from '../../models/products';
import ctrlWrapper from '../../utils/ctrlWrapper';

const createProduct = ctrlWrapper(async (req: Request, res: Response) => {
  const { name, price, description, imageUrl, countInStock, category } =
    req.body;
  const product = new Product({
    name,
    price,
    description,
    imageUrl,
    countInStock,
    category,
  });
  await product.save();
  res.status(201).json(product);
});

export default createProduct;
