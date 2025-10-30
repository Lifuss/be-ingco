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
    try {
      await sgMail.send(mail);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown email service error';
      const responseBody =
        typeof error === 'object' && error !== null && 'response' in error
          ? (error as { response?: { body?: unknown } }).response?.body
          : undefined;
      console.error(
        `[${new Date().toISOString()}] Failed to send email "${mail.subject}" to "${mail.to}": ${message}`,
        responseBody
      );
      return false;
    }
  } else {
    console.info(`DEV:mock email ${mail.subject} send to ${mail.to} from ${mail.from}`);
  }
  return true;
};

export default sendEmail;
