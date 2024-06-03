import ctrlWrapper from '../../utils/ctrlWrapper';
import { Request, Response } from 'express';
import requestError from '../../utils/requestError';
import Order, { orderStatusEnum } from '../../models/Order';
import validateUpdateInput from '../../utils/validateUpdateInput';

type TUpdateOrderBody = {
  status: (typeof orderStatusEnum)[number];
  isPaid: boolean;
  products: {
    _id: string;
    quantity: number;
    price: number;
    totalPriceByOneProduct: number;
  }[];
  totalPrice: number;
  comment?: string;
  shippingAddress?: string;
  declarationNumber?: string;
};

const updateOrder = ctrlWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: TUpdateOrderBody = req.body;

  validateUpdateInput(id, updateData);

  if (updateData.products?.length) {
    const newTotalPrice = updateData.products?.reduce((acc, product) => {
      acc += product.totalPriceByOneProduct;
      return acc;
    }, 0);
    updateData.totalPrice = newTotalPrice;
  }

  const order = await Order.findByIdAndUpdate(id, updateData, {
    new: true,
  })
    .populate(
      'user.userId',
      '_id email role firstName lastName surName phone address codeEDRPOU',
    )
    .populate('products.product', 'name');

  if (!order) {
    throw requestError(404, 'Order not found');
  }

  res.json(order);
});

export default updateOrder;
