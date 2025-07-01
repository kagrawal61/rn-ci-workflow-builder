// Jest setup file for global test configuration

// Set timezone to UTC for consistent date testing
process.env.TZ = 'UTC';

// Global test timeout
jest.setTimeout(10000);

// Mock console methods in tests to avoid noise
global.console = {
  ...console,
  // Keep these methods for debugging
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Global test utilities
global.testUtils = {
  // Helper to create test data
  createMockConfig: (overrides = {}) => ({
    projectName: 'test-project',
    platforms: ['android'],
    ...overrides,
  }),
};
