import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import Product from '../../models/Product';
import ctrlWrapper from '../../utils/ctrlWrapper';
import requestError from '../../utils/requestError';
import validateUpdateInput from '../../utils/validateUpdateInput';
import { TProductBody } from './createProduct';

const updateProduct = ctrlWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const body: Partial<TProductBody> = req.body;
  const image = req.file;

  validateUpdateInput(id, body);

  let newFilePathAbs: string | null = null;
  try {
    let oldImagePathPart: string | null = null;
    if (image) {
      // 1) Move uploaded file to static
      const oldPath = path.resolve('tmp', image.filename);
      const newPath = path.resolve('static', image.filename);
      try {
        await fs.rename(oldPath, newPath);
      } catch (_) {
        await fs.copyFile(oldPath, newPath);
        await fs.unlink(oldPath);
      }
      newFilePathAbs = newPath;
      body.image = `/static/${image.filename}`;

      // Save current image path before DB update
      const existing = await Product.findById(id).select('image');
      oldImagePathPart = existing?.image ? existing.image.replace(/^\/?static\//, '') : null;
    }

    if (Object.hasOwnProperty.call(body, 'category') && body.category === '') {
      body.category = null;
    }

    // 2) Update DB first
    const product = await Product.findByIdAndUpdate(id, body, { new: true });
    if (!product) {
      throw requestError(404, 'Product not found');
    }

    // 3) After successful DB update, conditionally delete old image if it wasn't overwritten concurrently
    if (image && oldImagePathPart) {
      // Re-fetch to verify current image equals the new one to avoid race deletions
      const current = await Product.findById(id).select('image');
      const currentIsNew = current?.image === body.image;
      if (currentIsNew) {
        const oldImagePathAbs = path.resolve('static', oldImagePathPart);
        try {
          await fs.unlink(oldImagePathAbs);
        } catch (error) {
          const err = error as NodeJS.ErrnoException;
          if (err && err.code !== 'ENOENT') {
            console.error('Error deleting old image file:', err);
          }
        }
      }
    }

    res.json(product);
  } catch (err) {
    // Rollback: if DB update failed after saving new file, remove the newly saved file
    if (image && newFilePathAbs) {
      try {
        await fs.unlink(newFilePathAbs);
      } catch (_) {}
    }
    throw err;
  }
});

export default updateProduct;
