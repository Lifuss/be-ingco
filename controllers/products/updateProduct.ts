import { Request, Response } from 'express';
import Product from '../../models/Product';
import requestError from '../../utils/requestError';
import ctrlWrapper from '../../utils/ctrlWrapper';
import { TProductBody } from './createProduct';
import validateUpdateInput from '../../utils/validateUpdateInput';
import path from 'path';
import { rename, unlink } from 'fs';

const updateProduct = ctrlWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const body: Partial<TProductBody> = req.body;
  const image = req.file;

  validateUpdateInput(id, body);

  // TODO if image new - delete old image
  if (image) {
    const oldPath = path.join(__dirname, '..', '..', 'tmp', image.filename);
    const newPath = path.join(__dirname, '..', '..', 'static', image.filename);
    rename(oldPath, newPath, function (err) {
      if (err) {
        console.error('Error moving file:', err);
      }
    });

    body.image = `/static/${image.filename}`;

    const oldImage = await Product.findById(id).select('image');
    if (oldImage) {
      const oldImagePath = path.join(__dirname, '..', '..', oldImage.image);
      unlink(oldImagePath, function (err) {
        if (err) {
          console.error('Error deleting file:', err);
        }
      });
    }
  }

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
