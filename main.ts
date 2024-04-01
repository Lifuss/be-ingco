import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import productRouter from './routes/products';
import dotenv from 'dotenv';
import logger from 'morgan';

dotenv.config();

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/products', productRouter);

app.use((req: Request, res: Response) => {
  const error = new Error('Not Found');
  res.status(404).json({ message: error.message });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  res.status(500).json({ message: `Server error ${err.message}` });
});

export default app;
