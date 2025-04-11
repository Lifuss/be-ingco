import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ctrlWrapper from '../../../utils/ctrlWrapper';
import { IOrder, IProduct } from '../../../types/express';
import Order from '../../../models/Order';
import { generateOrderExcel } from '../../../utils/excel';

interface IOrderPopulated extends Omit<IOrder, 'products'> {
  products: {
    product: IProduct;
    quantity: number;
    totalPriceByOneProduct: number;
    price: number;
    _id: mongoose.Types.ObjectId;
  }[];
}

const getOrderSheet = ctrlWrapper(async (req: Request, res: Response): Promise<void> => {
  const orderId = req.params.id;

  const order = (await Order.findById(orderId)
    .populate('products.product')
    .lean()) as IOrderPopulated | null;

  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  let buffer: Buffer;

  try {
    buffer = await generateOrderExcel(order);
  } catch (error) {
    console.error('Error generating Excel file:', error);
    res.status(500).json({ error: 'Failed to generate Excel file' });
    return;
  }
  if (!buffer) {
    res.status(500).json({ error: 'Failed to generate Excel file' });
    return;
  }

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', 'attachment; filename="order.xlsx"');
  res.send(buffer);
});

export default getOrderSheet;
