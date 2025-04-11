import { parentPort, workerData } from 'worker_threads';
import mongoose from 'mongoose';
import Order from '../../models/Order';
import { generateOrderExcel } from '../excel';
import { IOrder, IProduct } from '../../types/express';

const connectToDatabase = async () => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.DB_URI as string, {});
  }
};

interface IOrderPopulated extends Omit<IOrder, 'products'> {
  products: {
    product: IProduct;
    quantity: number;
    totalPriceByOneProduct: number;
    price: number;
    _id: mongoose.Types.ObjectId;
  }[];
}

async function doWork() {
  try {
    await connectToDatabase();

    const orderId: string = workerData.orderId;
    const order = (await Order.findById(orderId)
      .populate('products.product')
      .lean()) as IOrderPopulated | null;

    if (!order) {
      parentPort?.postMessage({ error: 'Замовлення не знайдено' });
      return;
    }

    const buffer = await generateOrderExcel(order);
    parentPort?.postMessage({ buffer });
  } catch (error) {
    parentPort?.postMessage({ error: error instanceof Error ? error.message : String(error) });
  }
}

doWork();
