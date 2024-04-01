import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  priceBulk: Joi.number(),
  countInStock: Joi.number().required(),
  imageUrl: Joi.string().required(),
  category: Joi.string(),
});
