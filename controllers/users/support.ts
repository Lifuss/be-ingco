import { Request, Response } from 'express';
import ctrlWrapper from '../../utils/ctrlWrapper';
import Support from '../../models/Support';

const support = ctrlWrapper(async (req: Request, res: Response) => {
  const {
    name,
    email,
    message,
  }: { name: string; email: string; message: string } = req.body;

  await Support.create({ name, email, message });

  res.status(200).json({ message: 'Support ticket was successful created' });
});

export default support;
