// ═══════════════════════════════════════════════════════════════════════════
import React, { Component, type ErrorInfo, type ReactNode } from 'react';

// ERROR TRACKING (Sentry-compatible interface)
// ═══════════════════════════════════════════════════════════════════════════

interface ErrorContext {
  userId?: string;
  email?: string;
  role?: string;
  extra?: Record<string, unknown>;
  tags?: Record<string, string>;
}

interface BreadcrumbData {
  category: string;
  message: string;
  level?: 'debug' | 'info' | 'warning' | 'error';
  data?: Record<string, unknown>;
}

interface ErrorEvent {
  id: string;
  timestamp: string;
  error: {
    name: string;
    message: string;
    stack?: string;
  };
  context: ErrorContext;
  breadcrumbs: BreadcrumbData[];
  url: string;
  userAgent: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ERROR TRACKER CLASS
// ═══════════════════════════════════════════════════════════════════════════

class ErrorTracker {
  private dsn: string | null = null;
  private enabled: boolean = false;
  private context: ErrorContext = {};
  private breadcrumbs: BreadcrumbData[] = [];
  private maxBreadcrumbs: number = 50;
  private errorQueue: ErrorEvent[] = [];
  private flushInterval: ReturnType<typeof setInterval> | null = null;

  init(options: { dsn?: string; enabled?: boolean }) {
    this.dsn = options.dsn || null;
    this.enabled = options.enabled ?? import.meta.env.PROD;

    if (this.enabled) {
      this.setupGlobalHandlers();
      this.startFlushInterval();
      console.log('Error tracking initialized');
    }
  }

  private setupGlobalHandlers() {
    // Catch unhandled errors
    window.onerror = (message, source, lineno, colno, error) => {
      this.captureException(error || new Error(String(message)), {
        extra: { source, lineno, colno },
      });
      return false;
    };

    // Catch unhandled promise rejections
    window.onunhandledrejection = (event) => {
      this.captureException(event.reason, {
        tags: { type: 'unhandledrejection' },
      });
    };

    // Track console errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.addBreadcrumb({
        category: 'console',
        message: args.map(String).join(' '),
        level: 'error',
      });
      originalConsoleError.apply(console, args);
    };
  }

  private startFlushInterval() {
    // Flush error queue every 30 seconds
    this.flushInterval = setInterval(() => {
      this.flush();
    }, 30000);
  }

  setContext(context: ErrorContext) {
    this.context = { ...this.context, ...context };
  }

  setUser(user: { id: string; email?: string; role?: string } | null) {
    if (user) {
      this.context.userId = user.id;
      this.context.email = user.email;
      this.context.role = user.role;
    } else {
      delete this.context.userId;
      delete this.context.email;
      delete this.context.role;
    }
  }

  addBreadcrumb(breadcrumb: BreadcrumbData) {
    this.breadcrumbs.push({
      ...breadcrumb,
      level: breadcrumb.level || 'info',
    });

    // Keep only last N breadcrumbs
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs = this.breadcrumbs.slice(-this.maxBreadcrumbs);
    }
  }

  captureException(error: Error | unknown, additionalContext?: Partial<ErrorContext>) {
    if (!this.enabled) {
      console.error('Error captured (tracking disabled):', error);
      return;
    }

    const err = error instanceof Error ? error : new Error(String(error));

    const event: ErrorEvent = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      error: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
      context: {
        ...this.context,
        ...additionalContext,
        extra: {
          ...this.context.extra,
          ...additionalContext?.extra,
        },
        tags: {
          ...this.context.tags,
          ...additionalContext?.tags,
        },
      },
      breadcrumbs: [...this.breadcrumbs],
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.errorQueue.push(event);

    // Log to console in development
    if (import.meta.env.DEV) {
      console.group('Error Captured');
      console.error(err);
      console.log('Context:', event.context);
      console.log('Breadcrumbs:', event.breadcrumbs);
      console.groupEnd();
    }

    // Immediately flush critical errors
    if (this.errorQueue.length >= 10) {
      this.flush();
    }
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    this.addBreadcrumb({
      category: 'message',
      message,
      level,
    });

    if (level === 'error') {
      this.captureException(new Error(message));
    }
  }

  async flush() {
    if (this.errorQueue.length === 0) return;

    const events = [...this.errorQueue];
    this.errorQueue = [];

    // In production, send to error tracking service
    if (this.dsn) {
      try {
        await fetch(this.dsn, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ events }),
        });
      } catch (err) {
        // Re-queue on failure
        this.errorQueue.push(...events);
        console.warn('Failed to send error events:', err);
      }
    } else {
      // Store locally if no DSN configured
      this.storeLocally(events);
    }
  }

  private storeLocally(events: ErrorEvent[]) {
    try {
      const stored = localStorage.getItem('lotus_error_log') || '[]';
      const existing = JSON.parse(stored) as ErrorEvent[];
      const combined = [...existing, ...events].slice(-100); // Keep last 100
      localStorage.setItem('lotus_error_log', JSON.stringify(combined));
    } catch {
      // Ignore storage errors
    }
  }

  getLocalErrors(): ErrorEvent[] {
    try {
      const stored = localStorage.getItem('lotus_error_log') || '[]';
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  clearLocalErrors() {
    localStorage.removeItem('lotus_error_log');
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flush();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════

export const errorTracker = new ErrorTracker();

// ═══════════════════════════════════════════════════════════════════════════
// REACT ERROR BOUNDARY
// ═══════════════════════════════════════════════════════════════════════════

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class TrackedErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    errorTracker.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
      tags: {
        type: 'react_error_boundary',
      },
    });

    this.props.onError?.(error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error, this.reset);
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>{this.state.error.message}</p>
          <button onClick={this.reset}>Try Again</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export const captureException = errorTracker.captureException.bind(errorTracker);
export const captureMessage = errorTracker.captureMessage.bind(errorTracker);
export const addBreadcrumb = errorTracker.addBreadcrumb.bind(errorTracker);
export const setUser = errorTracker.setUser.bind(errorTracker);
export const setContext = errorTracker.setContext.bind(errorTracker);

export default errorTracker;
