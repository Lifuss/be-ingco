import getNextSequence from '../../utils/getNextSequence';
import Counter from '../../models/Counter';

describe('getNextSequence', () => {
  it('should increment the sequence', async () => {
    const name = 'test';
    const counter = { seq: 1 };
    const findByIdAndUpdate = jest.fn().mockResolvedValue(counter);
    Counter.findByIdAndUpdate = findByIdAndUpdate;

    const result = await getNextSequence(name);

    expect(result).toBe(counter.seq);
    expect(findByIdAndUpdate).toHaveBeenCalledWith(
      name,
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
  });
});
