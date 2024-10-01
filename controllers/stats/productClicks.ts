import { Request, Response } from 'express';
import ProductStats from '../../models/ProductsStats';
import ctrlWrapper from '../../utils/ctrlWrapper';

const productClicks = ctrlWrapper(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const clickDate = new Date();

  await ProductStats.findOneAndUpdate(
    { productId },
    {
      $inc: { clicks: 1 },
      $push: {
        clickDates: {
          $each: [clickDate],
          $position: 0,
        },
      },
    },
    { new: true, upsert: true },
  );

  res.status(200).end();
});

export default productClicks;
