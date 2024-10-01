import mongoose from 'mongoose';

const productStatsSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      unique: true,
      required: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    clickDates: [
      {
        type: Date,
        default: Date.now,
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

const ProductStats = mongoose.model('ProductStats', productStatsSchema);

export default ProductStats;
