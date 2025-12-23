export default {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  setupFiles: ['<rootDir>/tests/setup-env.js'],
  clearMocks: true,
  testTimeout: 30000,
  maxWorkers: 1,
};
