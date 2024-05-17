import { Request, Response } from 'express';
import Category from '../../models/Category';
import ctrlWrapper from '../../utils/ctrlWrapper';

const getAllCategories = ctrlWrapper(async (req: Request, res: Response) => {
  const { q = '' } = req.query as { q?: string };
  const categories = await Category.find(
    {
      name: { $regex: q, $options: 'i' },
    },
    'name _id',
  );
  res.json(categories);
});

export default getAllCategories;
