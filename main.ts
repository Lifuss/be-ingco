import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { RequestError } from './utils/requestError';
import path from 'path';

import productRouter from './routes/products';
import categoryRouter from './routes/categories';
import userRouter from './routes/users';
import orderRouter from './routes/orders';
import statsRouter from './routes/stats';

dotenv.config();

const app = express();
// TODO: update logger to min useful information
// Logger for static files
const staticFilesLogger = morgan(function (tokens, req, res) {
  let url = tokens.url(req, res);
  if (url && url.startsWith('/static')) {
    url = url.split('_').pop();
  }
  return [
    tokens.method(req, res),
    url,
    tokens.status(req, res),
    '-',
    tokens['response-time'](req, res),
    'ms',
  ].join(' ');
});

const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

app.use(cors());

app.use('/static', staticFilesLogger);
app.use(
  '/static',
  express.static(path.resolve('static'), {
    maxAge: '1y',
    etag: true,
    lastModified: true,
  }),
);

app.use(express.json());

app.use(morgan(format));
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/orders', orderRouter);
app.use('/api/stats', statsRouter);

app.use((req: Request, res: Response) => {
  const error = new Error('Not Found - ' + req.originalUrl);
  res.status(404).json({ message: error.message });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: RequestError, req: Request, res: Response, _: NextFunction) => {
  const { status = 500, message = 'Server error' } = err;
  console.log(err.message);
  res.status(status).json({ message });
});

export default app;
