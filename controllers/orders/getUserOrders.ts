import Order from '../../models/Order';
import { Response } from 'express';
import ctrlWrapper from '../../utils/ctrlWrapper';
import { CustomRequest, IUser } from '../../types/express';
import RetailOrder from '../../models/RetailOrder';

const getUserOrders = ctrlWrapper(async (req: CustomRequest, res: Response) => {
  const {
    q = '',
    page = 1,
    limit = 15,
    isRetail = 'false',
  } = req.query as {
    q?: string;
    page?: string;
    limit?: string;
    isRetail?: 'false' | 'true';
  };
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
  let orders;
  let total;

  if (isRetail === 'true') {
    orders = await RetailOrder.find(query)
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ createdAt: -1 })
      .populate(
        'user.userId',
        '_id email role firstName lastName surName phone',
      )
      .populate('products.product', 'name');
    total = await RetailOrder.countDocuments(query);
  } else {
    orders = await Order.find(query)
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ createdAt: -1 })
      .populate(
        'user.userId',
        '_id email role firstName lastName surName phone address edrpou',
      )
      .populate('products.product', 'name');
    total = await Order.countDocuments(query);
  }

  const totalPages = Math.ceil(total / +limit);

  res.status(200).json({ total, totalPages, orders });
});

export default getUserOrders;
