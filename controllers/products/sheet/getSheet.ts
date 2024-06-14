import ctrlWrapper from '../../../utils/ctrlWrapper';
import { createExcel } from '../../../utils/excel';
import { Request, Response } from 'express';
import path from 'path';

const getSheet = ctrlWrapper(async (req: Request, res: Response) => {
  await createExcel();

  res.download(
    path.resolve('static', 'sheets', 'products.xlsx'),
    'products.xlsx',
    (err) => {
      if (err) {
        throw new Error('File not found');
      }
    },
  );
});

export default getSheet;
