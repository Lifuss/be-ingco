import { Request, Response } from 'express';
import ctrlWrapper from '../../utils/ctrlWrapper';
import Product from '../../models/Product';
import mongoose from 'mongoose';

// Deprecated
const getById = ctrlWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid product id' });
    return;
  }

  const product = await Product.findById(id);

  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }
  res.json(product);
});

export default getById;
