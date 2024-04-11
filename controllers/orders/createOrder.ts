import Counter from '../../models/Counter';
import Order from '../../models/Order';
import ctrlWrapper from '../../utils/ctrlWrapper';
import { Request, Response } from 'express';

const getNextSequence = async (name: string) => {
  //TODO 1: Create a counter document with the given name if it doesn't exist
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  return counter.seq;
};
const createOrder = ctrlWrapper(async (req: Request, res: Response) => {
  const { userId, products } = req.body;
  const orderCode = await getNextSequence('orderCode');
  const order = await Order.create({ orderCode, userId, products });
  res.status(201).json(order);
});

export default createOrder;
