import { Request, Response } from 'express';
import ctrlWrapper from '../../utils/ctrlWrapper';
import Category from '../../models/Category';
import requestError from '../../utils/requestError';
import validateUpdateInput from '../../utils/validateUpdateInput';

const updateCategory = ctrlWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  validateUpdateInput(id, { name });

  const category = await Category.findByIdAndUpdate(
    id,
    { name },
    { new: true },
  );
  if (!category) {
    throw requestError(404, 'Category not found');
  }

  res.json(category);
});
export default updateCategory;
