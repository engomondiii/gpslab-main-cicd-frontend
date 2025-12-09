/**
 * GPS Lab Platform - ForgotPasswordForm Component
 * 
 * Password reset request form.
 * Sends reset link to user's email.
 * 
 * @module components/auth/ForgotPasswordForm/ForgotPasswordForm
 */

import React, { useState, useCallback } from 'react';
import './ForgotPasswordForm.css';

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * ForgotPasswordForm Component
 */
const ForgotPasswordForm = ({
  onSubmit,
  onBackToLogin,
  isLoading = false,
  error = '',
  success = false,
  submitText = 'Send Reset Link',
  className = '',
  ...props
}) => {
  
  // Form state
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [touched, setTouched] = useState(false);
  
  /**
   * Validate email
   */
  const validateEmail = useCallback((value) => {
    if (!value) {
      return 'Email is required';
    }
    if (!EMAIL_REGEX.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  }, []);
  
  /**
   * Handle input change
   */
  const handleChange = useCallback((e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (emailError) {
      setEmailError('');
    }
  }, [emailError]);
  
  /**
   * Handle blur
   */
  const handleBlur = useCallback(() => {
    setTouched(true);
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
    }
  }, [email, validateEmail]);
  
  /**
   * Handle form submission
   */
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    setTouched(true);
    const error = validateEmail(email);
    
    if (error) {
      setEmailError(error);
      return;
    }
    
    if (onSubmit) {
      onSubmit({ email: email.trim().toLowerCase() });
    }
  }, [email, validateEmail, onSubmit]);
  
  const classNames = ['forgot-password-form', className].filter(Boolean).join(' ');
  
  // Success State
  if (success) {
    return (
      <div className={`${classNames} forgot-password-form--success`} {...props}>
        <div className="forgot-password-form__success-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </div>
        <h3 className="forgot-password-form__success-title">Check Your Email</h3>
        <p className="forgot-password-form__success-text">
          We've sent a password reset link to <strong>{email}</strong>.
          Please check your inbox and follow the instructions.
        </p>
        <div className="forgot-password-form__success-note">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          <span>Didn't receive the email? Check your spam folder or try again.</span>
        </div>
        <div className="forgot-password-form__success-actions">
          <button
            type="button"
            onClick={() => {
              setEmail('');
              setTouched(false);
              if (onSubmit) onSubmit({ resend: true, email: email.trim().toLowerCase() });
            }}
            className="forgot-password-form__resend"
          >
            Resend Email
          </button>
          <button
            type="button"
            onClick={onBackToLogin}
            className="forgot-password-form__back"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <form className={classNames} onSubmit={handleSubmit} noValidate {...props}>
      {/* Description */}
      <p className="forgot-password-form__description">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      
      {/* Global Error Message */}
      {error && (
        <div className="forgot-password-form__error-banner" role="alert">
          <svg viewBox="0 0 20 20" fill="currentColor" className="forgot-password-form__error-icon">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {/* Email Field */}
      <div className={`forgot-password-form__field ${touched && emailError ? 'forgot-password-form__field--error' : ''}`}>
        <label htmlFor="forgot-email" className="forgot-password-form__label">
          Email Address
        </label>
        <div className="forgot-password-form__input-wrapper">
          <svg viewBox="0 0 20 20" fill="currentColor" className="forgot-password-form__input-icon">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
          </svg>
          <input
            type="email"
            id="forgot-email"
            name="email"
            value={email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isLoading}
            aria-invalid={touched && emailError ? 'true' : 'false'}
            aria-describedby={emailError ? 'forgot-email-error' : undefined}
            className="forgot-password-form__input"
          />
        </div>
        {touched && emailError && (
          <span id="forgot-email-error" className="forgot-password-form__error" role="alert">
            {emailError}
          </span>
        )}
      </div>
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="forgot-password-form__submit"
      >
        {isLoading ? (
          <>
            <span className="forgot-password-form__submit-spinner" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <svg viewBox="0 0 20 20" fill="currentColor" className="forgot-password-form__submit-icon">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
            <span>{submitText}</span>
          </>
        )}
      </button>
      
      {/* Back to Login Link */}
      <button
        type="button"
        onClick={onBackToLogin}
        disabled={isLoading}
        className="forgot-password-form__back-link"
      >
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
        </svg>
        <span>Back to Login</span>
      </button>
    </form>
  );
};

export default ForgotPasswordForm;