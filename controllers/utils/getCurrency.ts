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

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length < 2) {
      throw new Error('Invalid data structure from API');
    }

    const newBody = {
      USD: parseFloat(data[0].rateSell.toFixed(1)),
      EUR: parseFloat(data[1].rateSell.toFixed(1)),
    };

    currencyCache.data = newBody;
    currencyCache.timestamp = now;

    res.status(200).json(newBody);
  } catch (error) {
    console.log('Currency API error:', error);

    if (currencyCache.data) {
      console.log('API request failed, returning cached data as fallback');
      res.status(200).json(currencyCache.data);
      return;
    }

    res.status(500).json({
      message: 'Currency service temporarily unavailable',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default getCurrency;
