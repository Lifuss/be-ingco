import { CustomRequest, IUser } from '../../../types/express';
import { Response } from 'express';
import ctrlWrapper from '../../../utils/ctrlWrapper';
import requestError from '../../../utils/requestError';
import User from '../../../models/User';

const deleteFavorites = ctrlWrapper(
  async (req: CustomRequest, res: Response) => {
    const { _id } = req.user as IUser;
    const { productId } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $pull: { favorites: productId } },
      { new: true },
    );

    if (!updatedUser) {
      throw requestError(500, 'Error updating user');
    }
    res.json(updatedUser.favorites);
  },
);

export default deleteFavorites;
