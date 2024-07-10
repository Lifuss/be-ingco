import ctrlWrapper from '../../../utils/ctrlWrapper';
import { createExcelPrice, createExcelPromUa } from '../../../utils/excel';
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';

enum SheetType {
  PROM = 'prom',
  PRICE = 'price',
}

const getSheet = ctrlWrapper(async (req: Request, res: Response) => {
  const { sheetType } = req.query as { sheetType: SheetType };
  console.log(sheetType);

  switch (sheetType) {
    case 'prom':
      await createExcelPromUa();
      res.download(
        path.resolve('static', 'sheets', 'productsProm.xlsx'),
        'products.xlsx',
        (err) => {
          if (err) {
            throw new Error('File not found');
          }
        },
      );
      break;
    case 'price':
      try {
        const filePath = path.resolve('static', 'sheets', 'productsPrice.xlsx');
        const stats = await fs.stat(filePath);
        const lastModified = new Date(stats.mtime);
        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000;

        if (now.getTime() - lastModified.getTime() >= oneDay) {
          await createExcelPrice();
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
      break;
    default:
      res.status(404).json({ message: 'Sheet type not found' });
      break;
  }
});

export default getSheet;
