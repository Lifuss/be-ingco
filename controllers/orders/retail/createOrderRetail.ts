import jwt from 'jsonwebtoken';
import RetailOrder from '@/models/RetailOrder';
import ctrlWrapper from '@/utils/ctrlWrapper';
import { Response } from 'express';
import getNextSequence from '@/utils/getNextSequence';
import { CustomRequest, IUser } from '@/types/express';
import User from '@/models/User';
import Product from '@/models/Product';
import sendEmail from '@/utils/sendEmail';

type orderProducts = {
  productId: string;
  quantity: number;
  totalPriceByOneProduct: number;
  price: number;
}[];

type orderBody = {
  token?: string;
  products: orderProducts;
  totalPrice: number;
  comment?: string;
  shippingAddress?: string;
  email: string;
  firstName: string;
  lastName: string;
  surName: string;
  phone: string;
};

const createOrderRetail = ctrlWrapper(
  async (req: CustomRequest, res: Response) => {
    const {
      products,
      totalPrice,
      comment,
      email,
      lastName,
      firstName,
      surName,
      phone,
      shippingAddress,
      token,
    } = req.body as orderBody;

    const orderCode: number = await getNextSequence('orderCode');

    let user: IUser | null = null;
    if (token) {
      if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');
      const secretKey: string = process.env.JWT_SECRET;

      const { id } = jwt.verify(token, secretKey) as { id: string };

      user = await User.findById(id);
    }
    console.log('user', user);
    console.log('token', token);

    const order = await RetailOrder.create({
      orderCode,
      status: 'очікує підтвердження',
      products: products.map((product) => ({
        product: product.productId,
        quantity: product.quantity,
        price: product.price,
        totalPriceByOneProduct: product.totalPriceByOneProduct,
      })),
      user: { email, lastName, firstName, surName, phone, userId: user?._id },
      totalPrice,
      isPaid: false,
      comment,
      isRetail: true,
      shippingAddress,
    });

    products.forEach(async (product) => {
      await Product.findByIdAndUpdate(product.productId, {
        $inc: { stock: -product.quantity },
      });
    });

    await User.findOneAndUpdate(
      { email },
      {
        $push: { orders: order._id },
        cartRetail: [],
      },
    );

    const productNames = await Product.find({
      _id: { $in: products.map((product) => product.productId) },
    }).select('name');

    const productData = productNames.map((product) => {
      const findProduct = products.find(
        (item) => item.productId === product._id.toString(),
      );
      return {
        productName: product.name,
        productPrice: findProduct?.price,
        productQuantity: findProduct?.quantity,
        productTotalPrice: findProduct?.totalPriceByOneProduct,
      };
    });

    if (email) {
      const mail = {
        to: email,
        subject: `Нове замовлення в ingco-service`,
        html: `
      <h1>Ваше замовлення успішно створено</h1>
      <p>Номер замовлення: ${orderCode}</p>
      <p>Статус: ${order.status}</p>
      <p>Деталі замовлення:</p>
      <ul>
        ${productData
          .map(
            (product) =>
              `<li>${product.productName} - ${product.productPrice}$ * ${product.productQuantity}шт. = ${product.productTotalPrice}$</li>`,
          )
          .join('')}
        </ul>
        <p>Загальна вартість: ${totalPrice}$</p>
        ${comment ? `<p>Коментар: ${comment}</p>` : ''}
        <p>Як тільки менеджер опрацює замовлення і статус зміниться ми відразу вам повідомимо</p>
        <p>Дякуємо за замовлення! </p>
    `,
      };

      await sendEmail(mail);
    }

    res.status(201).json(order);
  },
);

export default createOrderRetail;
