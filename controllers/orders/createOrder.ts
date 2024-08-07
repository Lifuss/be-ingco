import Order from '../../models/Order';
import ctrlWrapper from '../../utils/ctrlWrapper';
import { Response } from 'express';
import getNextSequence from '../../utils/getNextSequence';
import { CustomRequest, IUser } from '../../types/express';
import User from '../../models/User';
import Product from '../../models/Product';
import sendEmail from '../../utils/sendEmail';

type orderProducts = {
  productId: string;
  quantity: number;
  totalPriceByOneProduct: number;
  price: number;
}[];

type orderBody = {
  userId: string;
  products: orderProducts;
  totalPrice: number;
  comment?: string;
  shippingAddress?: string;
};

const createOrder = ctrlWrapper(async (req: CustomRequest, res: Response) => {
  const { products, totalPrice, comment, shippingAddress } =
    req.body as orderBody;
  const { _id, email } = req.user as IUser;

  const orderCode: number = await getNextSequence('orderCode');
  const order = await Order.create({
    orderCode,
    status: 'очікує підтвердження',
    products: products.map((product) => ({
      product: product.productId,
      quantity: product.quantity,
      price: product.price,
      totalPriceByOneProduct: product.totalPriceByOneProduct,
    })),
    shippingAddress,
    user: { userId: _id, login: req.user?.login },
    totalPrice,
    isPaid: false,
    comment,
  });

  products.forEach(async (product) => {
    await Product.findByIdAndUpdate(product.productId, {
      $inc: { stock: -product.quantity },
    });
  });

  await User.findByIdAndUpdate(_id, {
    $push: { orders: order._id },
    cart: [],
  });

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

  res.status(201).json(order);
});

export default createOrder;
