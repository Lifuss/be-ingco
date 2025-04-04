import Joi from 'joi';
import { orderStatusEnum } from '../models/Order';

export const productSchema = Joi.object({
  name: Joi.string().required(),
  article: Joi.string().required(),
  description: Joi.string().allow('', null),
  enterPrice: Joi.number().allow('', null),
  price: Joi.number().required(),
  priceRetailRecommendation: Joi.number().required(),
  rrcSale: Joi.number().empty('').default(0),
  warranty: Joi.number(),
  seoKeywords: Joi.string().allow('', null),
  countInStock: Joi.number().required(),
  category: Joi.string(),
  sort: Joi.number(),
  barcode: Joi.string().empty(''),
  characteristics: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      value: Joi.string().required(),
    })
  ),
});

export const updateProductSchema = Joi.object({
  name: Joi.string(),
  article: Joi.string(),
  description: Joi.string(),
  price: Joi.number(),
  rrcSale: Joi.number().empty('').default(0),
  enterPrice: Joi.number().allow('', null),
  priceRetailRecommendation: Joi.number(),
  countInStock: Joi.number(),
  category: Joi.string().allow('', null),
  warranty: Joi.number(),
  seoKeywords: Joi.string().allow('', null),
  sort: Joi.number(),
  barcode: Joi.string().empty(''),
  characteristics: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      value: Joi.string().required(),
    })
  ),
});

export const categorySchema = Joi.object({
  name: Joi.string().required(),
  renderSort: Joi.number().required(),
});

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  login: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().valid('user', 'admin').default('user'),
  isVerified: Joi.boolean().default(false),
  isB2B: Joi.boolean().default(true),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  surName: Joi.string().required(),
  phone: Joi.string().required(),
  edrpou: Joi.string().allow('', null),
  about: Joi.string().allow('', null),
  address: Joi.string().allow('', null),
  orders: Joi.array().items(Joi.string()),
  cart: Joi.array().items(Joi.string()),
  cartRetail: Joi.array().items(Joi.string()),
  favorites: Joi.array().items(Joi.string()),
  token: Joi.string().default(null),
});

export const registerUserSchema = Joi.object({
  email: Joi.string().email().required(),
  isVerified: Joi.boolean().default(false),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  surName: Joi.string().required(),
  phone: Joi.string().required(),
  edrpou: Joi.string().required(),
  about: Joi.string().allow('', null),
});

export const registerUserClientSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  surName: Joi.string().required(),
  phone: Joi.string().required(),
  password: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  login: Joi.string(),
  password: Joi.string(),
  role: Joi.string().valid('user', 'admin'),
  isVerified: Joi.boolean(),
  isB2B: Joi.boolean(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  surName: Joi.string(),
  phone: Joi.string(),
  edrpou: Joi.string(),
  about: Joi.string().allow('', null),
  address: Joi.string().allow('', null),
  orders: Joi.array().items(Joi.object()),
  cart: Joi.array().items(Joi.object()),
  cartRetail: Joi.array().items(Joi.object()),
  favorites: Joi.array().items(Joi.string()),
  token: Joi.string(),
  _id: Joi.string(),
  deleted: Joi.boolean(),
});

export const loginSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().required(),
});

export const createOrderSchema = Joi.object({
  products: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().required(),
      totalPriceByOneProduct: Joi.number().required(),
      price: Joi.number().required(),
    })
  ),
  shippingAddress: Joi.string().allow(''),
  totalPrice: Joi.number().required(),
  comment: Joi.string().allow(''),
});
export const createOrderRetailSchema = Joi.object({
  products: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().required(),
      totalPriceByOneProduct: Joi.number().required(),
      price: Joi.number().required(),
    })
  ),
  shippingAddress: Joi.string().allow(''),
  totalPrice: Joi.number().required(),
  comment: Joi.string().allow(''),
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  surName: Joi.string().required(),
  phone: Joi.string().required(),
  token: Joi.string().allow(''),
});

export const updateOrderSchema = Joi.object({
  status: Joi.string().valid(...orderStatusEnum),
  isPaid: Joi.boolean(),
  declarationNumber: Joi.string().allow(''),
  products: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required(),
        _id: Joi.string().required(),
        quantity: Joi.number().required(),
        totalPriceByOneProduct: Joi.number().required(),
        price: Joi.number().required(),
      })
    )
    .optional(),
  totalPrice: Joi.number().optional(),
  _id: Joi.string().optional(),
  comment: Joi.string().allow('').optional(),
  shippingAddress: Joi.string().allow('').optional(),
});

export const forgotSchema = Joi.object({ resetData: Joi.string().required() });

export const resetPasswordSchema = Joi.object({
  resetToken: Joi.string().required(),
  newPassword: Joi.string().required(),
});

export const supportSchema = Joi.object({
  name: Joi.string().min(2).max(60).required(),
  phone: Joi.string().min(8).max(20).required(),
  email: Joi.string().email().required(),
  message: Joi.string().min(10).max(500).required(),
});
