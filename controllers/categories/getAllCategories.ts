import { Request, Response } from 'express';
import Category from '../../models/Category';
import ctrlWrapper from '../../utils/ctrlWrapper';
import Product from '../../models/Product';

const getAllCategories = ctrlWrapper(async (req: Request, res: Response) => {
  const { q = '' } = req.query as {
    q?: string;
  };

  const categories = await Category.find(
    {
      name: { $regex: q, $options: 'i' },
    },
    'name renderSort _id',
  ).sort({ renderSort: 1 });

  const countProductWithinCategory = await Promise.all(
    categories.map(async (categoryItem) => {
      const count = await Product.countDocuments({
        category: categoryItem._id,
      });
      return {
        _id: categoryItem._id,
        name: categoryItem.name,
        count,
        renderSort: categoryItem.renderSort,
      };
    }),
  );

  res.json(countProductWithinCategory);
});

export default getAllCategories;
