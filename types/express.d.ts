import { Request } from 'express';
import mongoose from 'mongoose';

export interface IUser {
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
  cart: mongoose.Types.ObjectId[];
  favorites: mongoose.Types.ObjectId[];
  token?: string;
}
type User = IUser;

export interface CustomRequest extends Request {
  user?: User;
  headers: {
    authorization?: string;
  };
}
