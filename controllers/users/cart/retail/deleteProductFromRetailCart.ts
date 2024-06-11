import { Response } from 'express';
import { CustomRequest, IUser } from '@/types/express';
import User from '@/models/User';
import ctrlWrapper from '@/utils/ctrlWrapper';
import requestError from '@/utils/requestError';

const deleteProductFromRetailCart = ctrlWrapper(
  async (req: CustomRequest, res: Response) => {
    const { _id, cartRetail } = req.user as IUser;
    const { productId, quantity = 1 } = req.body;

    let user = null;

    if (
      cartRetail.find(
        (item) =>
          item.productId.toString() === productId &&
          quantity < item.quantity &&
          item.quantity > 1,
      )
    ) {
      user = await User.findOneAndUpdate(
        {
          _id,
          'cartRetail.productId': productId,
        },
        {
          $inc: {
            'cartRetail.$.quantity': -quantity,
          },
        },
        { new: true },
      ).populate('cartRetail.productId');
    } else {
      user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: {
            cartRetail: {
              productId,
            },
          },
        },
        { new: true },
      ).populate('cartRetail.productId');
    }

    if (!user) {
      throw requestError(500, 'Failed to delete product from cart');
    }
    res.status(200).json({
      status: 'success',
      cart: user.cartRetail,
    });
  },
);

export default deleteProductFromRetailCart;
