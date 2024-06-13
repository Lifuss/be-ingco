import { Response } from 'express';
import { CustomRequest, IUser } from '../../../../types/express';
import User from '../../../../models/User';
import ctrlWrapper from '../../../../utils/ctrlWrapper';
import requestError from '../../../../utils/requestError';

interface ReqBody {
  productId: string;
  quantity: number;
}

const addProductToRetailCart = ctrlWrapper(
  async (req: CustomRequest, res: Response) => {
    const { _id, cartRetail } = req.user as IUser;
    const { productId, quantity }: ReqBody = req.body;

    let user = null;
    if (cartRetail.find((item) => item.productId.toString() === productId)) {
      user = await User.findOneAndUpdate(
        {
          _id,
          'cartRetail.productId': productId,
        },
        {
          $inc: {
            'cartRetail.$.quantity': quantity,
          },
        },
        { new: true },
      ).populate('cartRetail.productId');
    } else {
      user = await User.findByIdAndUpdate(
        _id,
        {
          $push: {
            cartRetail: {
              productId,
              quantity,
            },
          },
        },
        { new: true },
      ).populate('cartRetail.productId');
    }
    if (!user) {
      throw requestError(500, 'Failed to add product to cart');
    }

    res.status(201).json({
      status: 'success',
      cart: user.cartRetail,
    });
  },
);

export default addProductToRetailCart;
