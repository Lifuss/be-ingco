import Order from '../../models/Order';
import { Response } from 'express';
import ctrlWrapper from '../../utils/ctrlWrapper';
import { CustomRequest, IUser } from '../../types/express';

const getUserOrders = ctrlWrapper(async (req: CustomRequest, res: Response) => {
  const {
    q = '',
    page = 1,
    limit = 15,
  } = req.query as { q?: string; page?: string; limit?: string };
  const { _id } = req.user as IUser;

  const query = {
    $and: [
      { 'user.userId': _id },
      {
        $or: [
          { orderCode: new RegExp(q, 'i') },
          { declarationNumber: new RegExp(q, 'i') },
        ],
      },
    ],
  };

  const orders = await Order.find(query)
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .sort({ createdAt: -1 })
    .populate(
      'user.userId',
      '_id email role firstName lastName surName phone address codeEDRPOU',
    )
    .populate('products.product', 'name');

  const total = await Order.countDocuments(query);
  const totalPages = Math.ceil(total / +limit);

  res.status(200).json({ total, totalPages, orders });
});

export default getUserOrders;
