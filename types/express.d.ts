import { Request } from 'express';
import mongoose from 'mongoose';
import { User as PassportUser } from 'passport';

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
type User = IUser & PassportUser;

export interface CustomRequest extends Request {
  user?: User;
  headers: {
    authorization?: string;
  };
}
export interface Query {
  'categories.brand': string[];
  'categories.color': string[];
  'categories.size': string[];
  'categories.sex'?: string[];
  'categories.season'?: string[];
  [key: string]: string[] | undefined;
}
export interface ReqQuery {
  page?: string;
  limit?: string;
  sort?: 'createdAt' | 'price';
  order?: 'asc' | 'desc';
  brand?: string;
  color?: string;
  size?: string;
  sex?: string;
  season?: string;
}
