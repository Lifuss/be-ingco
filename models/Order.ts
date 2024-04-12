import mongoose from 'mongoose';

const orderStatusEnum = [
  'очікує підтвердження',
  'очікує оплати',
  'комплектується',
  'відправлено',
  'замовлення виконано',
  'замовлення скасовано',
];
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
      },
    ],
    shippingAddress: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

const Order = mongoose.model('Order', orderSchema);

export default Order;
