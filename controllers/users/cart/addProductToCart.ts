import { Response } from 'express';
import { CustomRequest, IUser } from '../../../types/express';
import User from '../../../models/User';
import ctrlWrapper from '../../../utils/ctrlWrapper';
import requestError from '../../../utils/requestError';

interface ReqBody {
  productId: string;
  quantity: number;
}

const addProductToCart = ctrlWrapper(
  async (req: CustomRequest, res: Response) => {
    const { _id, cart } = req.user as IUser;
    const { productId, quantity }: ReqBody = req.body;

    let user = null;
    if (cart.find((item) => item.productId.toString() === productId)) {
      user = await User.findOneAndUpdate(
        {
          _id,
          'cart.productId': productId,
        },
        {
          $inc: {
            'cart.$.quantity': quantity,
          },
        },
        { new: true },
      ).populate('cart.productId');
    } else {
      user = await User.findByIdAndUpdate(
        _id,
        {
          $push: {
            cart: {
              productId,
              quantity,
            },
          },
        },
        { new: true },
      ).populate('cart.productId');
    }
    if (!user) {
      throw requestError(500, 'Failed to add product to cart');
    }

    res.status(201).json({
      status: 'success',
      cart: user.cart,
    });
  },
);

export default addProductToCart;
