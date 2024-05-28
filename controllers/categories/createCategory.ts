import { Request, Response } from 'express';
import ctrlWrapper from '../../utils/ctrlWrapper';
import Category from '../../models/Category';
import requestError from '../../utils/requestError';

export type TCategoryBody = {
  name: string;
};

const createCategory = ctrlWrapper(async (req: Request, res: Response) => {
  const checkCategory = await Category.findOne({ name: req.body.name });
  if (checkCategory) {
    throw requestError(400, 'Category already exists');
  }

  const category = await Category.create(req.body as TCategoryBody);

  res.status(201).json({
    ...category.toObject(),
    count: 0,
  });
});
export default createCategory;
