/**
 * GPS Lab Platform - AppleLogin Component
 * 
 * Apple OAuth login button.
 * 
 * @module components/auth/OAuthButtons/AppleLogin
 */

import React from 'react';
import './AppleLogin.css';

/**
 * AppleLogin Component
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onLogin - Login handler
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.text - Button text
 * @param {string} props.variant - Button variant (default, outline)
 */
const AppleLogin = ({
  onLogin,
  isLoading = false,
  disabled = false,
  text = 'Continue with Apple',
  variant = 'default',
  className = '',
  ...props
}) => {
  
  const handleClick = () => {
    if (!isLoading && !disabled && onLogin) {
      onLogin('apple');
    }
  };
  
  const classNames = [
    'apple-login',
    `apple-login--${variant}`,
    isLoading && 'apple-login--loading',
    disabled && 'apple-login--disabled',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading || disabled}
      className={classNames}
      aria-label="Sign in with Apple"
      {...props}
    >
      {isLoading ? (
        <span className="apple-login__spinner" />
      ) : (
        <svg className="apple-login__icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
        </svg>
      )}
      <span className="apple-login__text">{isLoading ? 'Connecting...' : text}</span>
    </button>
  );
};

export default AppleLogin;