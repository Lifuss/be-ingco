import fs from 'fs';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { RequestError } from './utils/requestError';

import productRouter from './routes/products';
import categoryRouter from './routes/categories';
import userRouter from './routes/users';
import orderRouter from './routes/orders';
import statsRouter from './routes/stats';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const loggerType =
  process.env.NODE_ENV === 'development'
    ? 'dev'
    : ':method :date[clf] :url :status - :response-time ms';
app.use(morgan(loggerType));

// === Static file serving ===
app.use('/static', morgan('📦 :status :url - :response-time ms'));
app.use(
  '/static',
  express.static(path.resolve('static'), {
    maxAge: '1y',
    etag: true,
    lastModified: true,
  }),
);

// === API Routes ===
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/orders', orderRouter);
app.use('/api/stats', statsRouter);

// === 404 ===
app.use((req: Request, res: Response) => {
  const error = new Error('Not Found - ' + req.originalUrl);
  res.status(404).json({ message: error.message });
});

// === Global Error Handler ===
app.use((err: RequestError, req: Request, res: Response, _: NextFunction) => {
  const { status = 500, message = 'Server error' } = err;
  const logMessage = `[${new Date().toISOString()}] [${status}] ${message} - ${req.method} ${req.originalUrl}\n`;

  const logFilePath = path.join(__dirname, 'errors.log');
  fs.appendFile(logFilePath, logMessage, 'utf8', (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
  console.error(logMessage);

  res.status(status).json({ message });
});

export default app;
