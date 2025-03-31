import validateUpdateInput from '../../utils/validateUpdateInput';

describe('validateUpdateInput utility', () => {
  it('should throw an error if the id is not a valid MongoDB ObjectId', () => {
    // Arrange
    const testId = 'not-a-valid-object-id';
    const testBody = { name: 'Test Name' };

    // Act and assert
    expect(() => validateUpdateInput(testId, testBody)).toThrow(
      'Id is not a valid MongoDB ObjectId',
    );
  });

  it('should throw an error if the request body is empty', () => {
    // Arrange
    const testId = '60b0f7b4b0f7e0c3c8f4f5b0';
    const testBody = {};

    // Act and assert
    expect(() => validateUpdateInput(testId, testBody)).toThrow(
      'Empty request body',
    );
  });
});
