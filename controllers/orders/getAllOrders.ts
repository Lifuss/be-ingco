import Order from '../../models/Order';
import { Request, Response } from 'express';

const getAllOrders = async (req: Request, res: Response) => {
  const orders = await Order.find().populate(
    'userId',
    '_id email login role firstName lastName surName phone address codeEDRPOU',
  );

  res.status(200).json(orders);
};

export default getAllOrders;
