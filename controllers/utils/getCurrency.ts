import { Request, Response } from 'express';
import ctrlWrapper from '../../utils/ctrlWrapper';

interface CurrencyCache {
  data: {
    USD: number;
    EUR: number;
  } | null;
  timestamp: number;
}

const currencyCache: CurrencyCache = {
  data: null,
  timestamp: 0,
};

const CACHE_DURATION = 60 * 60 * 1000;

const getCurrency = ctrlWrapper(async (req: Request, res: Response) => {
  try {
    const now = Date.now();

    if (currencyCache.data && now - currencyCache.timestamp < CACHE_DURATION) {
      res.status(200).json(currencyCache.data);
      return;
    }

    const response = await fetch('https://api.monobank.ua/bank/currency');
    const data = await response.json();

    const newBody = {
      USD: parseFloat(data[0].rateSell.toFixed(1)),
      EUR: parseFloat(data[1].rateSell.toFixed(1)),
    };

    currencyCache.data = newBody;
    currencyCache.timestamp = now;

    console.log('Currency cache updated:', newBody);
    res.status(200).json(newBody);
  } catch (error) {
    console.log(error);
    if (currencyCache.data) {
      console.log('API request failed, returning cached data as fallback');
      res.status(200).json(currencyCache.data);
      return;
    }

    throw new Error('Invalid currency data received');
  }
});

export default getCurrency;
