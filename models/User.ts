import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    login: {
      type: String,
      required: [true, 'Login is required'],
      unique: true,
    },
    password: { type: String, default: null },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
    },
    surName: {
      type: String,
      required: [true, 'Surname is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
    },
    edrpou: {
      type: String,
      default: null,
    },
    about: {
      type: String,
    },
    address: {
      type: String,
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    сartRetail: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    token: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, versionKey: false },
);

const User = mongoose.model('User', userSchema);

export default User;
