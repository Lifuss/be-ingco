import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().required(),
  article: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  priceBulk: Joi.number().required(),
  priceRetailRecommendation: Joi.number().required(),
  countInStock: Joi.number().required(),
  imageUrl: Joi.string().required(),
  category: Joi.string(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string(),
  article: Joi.string(),
  description: Joi.string(),
  price: Joi.number(),
  priceBulk: Joi.number(),
  priceRetailRecommendation: Joi.number(),
  countInStock: Joi.number(),
  imageUrl: Joi.string(),
  category: Joi.string().allow('', null),
});

export const categorySchema = Joi.object({
  name: Joi.string().required(),
});

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  login: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().valid('user', 'admin').default('user'),
  isVerified: Joi.boolean().default(false),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  surName: Joi.string().required(),
  phone: Joi.string().required(),
  codeEDRPOU: Joi.string().required(),
  about: Joi.string().allow('', null),
  address: Joi.string().allow('', null),
  orders: Joi.array().items(Joi.string()),
  cart: Joi.array().items(Joi.string()),
  favorites: Joi.array().items(Joi.string()),
  token: Joi.string().default(null),
});
