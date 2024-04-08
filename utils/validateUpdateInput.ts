import mongoose from 'mongoose';
import requestError from './requestError';

function validateUpdateInput<T extends object>(id: string, body: T) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw requestError(400, 'Id is not a valid MongoDB ObjectId');
  }

  if (Object.keys(body).length === 0) {
    throw requestError(400, 'Empty request body');
  }
}

export default validateUpdateInput;
