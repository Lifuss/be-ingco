import { Request, Response } from 'express';
import ctrlWrapper from '../../utils/ctrlWrapper';
import Category from '../../models/Category';
import requestError from '../../utils/requestError';
import validateUpdateInput from '../../utils/validateUpdateInput';
import { TCategoryBody } from './createCategory';

const updateCategory = ctrlWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, renderSort } = req.body as TCategoryBody;

  validateUpdateInput(id, req.body);

  const checkCategory = await Category.findOne({
    name,
    renderSort,
    _id: { $ne: id },
  });
  if (checkCategory) {
    throw requestError(409, 'Category already exists');
  }

  const category = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!category) {
    throw requestError(404, 'Category not found');
  }

  res.json(category);
});
export default updateCategory;
