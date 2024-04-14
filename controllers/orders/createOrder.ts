import Order from '../../models/Order';
import ctrlWrapper from '../../utils/ctrlWrapper';
import { Response } from 'express';
import getNextSequence from '../../utils/getNextSequence';
import { CustomRequest, IUser } from '../../types/express';
import User from '../../models/User';

type orderProducts = {
  _id: string;
  quantity: number;
  totalPriceByOneProduct: number;
  price: number;
}[];

type orderBody = {
  userId: string;
  products: orderProducts;
  totalPrice: number;
  comment?: string;
  shippingAddress?: string;
};

const createOrder = ctrlWrapper(async (req: CustomRequest, res: Response) => {
  const { products, totalPrice } = req.body as orderBody;
  const { _id } = req.user as IUser;

  const orderCode = await getNextSequence('orderCode');
  const order = await Order.create({
    orderCode,
    status: 'очікує підтвердження',
    products: products.map((product) => ({
      product: product._id,
      quantity: product.quantity,
      price: product.price,
      totalPriceByOneProduct: product.totalPriceByOneProduct,
    })),
    user: { userId: _id, login: req.user?.login },
    totalPrice,
    isPaid: false,
  });

  await User.findByIdAndUpdate(_id, {
    $push: { orders: order._id },
  });
  res.status(201).json(order);
});

export default createOrder;
