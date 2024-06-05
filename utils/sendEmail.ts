import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

const { SENDGRID_API_KEY, EMAIL_FROM } = process.env;

if (!SENDGRID_API_KEY || !EMAIL_FROM) {
  throw new Error('SENDGRID_API_KEY or EMAIL_FROM is not defined in .env file');
}

type Data = {
  to: string;
  subject: string;
  html: string;
};

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data: Data) => {
  const mail = { ...data, from: EMAIL_FROM };
  await sgMail.send(mail);
  return true;
};

export default sendEmail;
