import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

const { SENDGRID_API_KEY, EMAIL_FROM, NODE_ENV } = process.env;

if (!SENDGRID_API_KEY || !EMAIL_FROM) {
  throw new Error('SENDGRID_API_KEY or EMAIL_FROM is not defined in .env file');
}

type Data = {
  to: string;
  subject: string;
  html: string;
};

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data: Data): Promise<boolean> => {
  const mail = { ...data, from: EMAIL_FROM };
  if (NODE_ENV === 'production') {
    await sgMail.send(mail);
  } else {
    console.info(`DEV:mock email ${mail.subject} send to ${mail.to} from ${mail.from}`);
  }
  return true;
};

export default sendEmail;
