import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    status: { type: String, required: true },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    shippingAddress: { type: String },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    isPaid: { type: Boolean, required: true, default: false },
    comment: { type: String },
  },
  { timestamps: true, versionKey: false },
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
