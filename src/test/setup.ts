import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// Mock IntersectionObserver
beforeAll(() => {
  class MockIntersectionObserver {
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
  });
});

// Mock ResizeObserver
beforeAll(() => {
  class MockResizeObserver {
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
  }

  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: MockResizeObserver,
  });
});

// Mock scrollTo
beforeAll(() => {
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
});

// Mock fetch
globalThis.fetch = vi.fn() as unknown as typeof fetch;

// Mock AudioContext
beforeAll(() => {
  class MockAudioContext {
    createOscillator = vi.fn(() => ({
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      frequency: { value: 440 },
    }));
    createGain = vi.fn(() => ({
      connect: vi.fn(),
      gain: { value: 1 },
    }));
    destination = {};
    close = vi.fn();
  }

  Object.defineProperty(window, 'AudioContext', {
    writable: true,
    value: MockAudioContext,
  });
});

// Suppress console errors during tests (optional)
// vi.spyOn(console, 'error').mockImplementation(() => {});
