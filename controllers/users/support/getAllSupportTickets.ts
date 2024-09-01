import { Request, Response } from 'express';
import Support from '../../../models/Support';
import ctrlWrapper from '../../../utils/ctrlWrapper';

const getAllSupportTickets = ctrlWrapper(
  async (req: Request, res: Response) => {
    const {
      q = '',
      isAnswered = false,
      page = '1',
      limit = '25',
    } = req.query as {
      q?: string;
      isAnswered?: boolean;
      page?: string;
      limit?: string;
    };

    const query = {
      $and: [
        { isAnswered },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } },
          ],
        },
      ],
    };

    const tickets = await Support.find(query)
      .sort({ updatedAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Support.countDocuments(query);

    const totalPages = Math.ceil(total / +limit);

    res.json({ tickets, total, totalPages });
  },
);

export default getAllSupportTickets;
