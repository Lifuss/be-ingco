import { Request, Response } from 'express';
import Support from '../../../models/Support';
import ctrlWrapper from '../../../utils/ctrlWrapper';

const updateSupportTicket = ctrlWrapper(async (req: Request, res: Response) => {
  const { ticketId } = req.params;
  const { isAnswered } = req.body;
  console.log(typeof isAnswered, isAnswered);
  console.log(ticketId);

  const updatedTicket = await Support.findByIdAndUpdate(ticketId, {
    isAnswered,
  });

  if (!updatedTicket) {
    res.status(404).json({ message: 'Ticket was not found' });
    return;
  }
  res.status(200).json({
    message: 'Ticket was complete and closed',
  });
});

export default updateSupportTicket;
