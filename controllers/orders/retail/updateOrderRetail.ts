import ctrlWrapper from '../../../utils/ctrlWrapper';
import { Request, Response } from 'express';
import requestError from '../../../utils/requestError';
import { orderStatusEnum } from '../../../models/Order';
import RetailOrder from '../../../models/RetailOrder';
import validateUpdateInput from '../../../utils/validateUpdateInput';

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

const updateRetailOrder = ctrlWrapper(async (req: Request, res: Response) => {
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

  const order = await RetailOrder.findByIdAndUpdate(id, updateData, {
    new: true,
  }).populate('products.product', 'name');

  if (!order) {
    throw requestError(404, 'Order not found');
  }

  res.json(order);
});

export default updateRetailOrder;
