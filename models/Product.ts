import mongoose from 'mongoose';
import { slugify } from 'transliteration';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: {
      type: String,
      unique: true,
    },
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

productSchema.pre('save', async function (next) {
  if (!this.isModified('name')) return next();

  const baseSlug = slugify(this.name)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  let slug = baseSlug;
  let counter = 1;

  while (await mongoose.models.Product.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  this.slug = slug;
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
