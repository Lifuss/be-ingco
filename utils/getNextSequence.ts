import Counter from '../models/Counter';

const getNextSequence = async (name: string) => {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  return counter.seq;
};

export default getNextSequence;
