// Global test configuration
jest.setTimeout(30000) // 30 seconds timeout for tests

// Setup test environment
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret'
