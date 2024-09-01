import { Request, Response } from 'express';
import ctrlWrapper from '../../../utils/ctrlWrapper';
import Support from '../../../models/Support';
import getNextSequence from '../../../utils/getNextSequence';

const createSupportTicket = ctrlWrapper(async (req: Request, res: Response) => {
  const {
    name,
    email,
    message,
    phone,
  }: { name: string; email: string; message: string; phone: string } = req.body;

  const ticketNumber = await getNextSequence('supportCode');
  await Support.create({ name, email, message, ticketNumber, phone });

  res.status(200).json({ message: 'Support ticket was successful created' });
});

export default createSupportTicket;
