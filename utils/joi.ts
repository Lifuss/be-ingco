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
  category: Joi.string(),
});
