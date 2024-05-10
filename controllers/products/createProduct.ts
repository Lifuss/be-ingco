import { Request, Response } from 'express';
import Product from '../../models/Product';
import ctrlWrapper from '../../utils/ctrlWrapper';
import path from 'path';
import { rename } from 'fs';

export type TProductBody = {
  name: string;
  article: string;
  price: number;
  priceBulk: number;
  priceRetailRecommendation: number;
  description: string;
  image: string;
  countInStock: number;
  category?: string | null;
};

const createProduct = ctrlWrapper(async (req: Request, res: Response) => {
  const image = req.file;

  if (!image) {
    throw new Error('Image is required');
  }
  const oldPath = path.join(__dirname, '..', '..', 'tmp', image.filename);
  const newPath = path.join(__dirname, '..', '..', 'static', image.filename);

  rename(oldPath, newPath, function (err) {
    if (err) {
      console.error('Error moving file:', err);
    } else {
      console.log(`Successfully moved file ${image.filename} to public folder`);
    }
  });

  req.body.image = `/static/${image.filename}`;

  const product = await Product.create(req.body as TProductBody);
  res.status(201).json(product);
});

export default createProduct;
