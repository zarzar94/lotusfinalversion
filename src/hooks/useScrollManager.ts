/**
 * useScrollManager - Consolidated scroll event management
 *
 * Uses a single scroll listener with subscription pattern to avoid
 * multiple event listeners across components. Improves performance
 * especially on older devices.
 */

import { useEffect, useRef, useSyncExternalStore, useCallback } from 'react';

interface ScrollState {
  scrollY: number;
  scrollX: number;
  progress: number;
  direction: 'up' | 'down' | null;
  isAtTop: boolean;
  isAtBottom: boolean;
}

type ScrollListener = (state: ScrollState) => void;

// Singleton scroll manager
class ScrollManager {
  private listeners = new Set<ScrollListener>();
  private state: ScrollState = {
    scrollY: 0,
    scrollX: 0,
    progress: 0,
    direction: null,
    isAtTop: true,
    isAtBottom: false,
  };
  private lastScrollY = 0;
  private rafId: number | null = null;
  private initialized = false;

  private calculateState(): ScrollState {
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const maxScroll = documentHeight - windowHeight;

    const progress = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;
    const direction = scrollY > this.lastScrollY ? 'down' : scrollY < this.lastScrollY ? 'up' : this.state.direction;

    this.lastScrollY = scrollY;

    return {
      scrollY,
      scrollX,
      progress,
      direction,
      isAtTop: scrollY <= 0,
      isAtBottom: scrollY >= maxScroll - 1,
    };
  }

  private handleScroll = () => {
    if (this.rafId !== null) return;

    this.rafId = requestAnimationFrame(() => {
      this.state = this.calculateState();
      this.listeners.forEach(listener => listener(this.state));
      this.rafId = null;
    });
  };

  subscribe(listener: ScrollListener): () => void {
    if (!this.initialized && typeof window !== 'undefined') {
      this.state = this.calculateState();
      window.addEventListener('scroll', this.handleScroll, { passive: true });
      this.initialized = true;
    }

    this.listeners.add(listener);

    // Immediately call with current state
    listener(this.state);

    return () => {
      this.listeners.delete(listener);

      // Cleanup if no more listeners
      if (this.listeners.size === 0 && this.initialized) {
        window.removeEventListener('scroll', this.handleScroll);
        if (this.rafId !== null) {
          cancelAnimationFrame(this.rafId);
          this.rafId = null;
        }
        this.initialized = false;
      }
    };
  }

  getSnapshot(): ScrollState {
    return this.state;
  }

  getServerSnapshot(): ScrollState {
    return {
      scrollY: 0,
      scrollX: 0,
      progress: 0,
      direction: null,
      isAtTop: true,
      isAtBottom: false,
    };
  }
}

// Singleton instance
const scrollManager = typeof window !== 'undefined' ? new ScrollManager() : null;

/**
 * Hook to access consolidated scroll state
 * Uses useSyncExternalStore for optimal React 18 integration
 */
export function useScrollState(): ScrollState {
  const subscribe = useCallback((onStoreChange: () => void) => {
    if (!scrollManager) return () => {};
    return scrollManager.subscribe(() => onStoreChange());
  }, []);

  const getSnapshot = useCallback(() => {
    return scrollManager?.getSnapshot() ?? {
      scrollY: 0,
      scrollX: 0,
      progress: 0,
      direction: null,
      isAtTop: true,
      isAtBottom: false,
    };
  }, []);

  const getServerSnapshot = useCallback(() => ({
    scrollY: 0,
    scrollX: 0,
    progress: 0,
    direction: null as const,
    isAtTop: true,
    isAtBottom: false,
  }), []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Hook to subscribe to scroll events with a custom callback
 * Useful for components that need to react to scroll but don't need the full state
 */
export function useOnScroll(callback: (state: ScrollState) => void): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!scrollManager) return;

    return scrollManager.subscribe((state) => {
      callbackRef.current(state);
    });
  }, []);
}

/**
 * Hook that returns true when scroll position passes a threshold
 */
export function useScrollPastThreshold(threshold: number): boolean {
  const { scrollY } = useScrollState();
  return scrollY > threshold;
}

/**
 * Hook for scroll progress (0-1)
 * Can be used as a drop-in replacement for useScrollProgress
 */
export function useScrollProgressFromManager(): number {
  const { progress } = useScrollState();
  return progress;
}

export type { ScrollState };
