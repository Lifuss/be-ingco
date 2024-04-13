import Order from '../../models/Order';
import { Request, Response } from 'express';
import ctrlWrapper from '../../utils/ctrlWrapper';

const getAllOrders = ctrlWrapper(async (req: Request, res: Response) => {
  const { q = '' } = req.query as { q?: string };

  const query = {
    $or: [
      { orderCode: new RegExp(q, 'i') },
      { 'user.login': new RegExp(q, 'i') },
    ],
  };

  const orders = await Order.find(query).populate(
    'user.userId',
    '_id email role firstName lastName surName phone address codeEDRPOU',
  );
  res.status(200).json(orders);
});

export default getAllOrders;
