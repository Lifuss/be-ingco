import requestError from '../utils/requestError';
import { Request, NextFunction, Response } from 'express';
import { Schema } from 'joi';

const validateBody = (schema: Schema) => {
  const func = (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw requestError(400, error.message);
    }
    next();
  };
  return func;
};

export default validateBody;
