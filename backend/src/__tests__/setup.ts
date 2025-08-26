import { TestEnvironment } from './utils/test-helpers'

// Setup test environment before all tests
beforeAll(() => {
    TestEnvironment.setupTestEnvironment()
})

// Cleanup after all tests
afterAll(() => {
    TestEnvironment.cleanupTestEnvironment()
})

// Global test configuration
jest.setTimeout(30000) // 30 seconds timeout for tests

// Mock console methods to reduce noise in tests
const originalConsole = global.console

beforeEach(() => {
    global.console = {
        ...originalConsole,
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        debug: jest.fn()
    }
})

afterEach(() => {
    global.console = originalConsole
    jest.clearAllMocks()
})
