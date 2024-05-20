import { Response } from 'express';
import { CustomRequest, IUser } from '../../../types/express';
import User from '../../../models/User';
import ctrlWrapper from '../../../utils/ctrlWrapper';
import requestError from '../../../utils/requestError';

const deleteProductFromCart = ctrlWrapper(
  async (req: CustomRequest, res: Response) => {
    const { _id, cart } = req.user as IUser;
    const { productId, quantity = 1 } = req.body;

    let user = null;

    if (
      cart.find(
        (item) =>
          item.productId.toString() === productId && quantity < item.quantity,
      )
    ) {
      user = await User.findOneAndUpdate(
        {
          _id,
          'cart.productId': productId,
        },
        {
          $inc: {
            'cart.$.quantity': -quantity,
          },
        },
        { new: true },
      );
    } else {
      user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: {
            cart: {
              productId,
            },
          },
        },
        { new: true },
      );
    }

    if (!user) {
      throw requestError(500, 'Failed to delete product from cart');
    }
    res.status(200).json({
      status: 'success',
      cart: user.cart,
    });
  },
);

export default deleteProductFromCart;
