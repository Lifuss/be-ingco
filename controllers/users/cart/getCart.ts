import { Response } from 'express';
import { CustomRequest, IUser } from '../../../types/express';
import User from '../../../models/User';
import ctrlWrapper from '../../../utils/ctrlWrapper';
import requestError from '../../../utils/requestError';

const getCart = ctrlWrapper(async (req: CustomRequest, res: Response) => {
  const { _id } = req.user as IUser;
  const user = await User.findById(_id).populate('cart.productId');
  if (!user) {
    throw requestError(500, 'Failed to get cart');
  }
  res.status(200).json({
    status: 'success',
    cart: user.cart,
  });
});

export default getCart;
