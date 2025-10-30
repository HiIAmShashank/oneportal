/**
 * RemoteErrorBoundary Component
 *
 * React Error Boundary specifically designed for Module Federation remote apps.
 * Catches rendering errors from dynamically loaded remote modules and displays
 * a user-friendly fallback UI with recovery options.
 */

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

interface Props {
  /** Child components to render */
  children: ReactNode;

  /** Optional custom fallback to render on error */
  fallback?: ReactNode;

  /** Callback when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;

  /** Name of the remote module for better error messages */
  remoteName?: string;

  /** Optional reset callback (defaults to page reload) */
  onReset?: () => void;

  /** Show "Go Home" button in error state */
  showHomeButton?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Error Boundary for Module Federation Remote Apps
 *
 * Prevents a single remote app crash from taking down the entire shell application.
 * Provides recovery options and detailed error information for debugging.
 */
export class RemoteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    };
  }

  /**
   * Update state when an error is caught
   */
  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error details and invoke callback
   */
  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[RemoteErrorBoundary] Remote module error:", {
      remoteName: this.props.remoteName,
      error: {
        message: error.message,
        stack: error.stack,
      },
      errorInfo: {
        componentStack: errorInfo.componentStack,
      },
    });

    // Store errorInfo in state for debugging
    this.setState({ errorInfo });

    // Invoke optional callback
    this.props.onError?.(error, errorInfo);
  }

  /**
   * Reset error boundary state (attempt recovery)
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });

    // Invoke custom reset handler or reload
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  /**
   * Navigate to home page
   */
  handleGoHome = () => {
    window.location.href = "/";
  };

  /**
   * Reload the entire page
   */
  handleReload = () => {
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { remoteName } = this.props;
      const errorMessage =
        this.state.error?.message || "An unexpected error occurred";
      const showDetails = import.meta.env.DEV && this.state.errorInfo;

      // Default fallback UI with enhanced Tailwind styling
      return (
        <div className="flex min-h-[400px] w-full items-center justify-center p-6">
          <div className="w-full max-w-2xl space-y-4">
            {/* Main Error Card */}
            <div className="overflow-hidden rounded-lg border border-red-200 bg-white shadow-xs dark:border-red-900/50 dark:bg-gray-950">
              {/* Header */}
              <div className="border-b border-red-200 bg-red-50 px-6 py-4 dark:border-red-900/50 dark:bg-red-950/20">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 rounded-full bg-red-100 p-2.5 dark:bg-red-900/30">
                    <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                      {remoteName
                        ? `Failed to Load ${remoteName}`
                        : "Module Loading Error"}
                    </h3>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                      The application module encountered an error and couldn't
                      be loaded
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              <div className="px-6 py-4">
                <div className="rounded-md bg-gray-50 border border-gray-200 px-4 py-3 dark:bg-gray-900 dark:border-gray-800">
                  <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                    {errorMessage}
                  </p>
                </div>

                {/* Development Error Details */}
                {showDetails && this.state.errorInfo && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                      View Component Stack
                    </summary>
                    <pre className="mt-2 overflow-x-auto rounded-md bg-gray-900 p-4 text-xs text-gray-100">
                      <code>{this.state.errorInfo.componentStack}</code>
                    </pre>
                  </details>
                )}
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/50">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={this.handleReset}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </button>

                  <button
                    onClick={this.handleReload}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-xs transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reload Page
                  </button>

                  {this.props.showHomeButton && (
                    <button
                      onClick={this.handleGoHome}
                      className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-xs transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <Home className="h-4 w-4" />
                      Go Home
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Help Text */}
            <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 dark:bg-blue-950/20 dark:border-blue-900/50">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong className="font-semibold">What happened?</strong> This
                module failed to load or encountered an error during rendering.
                The rest of the application should continue to work normally.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC wrapper for easier usage with remote components
 *
 * @example
 * ```tsx
 * const SafeRemoteApp = withRemoteErrorBoundary(RemoteApp, 'billing');
 * ```
 */
export function withRemoteErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  remoteName: string,
  options?: {
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    onReset?: () => void;
    showHomeButton?: boolean;
  },
) {
  return function ErrorBoundaryWrapper(props: P) {
    return (
      <RemoteErrorBoundary
        remoteName={remoteName}
        onError={options?.onError}
        onReset={options?.onReset}
        showHomeButton={options?.showHomeButton}
      >
        <Component {...props} />
      </RemoteErrorBoundary>
    );
  };
}
