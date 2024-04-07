import { Request, Response } from 'express';
import ctrlWrapper from '../../utils/ctrlWrapper';
import Product from '../../models/Product';

const deleteProduct = ctrlWrapper(async (req: Request, res: Response) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export default deleteProduct;
