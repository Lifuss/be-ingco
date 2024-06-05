import User from '../../models/User';
import ctrlWrapper from '../../utils/ctrlWrapper';
import requestError from '../../utils/requestError';
import { Request, Response } from 'express';
import sendEmail from '../../utils/sendEmail';

type Credentials = {
  email: string;
  lastName: string;
  firstName: string;
  surName: string;
  phone: string;
  edrpou: string;
  about: string;
  login?: string;
};

const signup = ctrlWrapper(async (req: Request, res: Response) => {
  const credentials: Credentials = req.body;

  const user = await User.findOne({ email: credentials.email });
  if (user) {
    throw requestError(400, 'User already exists');
  }

  credentials.login = credentials.email.split('@')[0];
  const newUser = await User.create(credentials);

  const mail = {
    to: newUser.email,
    subject: 'Вітаємо на ingco-service',
    html: `<h1>Вітаємо, ${newUser.firstName}!</h1>
    <p>Ви успішно зареєструвались на ingco-service</p>
    <p>В даний момент проходить верифікація вашого акаунта</p>
    <p>Як тільки менеджер вас верифікує, вам на пошту прийде повідомлення закріпленим за вами логіном та паролем</p>
    <p>Дякуємо за реєстрацію</p>
    <p>Чекаємо на вас у нашому магазині</p>
    <br />
    <p>Звертатися по питанням можна у відповідь на це повідомлення</p>
    <br />
    <p>Інтернет магазин "ingco-service"</p>`,
  };

  await sendEmail(mail);

  res.status(201).json(newUser);
});

export default signup;
