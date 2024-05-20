import { Request } from 'express';
import mongoose from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  login: string;
  password: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  firstName: string;
  lastName: string;
  surName: string;
  phone: string;
  codeEDRPOU: string;
  about?: string;
  address?: string;
  orders: mongoose.Types.ObjectId[];
  cart: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    _id: mongoose.Types.ObjectId;
  }[];
  favorites: mongoose.Types.ObjectId[];
  token?: string;
}

export interface CustomRequest extends Request {
  user?: IUser;
  headers: {
    authorization?: string;
  };
}
