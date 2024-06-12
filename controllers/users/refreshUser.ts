import { Response } from 'express';
import User from '../../models/User';
import ctrlWrapper from '../../utils/ctrlWrapper';
import { CustomRequest, IUser } from '../../types/express';

const refreshUser = ctrlWrapper(async (req: CustomRequest, res: Response) => {
  const { _id } = req.user as IUser;

  const user = await User.findById(_id)
    .populate('cart.productId')
    .populate('cartRetail.productId')
    .populate('favorites');

  res.status(200).json({
    login: user?.login,
    role: user?.role,
    isVerified: user?.isVerified,
    token: user?.token,
    favorites: user?.favorites,
    cart: user?.cart,
    cartRetail: user?.cartRetail,
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phone: user?.phone,
    surName: user?.surName,
  });
});

export default refreshUser;
