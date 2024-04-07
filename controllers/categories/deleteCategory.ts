import { Request, Response } from 'express';
import ctrlWrapper from '../../utils/ctrlWrapper';
import Category from '../../models/Category';
import Product from '../../models/Product';

const deleteCategory = ctrlWrapper(async (req: Request, res: Response) => {
  const products = await Product.find(
    { category: req.params.id },
    '_id name article',
  ).populate({
    path: 'category',
    select: 'name -_id',
  });

  if (products.length > 0) {
    res
      .status(400)
      .json({ message: 'Cannot delete category with products', products });
    return;
  }

  await Category.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export default deleteCategory;
