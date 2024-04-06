import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    article: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    priceBulk: { type: Number, required: true },
    priceRetailRecommendation: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  },
  { timestamps: true, versionKey: false },
);

const Product = mongoose.model('Product', productSchema);

export default Product;
