import ctrlWrapper from '../../utils/ctrlWrapper';
import { Request, Response } from 'express';
import requestError from '../../utils/requestError';
import Order, { orderStatusEnum } from '../../models/Order';
import validateUpdateInput from '../../utils/validateUpdateInput';

type TUpdateOrderBody = {
  status: (typeof orderStatusEnum)[number];
  isPaid: boolean;
  newProducts: {
    _id: string;
    quantity: number;
    price: number;
    totalPriceByOneProduct: number;
  }[];
  totalPrice: number;
  comment: string;
  shippingAddress: string;
};

const updateOrder = ctrlWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: Partial<TUpdateOrderBody> = req.body;

  validateUpdateInput(id, updateData);

  const order = await Order.findByIdAndUpdate(id, updateData, { new: true });

  if (!order) {
    throw requestError(404, 'Order not found');
  }

  res.json(order);
});

export default updateOrder;
