import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../../models/Product';
import requestError from '../../utils/requestError';
import ctrlWrapper from '../../utils/ctrlWrapper';
import { TBody } from './createProduct';

const updateProduct = ctrlWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const body: Partial<TBody> = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw requestError(400, 'Invalid product id');
  }

  if (Object.keys(body).length === 0) {
    throw requestError(400, 'Empty request body');
  }

  const product = await Product.findByIdAndUpdate(id, body, { new: true });

  if (!product) {
    throw requestError(404, 'Product not found');
  }

  res.json(product);
});

export default updateProduct;
