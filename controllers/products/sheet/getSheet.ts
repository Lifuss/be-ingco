import ctrlWrapper from '../../../utils/ctrlWrapper';
import { createExcelPromUa } from '../../../utils/excel';
import { Request, Response } from 'express';
import path from 'path';

const getSheet = ctrlWrapper(async (req: Request, res: Response) => {
  const { sheetType } = req.query as { sheetType: 'prom' | 'default' };

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
    default:
      res.status(404).json({ message: 'Sheet type not found' });
      break;
  }
});

export default getSheet;
