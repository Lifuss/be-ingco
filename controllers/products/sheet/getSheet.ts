import ctrlWrapper from '../../../utils/ctrlWrapper';
import { createExcelPrice, createExcelPromUa } from '../../../utils/excel';
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { acquireLock, releaseLock } from '../../../utils/locks';

enum SheetType {
  PROM = 'prom',
  PRICE = 'price',
}

const getSheet = ctrlWrapper(async (req: Request, res: Response) => {
  const { sheetType } = req.query as { sheetType: SheetType };
  const lockKey = `excel_${sheetType}`;

  if (sheetType === SheetType.PRICE) {
    const filePath = path.resolve('static', 'sheets', 'productsPrice.xlsx');
    try {
      const stats = await fs.stat(filePath);
      const lastModified = new Date(stats.mtime);
      const now = new Date();
      const oneDay = 24 * 60 * 60 * 1000;

      if (now.getTime() - lastModified.getTime() >= oneDay) {
        if (!acquireLock(lockKey)) {
          res.status(202).json({
            message: 'Файл формується, спробуйте через декілька секунд.',
          });
        }
        try {
          await createExcelPrice();
        } finally {
          releaseLock(lockKey);
        }
      }
      res.download(filePath, 'products.xlsx', (downloadError) => {
        if (downloadError) {
          throw new Error('File not found');
        }
      });
    } catch (error) {
      console.error('Error handling the file request:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  if (sheetType === SheetType.PROM) {
    const filePath = path.resolve('static', 'sheets', 'productsProm.xlsx');
    try {
      const stats = await fs.stat(filePath);
      const lastModified = new Date(stats.mtime);
      const now = new Date();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      if (now.getTime() - lastModified.getTime() >= oneWeek) {
        if (!acquireLock(lockKey)) {
          res.status(202).json({
            message: 'Файл формується, спробуйте через декілька секунд.',
          });
        }
        try {
          await createExcelPromUa();
        } finally {
          releaseLock(lockKey);
        }
      }
      res.download(filePath, 'products.xlsx', (downloadError) => {
        if (downloadError) {
          throw new Error('File not found');
        }
      });
    } catch (error) {
      console.error('Error handling the file request:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  res.status(404).json({ message: 'Sheet type not found' });
});

export default getSheet;
