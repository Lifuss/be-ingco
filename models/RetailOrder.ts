import mongoose from 'mongoose';

export const orderStatusEnum = [
  'очікує підтвердження',
  'очікує оплати',
  'комплектується',
  'відправлено',
  'замовлення виконано',
  'замовлення скасовано',
] as const;
const orderPaymentMethodEnum = ['на карту', 'на підприємство', 'готівка'];
const orderPaymentStatusEnum = ['оплачено', 'не оплачено'];

const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: orderStatusEnum,
      default: 'очікує підтвердження',
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
        totalPriceByOneProduct: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: { type: String },
    declarationNumber: { type: String, default: '' },
    user: {
      email: { type: String, required: true },
      lastName: { type: String, required: true },
      firstName: { type: String, required: true },
      surName: { type: String, required: true },
      phone: { type: String, required: true },
    },
    totalPrice: { type: Number, required: true },
    payment: {
      method: { type: String, enum: orderPaymentMethodEnum },
      status: {
        type: String,
        enum: orderPaymentStatusEnum,
      },
    },
    isPaid: { type: Boolean, required: true, default: false },
    comment: { type: String },
  },
  { timestamps: true, versionKey: false },
);

const RetailOrder = mongoose.model('RetailOrder', orderSchema);

export default RetailOrder;
