/**
 * GPS Lab Platform - ErrorPage Component
 * 
 * Generic error page for handling various error states.
 * 
 * @module pages/ErrorPage/ErrorPage
 */

import React from 'react';
import './ErrorPage.css';

/**
 * Error types with their configurations
 */
const ERROR_CONFIGS = {
  '500': {
    code: '500',
    title: 'Server Error',
    message: 'Something went wrong on our end. Our team has been notified and is working to fix it.',
    icon: 'server'
  },
  '503': {
    code: '503',
    title: 'Service Unavailable',
    message: 'GPS Lab is temporarily unavailable for maintenance. Please try again in a few minutes.',
    icon: 'maintenance'
  },
  'network': {
    code: null,
    title: 'Connection Lost',
    message: 'Unable to connect to GPS Lab. Please check your internet connection and try again.',
    icon: 'network'
  },
  'auth': {
    code: '401',
    title: 'Session Expired',
    message: 'Your session has expired. Please sign in again to continue your GPS journey.',
    icon: 'auth'
  },
  'default': {
    code: null,
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
    icon: 'default'
  }
};

/**
 * Error icons
 */
const ErrorIcon = ({ type }) => {
  switch (type) {
    case 'server':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 1h16c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2zm0 8h16c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2zm0 8h16c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2zm2-12v2h2V5H6zm0 8v2h2v-2H6zm0 8v2h2v-2H6z"/>
        </svg>
      );
    case 'maintenance':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
        </svg>
      );
    case 'network':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-.61.08-1.21.21-1.78L8.99 15v1c0 1.1.9 2 2 2v1.93C7.06 19.43 4 16.07 4 12zm13.89 5.4c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41C17.92 5.77 20 8.65 20 12c0 2.08-.81 3.98-2.11 5.4z"/>
          <path d="M2.5 4.5l19 19" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case 'auth':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      );
  }
};

/**
 * ErrorPage Component
 */
const ErrorPage = ({
  errorType = 'default',
  errorCode,
  title,
  message,
  details,
  onRetry,
  onGoHome,
  onReportIssue,
  showRetry = true,
  showReportIssue = true,
  className = '',
  ...props
}) => {
  
  // Get error configuration
  const config = ERROR_CONFIGS[errorType] || ERROR_CONFIGS.default;
  const displayCode = errorCode || config.code;
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;
  
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };
  
  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };
  
  const handleReportIssue = () => {
    if (onReportIssue) {
      onReportIssue();
    } else {
      window.location.href = '/help/support';
    }
  };
  
  const classNames = ['error-page', `error-page--${errorType}`, className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      <div className="error-page__content">
        {/* Error Icon */}
        <div className="error-page__icon-wrapper">
          <div className="error-page__icon">
            <ErrorIcon type={config.icon} />
          </div>
          <div className="error-page__icon-pulse" />
        </div>
        
        {/* Error Code */}
        {displayCode && (
          <div className="error-page__code">
            Error {displayCode}
          </div>
        )}
        
        {/* Title & Message */}
        <h1 className="error-page__title">{displayTitle}</h1>
        <p className="error-page__message">{displayMessage}</p>
        
        {/* Error Details (for debugging) */}
        {details && process.env.NODE_ENV === 'development' && (
          <details className="error-page__details">
            <summary>Technical Details</summary>
            <pre>{typeof details === 'string' ? details : JSON.stringify(details, null, 2)}</pre>
          </details>
        )}
        
        {/* Actions */}
        <div className="error-page__actions">
          {showRetry && (
            <button
              type="button"
              onClick={handleRetry}
              className="error-page__btn error-page__btn--primary"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
              </svg>
              Try Again
            </button>
          )}
          
          <button
            type="button"
            onClick={handleGoHome}
            className="error-page__btn error-page__btn--secondary"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
            Go Home
          </button>
        </div>
        
        {/* Report Issue */}
        {showReportIssue && (
          <div className="error-page__report">
            <p>Still having trouble?</p>
            <button
              type="button"
              onClick={handleReportIssue}
              className="error-page__report-link"
            >
              Report this issue
            </button>
          </div>
        )}
      </div>
      
      {/* Background Animation */}
      <div className="error-page__bg">
        <div className="error-page__bg-circle error-page__bg-circle--1" />
        <div className="error-page__bg-circle error-page__bg-circle--2" />
      </div>
    </div>
  );
};

export { ERROR_CONFIGS };
export default ErrorPage;