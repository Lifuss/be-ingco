import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import ctrlWrapper from '../../../utils/ctrlWrapper';
import { createExcelPrice, createExcelPromUa } from '../../../utils/excel';
import { acquireLock, releaseLock } from '../../../utils/locks';

enum SheetType {
  PROM = 'prom',
  PRICE = 'price',
}

// Time in milliseconds, for how long the file is considered up-to-date (for now it the same for both types)
enum TimesMap {
  prom = 7 * 24 * 60 * 60 * 1000,
  price = 7 * 24 * 60 * 60 * 1000,
}

const getSheet = ctrlWrapper(async (req: Request, res: Response) => {
  const { sheetType } = req.query as { sheetType: SheetType };

  if (
    !sheetType ||
    typeof sheetType !== 'string' ||
    !Object.values(SheetType).includes(sheetType)
  ) {
    res.status(400).json({ message: 'Invalid sheet type' });
    return;
  }

  const lockKey = `excel_${sheetType}`;
  const fileName = `products${sheetType.toUpperCase()}.xlsx`;
  const filePath = path.resolve('static', 'sheets', fileName);

  try {
    await fs.access(filePath);
  } catch (error) {
    await createExcelFile(lockKey, sheetType, fileName, filePath, res);
    return;
  }

  const stats = await fs.stat(filePath);
  const lastModified = new Date(stats.mtime);
  const now = new Date();
  const timeDiff = TimesMap[sheetType];

  try {
    if (now.getTime() - lastModified.getTime() >= timeDiff) {
      await createExcelFile(lockKey, sheetType, fileName, filePath, res);
      return;
    }
    res.download(filePath, fileName, (downloadError) => {
      if (downloadError) {
        console.error('Download error:', downloadError);
      }
    });
  } catch (error) {
    console.error('Error handling the file request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
async function createExcelFile(
  lockKey: string,
  sheetType: SheetType,
  fileName: string,
  filePath: string,
  res: Response,
) {
  if (!acquireLock(lockKey)) {
    res.status(202).json({
      message: 'File is being created. Try again in a few seconds',
    });
    return;
  }

  try {
    if (sheetType === SheetType.PRICE) {
      await createExcelPrice(fileName);
    } else {
      await createExcelPromUa(fileName);
    }
    res.download(filePath, fileName, (downloadError) => {
      if (downloadError) {
        console.error('Download error after file creation:', downloadError);
      }
    });
  } catch (error) {
    console.error('Error creating excel file:', error);
    res.status(500).json({ message: 'Server error during file creation' });
  } finally {
    releaseLock(lockKey);
  }
}

export default getSheet;
