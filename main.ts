import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from 'morgan';
import { RequestError } from './utils/requestError';

import productRouter from './routes/products';
import categoryRouter from './routes/categories';
import userRouter from './routes/users';
import orderRouter from './routes/orders';

dotenv.config();

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/orders', orderRouter);

app.use((req: Request, res: Response) => {
  const error = new Error('Not Found');
  res.status(404).json({ message: error.message });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: RequestError, req: Request, res: Response, _: NextFunction) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

export default app;
