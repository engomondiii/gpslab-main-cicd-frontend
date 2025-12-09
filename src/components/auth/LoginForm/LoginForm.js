/**
 * GPS Lab Platform - LoginForm Component
 * 
 * Login form with email/password authentication.
 * Includes validation, error handling, and remember me functionality.
 * 
 * @module components/auth/LoginForm/LoginForm
 */

import React, { useState, useCallback } from 'react';
import './LoginForm.css';

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate login form fields
 */
const validateLoginForm = (values) => {
  const errors = {};
  
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  
  return errors;
};

/**
 * LoginForm Component
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Form submission handler
 * @param {Function} props.onForgotPassword - Forgot password link handler
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Global error message
 * @param {boolean} props.showRememberMe - Show remember me checkbox
 * @param {boolean} props.showForgotPassword - Show forgot password link
 * @param {string} props.submitText - Submit button text
 */
const LoginForm = ({
  onSubmit,
  onForgotPassword,
  isLoading = false,
  error = '',
  showRememberMe = true,
  showForgotPassword = true,
  submitText = 'Sign In',
  className = '',
  ...props
}) => {
  
  // Form state
  const [values, setValues] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  // Validation errors
  const [errors, setErrors] = useState({});
  
  // Field touched state
  const [touched, setTouched] = useState({});
  
  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  
  /**
   * Handle input change
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);
  
  /**
   * Handle field blur (touched state)
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field on blur
    const fieldErrors = validateLoginForm(values);
    if (fieldErrors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors[name]
      }));
    }
  }, [values]);
  
  /**
   * Handle form submission
   */
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    // Validate all fields
    const validationErrors = validateLoginForm(values);
    setErrors(validationErrors);
    setTouched({ email: true, password: true });
    
    // Don't submit if there are errors
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    // Call onSubmit handler
    if (onSubmit) {
      onSubmit({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        rememberMe: values.rememberMe
      });
    }
  }, [values, onSubmit]);
  
  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);
  
  const classNames = ['login-form', className].filter(Boolean).join(' ');
  
  return (
    <form className={classNames} onSubmit={handleSubmit} noValidate {...props}>
      {/* Global Error Message */}
      {error && (
        <div className="login-form__error-banner" role="alert">
          <svg viewBox="0 0 20 20" fill="currentColor" className="login-form__error-icon">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {/* Email Field */}
      <div className={`login-form__field ${touched.email && errors.email ? 'login-form__field--error' : ''}`}>
        <label htmlFor="login-email" className="login-form__label">
          Email Address
        </label>
        <div className="login-form__input-wrapper">
          <svg viewBox="0 0 20 20" fill="currentColor" className="login-form__input-icon">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
          </svg>
          <input
            type="email"
            id="login-email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isLoading}
            aria-invalid={touched.email && errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            className="login-form__input"
          />
        </div>
        {touched.email && errors.email && (
          <span id="login-email-error" className="login-form__error" role="alert">
            {errors.email}
          </span>
        )}
      </div>
      
      {/* Password Field */}
      <div className={`login-form__field ${touched.password && errors.password ? 'login-form__field--error' : ''}`}>
        <label htmlFor="login-password" className="login-form__label">
          Password
        </label>
        <div className="login-form__input-wrapper">
          <svg viewBox="0 0 20 20" fill="currentColor" className="login-form__input-icon">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
          </svg>
          <input
            type={showPassword ? 'text' : 'password'}
            id="login-password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={isLoading}
            aria-invalid={touched.password && errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            className="login-form__input"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="login-form__password-toggle"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
            )}
          </button>
        </div>
        {touched.password && errors.password && (
          <span id="login-password-error" className="login-form__error" role="alert">
            {errors.password}
          </span>
        )}
      </div>
      
      {/* Remember Me & Forgot Password Row */}
      {(showRememberMe || showForgotPassword) && (
        <div className="login-form__options">
          {showRememberMe && (
            <label className="login-form__remember">
              <input
                type="checkbox"
                name="rememberMe"
                checked={values.rememberMe}
                onChange={handleChange}
                disabled={isLoading}
                className="login-form__checkbox"
              />
              <span className="login-form__checkbox-custom" />
              <span className="login-form__remember-text">Remember me</span>
            </label>
          )}
          
          {showForgotPassword && (
            <button
              type="button"
              onClick={onForgotPassword}
              className="login-form__forgot"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          )}
        </div>
      )}
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="login-form__submit"
      >
        {isLoading ? (
          <>
            <span className="login-form__submit-spinner" />
            <span>Signing in...</span>
          </>
        ) : (
          submitText
        )}
      </button>
    </form>
  );
};

export { validateLoginForm };
export default LoginForm;