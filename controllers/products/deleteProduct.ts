import { Request, Response } from 'express';
import ctrlWrapper from '../../utils/ctrlWrapper';
import Product from '../../models/Product';
import { unlink } from 'fs';
import path from 'path';

const deleteProduct = ctrlWrapper(async (req: Request, res: Response) => {
  const oldImage = await Product.findById(req.params.id).select('image');
  if (oldImage) {
    const oldImagePath = path.join(__dirname, '..', '..', oldImage.image);
    unlink(oldImagePath, function (err) {
      if (err) {
        console.error('Error deleting file:', err);
      }
    });
  }
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export default deleteProduct;
