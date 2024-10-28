import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    article: { type: String, required: true },
    description: { type: String },
    characteristics: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    warranty: { type: Number },
    seoKeywords: { type: String },
    price: { type: Number, required: true },
    priceBulk: { type: Number },
    priceRetailRecommendation: { type: Number, required: true },
    rrcSale: { type: Number, default: 0 },
    enterPrice: { type: Number, default: 0 },
    countInStock: { type: Number, required: true },
    image: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    barcode: { type: String, default: null },
    sort: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false },
);

const Product = mongoose.model('Product', productSchema);

export default Product;
