import { Request, Response } from 'express';
import Product from '../../models/Product';
import requestError from '../../utils/requestError';
import ctrlWrapper from '../../utils/ctrlWrapper';
import { TProductBody } from './createProduct';
import validateUpdateInput from '../../utils/validateUpdateInput';

const updateProduct = ctrlWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const body: Partial<TProductBody> = req.body;

  validateUpdateInput(id, body);

  if (Object.hasOwnProperty.call(body, 'category') && body.category === '') {
    body.category = null;
  }

  const product = await Product.findByIdAndUpdate(id, body, { new: true });

  if (!product) {
    throw requestError(404, 'Product not found');
  }

  res.json(product);
});

export default updateProduct;
