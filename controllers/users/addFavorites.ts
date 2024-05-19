import { Response } from 'express';
import ctrlWrapper from '../../utils/ctrlWrapper';
import { CustomRequest, IUser } from '../../types/express';
import requestError from '../../utils/requestError';
import User from '../../models/User';

const addFavorites = ctrlWrapper(async (req: CustomRequest, res: Response) => {
  const { productId } = req.params;
  const { favorites, _id } = req.user as IUser;

  if (favorites.toString().split(',').includes(productId)) {
    throw requestError(409, 'Product already in favorites');
  }
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { favorites: [...favorites, productId] },
    { new: true },
  ).select('favorites');

  res.json(updatedUser);
});

export default addFavorites;
