import app from './main';
import mongoose from 'mongoose';

const port = process.env.PORT || 3030;

mongoose.set('strictQuery', false);

mongoose
  .connect(process.env.DB_URI as string)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on ${port} port.`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
