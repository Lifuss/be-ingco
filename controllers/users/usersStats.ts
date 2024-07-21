import { Request, Response } from 'express';
import User from 'models/User';
import ctrlWrapper from 'utils/ctrlWrapper';

const usersStats = ctrlWrapper(async (req: Request, res: Response) => {
  const notVerified = await User.countDocuments({
    isVerified: false,
    isB2B: true,
  });
  console.log(notVerified);

  res.json({ notVerified });
});

export default usersStats;
