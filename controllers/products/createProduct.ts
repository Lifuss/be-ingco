import { Request, Response } from 'express';
import Product from '../../models/Product';
import ctrlWrapper from '../../utils/ctrlWrapper';
import path from 'path';
import fs from 'fs/promises'; // використовуємо промісну версію

export type TProductBody = {
  name: string;
  article: string;
  price: number;
  priceBulk: number;
  priceRetailRecommendation: number;
  rrcSale: number;
  enterPrice: number;
  description: string;
  image: string;
  countInStock: number;
  category?: string | null;
  barcode?: string;
};

const createProduct = ctrlWrapper(async (req: Request, res: Response) => {
  const image = req.file;

  if (!image) {
    throw new Error('Image is required');
  }

  const oldPath = path.resolve('tmp', image.filename);
  const newPath = path.resolve('static', image.filename);

  try {
    await fs.copyFile(oldPath, newPath);
    await fs.unlink(oldPath);
  } catch (err) {
    console.error('Error moving file:', err);
    throw new Error('File upload failed');
  }

  req.body.image = `/static/${image.filename}`;

  const product = await Product.create(req.body as TProductBody);
  res.status(201).json(product);
});

export default createProduct;
