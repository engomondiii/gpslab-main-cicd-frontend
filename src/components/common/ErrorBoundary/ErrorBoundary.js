/**
 * GPS Lab Platform - ErrorBoundary Component
 * 
 * React error boundary for catching and handling component errors.
 * 
 * @module components/common/ErrorBoundary/ErrorBoundary
 * @version 1.0.0
 */

import React, { Component } from 'react';
import './ErrorBoundary.css';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ErrorBoundary component
 * 
 * @class
 * @extends Component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.fallback] - Custom fallback UI
 * @param {Function} [props.onError] - Error callback
 * @param {Function} [props.onReset] - Reset callback
 * @param {boolean} [props.showDetails=false] - Show error details
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    
    // Call error callback
    this.props.onError?.(error, errorInfo);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }
  
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    this.props.onReset?.();
  };
  
  render() {
    const { hasError, error, errorInfo } = this.state;
    const { fallback, showDetails = false, children } = this.props;
    
    if (hasError) {
      // Custom fallback
      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback({ error, errorInfo, reset: this.handleReset });
        }
        return fallback;
      }
      
      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="error-boundary__title">Something went wrong</h2>
          
          <p className="error-boundary__description">
            We're sorry, but something unexpected happened. Please try again or contact support if the problem persists.
          </p>
          
          {showDetails && error && (
            <details className="error-boundary__details">
              <summary>Error Details</summary>
              <pre className="error-boundary__stack">
                {error.toString()}
                {errorInfo?.componentStack}
              </pre>
            </details>
          )}
          
          <div className="error-boundary__actions">
            <button
              type="button"
              className="error-boundary__btn error-boundary__btn--primary"
              onClick={this.handleReset}
            >
              Try Again
            </button>
            <button
              type="button"
              className="error-boundary__btn error-boundary__btn--secondary"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    
    return children;
  }
}

// =============================================================================
// FUNCTIONAL WRAPPER
// =============================================================================

/**
 * withErrorBoundary HOC
 */
export const withErrorBoundary = (WrappedComponent, errorBoundaryProps = {}) => {
  const WithErrorBoundary = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );
  
  WithErrorBoundary.displayName = `WithErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
  return WithErrorBoundary;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default ErrorBoundary;