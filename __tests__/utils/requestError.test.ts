import requestError from '../../utils/requestError';

describe('requestError utility', () => {
  it('should create an error with the correct status and message', () => {
    // Arrange
    const testStatus = 404;
    const testMessage = 'Not Found';

    // Act
    const err = requestError(testStatus, testMessage);

    // Assert
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(testStatus);
    expect(err.message).toBe(testMessage);
  });
});
