import { Request, Response } from 'express';
import ctrlWrapper from '../../utils/ctrlWrapper';
import Product from '../../models/Product';
import fs from 'fs/promises';
import path from 'path';

const deleteProduct = ctrlWrapper(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).select('image');

  if (product?.image) {
    const imagePath = path.resolve('.', product.image);

    try {
      await fs.unlink(imagePath);
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  }

  await Product.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export default deleteProduct;
