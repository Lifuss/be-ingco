import mongoose from 'mongoose';

const supportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    isAnswered: { type: Boolean, default: false },
    ticketNumber: { type: Number },
  },
  { timestamps: true, versionKey: false },
);
const Support = mongoose.model('Support', supportSchema);

export default Support;
