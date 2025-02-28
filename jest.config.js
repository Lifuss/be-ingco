/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Можна вказати шляхи до тестів, якщо треба:
  testMatch: ['**/__tests__/**/*.test.ts'],
};
