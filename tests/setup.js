// Global test setup
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'

// Mock environment variables
beforeAll(() => {
  process.env.NODE_ENV = 'test'
  process.env.VITE_API_URL = 'http://localhost:5000'
  process.env.VITE_WS_URL = 'ws://localhost:5000'
})

// Clean up after all tests
afterAll(() => {
  // Cleanup code here
})

// Reset before each test
beforeEach(() => {
  // Reset mocks, clear localStorage, etc.
  if (typeof window !== 'undefined') {
    window.localStorage.clear()
    window.sessionStorage.clear()
  }
})

// Cleanup after each test
afterEach(() => {
  // Additional cleanup if needed
})

// Mock fetch globally
global.fetch = vi.fn()

// Mock WebSocket
global.WebSocket = vi.fn(() => ({
  send: vi.fn(),
  close: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  readyState: 1,
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

