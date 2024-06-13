import Order from '../../models/Order';
import { Request, Response } from 'express';
import ctrlWrapper from '../../utils/ctrlWrapper';
import RetailOrder from '@/models/RetailOrder';

const getAllOrders = ctrlWrapper(async (req: Request, res: Response) => {
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

  const query = {
    $or: [
      { orderCode: new RegExp(q, 'i') },
      { 'user.login': new RegExp(q, 'i') },
    ],
  };
  let orders;
  let total;

  console.debug('isRetail', isRetail);

  if (isRetail === 'true') {
    orders = await RetailOrder.find(query)
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .populate('products.product', 'name');
    total = await RetailOrder.countDocuments(query);
  } else {
    orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit)
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

export default getAllOrders;
