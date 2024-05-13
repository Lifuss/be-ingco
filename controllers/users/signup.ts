import User from '../../models/User';
import ctrlWrapper from '../../utils/ctrlWrapper';
import requestError from '../../utils/requestError';
import { Request, Response } from 'express';

type Credentials = {
  email: string;
  lastName: string;
  firstName: string;
  surName: string;
  phone: string;
  edrpou: string;
  about: string;
  login?: string;
};

const signup = ctrlWrapper(async (req: Request, res: Response) => {
  const credentials: Credentials = req.body;

  const user = await User.findOne({ email: credentials.email });
  if (user) {
    throw requestError(400, 'User already exists');
  }

  credentials.login = credentials.email.split('@')[0];
  const newUser = await User.create(credentials);

  res.status(201).json(newUser);
});

export default signup;
