import { Request, Response } from 'express';
import User from '../../../models/User';
import ctrlWrapper from '../../../utils/ctrlWrapper';
import requestError from '../../../utils/requestError';
import sendEmail from '../../../utils/sendEmail';
import { randomUUID } from 'crypto';
import { addHours } from 'date-fns';

const forgot = ctrlWrapper(async (req: Request, res: Response) => {
  const { resetData = '' }: { resetData: string } = req.body;

  if (!resetData) {
    throw requestError(400, 'Invalid input data');
  }

  const findUserByEmailOrLogin = await User.findOne({
    $or: [
      { email: { $regex: resetData, $options: 'i' } },
      { login: { $regex: resetData, $options: 'i' } },
    ],
  });

  if (findUserByEmailOrLogin) {
    const resetToken = randomUUID();
    const resetTokenExpires = addHours(new Date(), 1);

    await User.findByIdAndUpdate(findUserByEmailOrLogin._id, {
      resetToken,
      resetTokenExpires,
    });

    const mail = {
      to: findUserByEmailOrLogin.email,
      subject: 'Скидування паролю на ingco-service',
      html: `<h1>Вітаємо!</h1>
    <p>Було створена за'явка по скидуванню паролю</p>
    <p>Якщо це були не ви, то нічого не робіть, якщо це повторюється зверніться до адміністрації сайту у відповідь на цей лист</p>
    <p>Щоб продовжити скидування перейдіть по <a href="https://ingco-service.win/auth/forgot/${resetToken}" target="_blank" rel="noopener nofollow">посиланню</a></p>
    <br />
    <p>Звертатися по питанням можна у відповідь на це повідомлення, або за контактами на <a href="https://ingco-service.win/home/contacts" target="_blank" rel="noopener nofollow">сайті</a></p>
    <h3>Українській імпортер INGCO та інтернет магазин <a href="https://ingco-service.win" target="_blank" rel="noopener nofollow">"ingco-service"</a></h3>`,
    };
    await sendEmail(mail);
  }

  res
    .status(200)
    .json({ message: 'Email for change password was send successfully' });
});

export default forgot;
