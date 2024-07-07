import User from '../../../models/User';
import ctrlWrapper from '../../../utils/ctrlWrapper';
import requestError from '../../../utils/requestError';
import { Request, Response } from 'express';
import sendEmail from '../../../utils/sendEmail';
import bcrypt from 'bcryptjs';

type Credentials = {
  email: string;
  lastName: string;
  firstName: string;
  surName: string;
  phone: string;
  password: string;
};

const clientSignup = ctrlWrapper(async (req: Request, res: Response) => {
  const credentials: Credentials = req.body;

  const user = await User.findOne({ email: credentials.email });
  if (user) {
    throw requestError(409, 'User already exists');
  }

  credentials.password = await bcrypt.hash(credentials.password, 5);

  const login = credentials.email;
  const newUser = await User.create({ ...credentials, login, isB2B: false });

  const mail = {
    to: newUser.email,
    subject: 'Вітаємо в магазині ingco-service',
    html: `<h1>Вітаємо, ${newUser.firstName}!</h1>
    <p>Ви успішно зареєструвались на ingco-service</p>
    <p>Дякуємо за довіру до нашого бренду та продукцію</p>
    <p>Чекаємо на вас у нашому магазині</p>
    <br />
    <p>Це разове поштове повідомлення, ніяких новинних розсилок не були підписані</p>
    <br />
    <p>Звертатися по питанням можна у відповідь на це повідомлення, або за контактами на <a href="https://ingo-service.win/home" target="_blank" rel="noopener nofollow">сайті</a></p>
    <h3>Українській імпортер INGCO та інтернет магазин <a href="https://ingo-service.win/home" target="_blank" rel="noopener nofollow">"ingco-service"</a></h3>`,
  };

  await sendEmail(mail);

  res.status(201).json({ message: 'User created' });
});

export default clientSignup;
