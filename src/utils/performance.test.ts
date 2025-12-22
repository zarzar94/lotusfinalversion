import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  debounce,
  throttle,
  memoize,
  lazy,
  createBatcher,
} from './performance';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should debounce function calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced();
    debounced();

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to debounced function', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('arg1', 'arg2');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should execute immediately when immediate flag is true', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100, true);

    debounced();
    expect(fn).toHaveBeenCalledTimes(1);

    debounced();
    debounced();
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    debounced();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should provide cancel method', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced.cancel();
    vi.advanceTimersByTime(100);

    expect(fn).not.toHaveBeenCalled();
  });
});

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should throttle function calls', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled(); // Executes immediately (leading)
    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(2); // Trailing call
  });

  it('should pass latest arguments', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled('first');
    throttled('second');
    throttled('third');

    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenLastCalledWith('third');
  });

  it('should respect leading: false option', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100, { leading: false });

    throttled();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should respect trailing: false option', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100, { trailing: false });

    throttled();
    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1); // No trailing call
  });
});

describe('memoize', () => {
  it('should cache function results', () => {
    const fn = vi.fn((x: number) => x * 2);
    const memoized = memoize(fn);

    expect(memoized(5)).toBe(10);
    expect(memoized(5)).toBe(10);
    expect(memoized(5)).toBe(10);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should compute for different arguments', () => {
    const fn = vi.fn((x: number) => x * 2);
    const memoized = memoize(fn);

    expect(memoized(5)).toBe(10);
    expect(memoized(10)).toBe(20);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should use custom key resolver', () => {
    const fn = vi.fn((obj: { id: number }) => obj.id * 2);
    const memoized = memoize(fn, { keyResolver: (obj) => obj.id });

    expect(memoized({ id: 1 })).toBe(2);
    expect(memoized({ id: 1 })).toBe(2);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should respect maxSize option', () => {
    const fn = vi.fn((x: number) => x * 2);
    const memoized = memoize(fn, { maxSize: 2 });

    memoized(1);
    memoized(2);
    memoized(3); // This evicts 1

    expect(fn).toHaveBeenCalledTimes(3);

    memoized(3); // Cached
    expect(fn).toHaveBeenCalledTimes(3);

    memoized(1); // Recomputed (was evicted)
    expect(fn).toHaveBeenCalledTimes(4);
  });
});

describe('lazy', () => {
  it('should lazily compute value', () => {
    const factory = vi.fn(() => 'computed');
    const lazyValue = lazy(factory);

    expect(factory).not.toHaveBeenCalled();

    expect(lazyValue()).toBe('computed');
    expect(factory).toHaveBeenCalledTimes(1);

    expect(lazyValue()).toBe('computed');
    expect(factory).toHaveBeenCalledTimes(1); // Still 1
  });
});

describe('createBatcher', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should batch multiple calls', async () => {
    const processor = vi.fn((items: number[]) => Promise.resolve(items));
    const batcher = createBatcher(processor, { maxSize: 5, maxWait: 100 });

    batcher.add(1);
    batcher.add(2);
    batcher.add(3);

    expect(processor).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    await Promise.resolve(); // Flush microtasks

    expect(processor).toHaveBeenCalledWith([1, 2, 3]);
  });

  it('should flush when maxSize is reached', async () => {
    const processor = vi.fn((items: number[]) => Promise.resolve(items));
    const batcher = createBatcher(processor, { maxSize: 3, maxWait: 1000 });

    batcher.add(1);
    batcher.add(2);
    batcher.add(3); // Triggers flush

    await Promise.resolve();

    expect(processor).toHaveBeenCalledWith([1, 2, 3]);
  });
});
