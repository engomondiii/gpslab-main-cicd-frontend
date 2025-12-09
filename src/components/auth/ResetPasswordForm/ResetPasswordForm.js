/**
 * GPS Lab Platform - ResetPasswordForm Component
 * 
 * New password form for completing password reset.
 * Includes password strength validation.
 * 
 * @module components/auth/ResetPasswordForm/ResetPasswordForm
 */

import React, { useState, useCallback } from 'react';
import './ResetPasswordForm.css';

/**
 * Password strength requirements
 */
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecial: /[!@#$%^&*(),.?":{}|<>]/
};

/**
 * Check password strength
 */
const checkPasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'None', color: 'neutral' };
  
  let score = 0;
  
  if (password.length >= PASSWORD_REQUIREMENTS.minLength) score++;
  if (password.length >= 12) score++;
  if (PASSWORD_REQUIREMENTS.hasUppercase.test(password)) score++;
  if (PASSWORD_REQUIREMENTS.hasLowercase.test(password)) score++;
  if (PASSWORD_REQUIREMENTS.hasNumber.test(password)) score++;
  if (PASSWORD_REQUIREMENTS.hasSpecial.test(password)) score++;
  
  if (score <= 2) return { score, label: 'Weak', color: 'error' };
  if (score <= 4) return { score, label: 'Medium', color: 'warning' };
  return { score, label: 'Strong', color: 'success' };
};

/**
 * Validate reset password form
 */
const validateResetForm = (values) => {
  const errors = {};
  
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.password = `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`;
  }
  
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return errors;
};

/**
 * ResetPasswordForm Component
 */
const ResetPasswordForm = ({
  onSubmit,
  onBackToLogin,
  isLoading = false,
  error = '',
  success = false,
  token = '',
  submitText = 'Reset Password',
  className = '',
  ...props
}) => {
  
  // Form state
  const [values, setValues] = useState({
    password: '',
    confirmPassword: ''
  });
  
  // Validation errors
  const [errors, setErrors] = useState({});
  
  // Field touched state
  const [touched, setTouched] = useState({});
  
  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password strength
  const passwordStrength = checkPasswordStrength(values.password);
  
  /**
   * Handle input change
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);
  
  /**
   * Handle blur
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    const fieldErrors = validateResetForm(values);
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
    
    const validationErrors = validateResetForm(values);
    setErrors(validationErrors);
    setTouched({ password: true, confirmPassword: true });
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    if (onSubmit) {
      onSubmit({
        password: values.password,
        token
      });
    }
  }, [values, token, onSubmit]);
  
  const classNames = ['reset-password-form', className].filter(Boolean).join(' ');
  
  // Success State
  if (success) {
    return (
      <div className={`${classNames} reset-password-form--success`} {...props}>
        <div className="reset-password-form__success-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
          </svg>
        </div>
        <h3 className="reset-password-form__success-title">Password Reset Complete!</h3>
        <p className="reset-password-form__success-text">
          Your password has been successfully reset. You can now sign in with your new password.
        </p>
        <button
          type="button"
          onClick={onBackToLogin}
          className="reset-password-form__success-btn"
        >
          Sign In Now
        </button>
      </div>
    );
  }
  
  return (
    <form className={classNames} onSubmit={handleSubmit} noValidate {...props}>
      {/* Description */}
      <p className="reset-password-form__description">
        Enter your new password below. Make sure it's at least 8 characters and includes a mix of letters, numbers, and symbols.
      </p>
      
      {/* Global Error Message */}
      {error && (
        <div className="reset-password-form__error-banner" role="alert">
          <svg viewBox="0 0 20 20" fill="currentColor" className="reset-password-form__error-icon">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {/* New Password Field */}
      <div className={`reset-password-form__field ${touched.password && errors.password ? 'reset-password-form__field--error' : ''}`}>
        <label htmlFor="reset-password" className="reset-password-form__label">
          New Password
        </label>
        <div className="reset-password-form__input-wrapper">
          <svg viewBox="0 0 20 20" fill="currentColor" className="reset-password-form__input-icon">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
          </svg>
          <input
            type={showPassword ? 'text' : 'password'}
            id="reset-password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter new password"
            autoComplete="new-password"
            disabled={isLoading}
            aria-invalid={touched.password && errors.password ? 'true' : 'false'}
            className="reset-password-form__input"
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="reset-password-form__password-toggle"
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
        
        {/* Password Strength Indicator */}
        {values.password && (
          <div className="reset-password-form__strength">
            <div className="reset-password-form__strength-bar">
              <div 
                className={`reset-password-form__strength-fill reset-password-form__strength-fill--${passwordStrength.color}`}
                style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
              />
            </div>
            <span className={`reset-password-form__strength-label reset-password-form__strength-label--${passwordStrength.color}`}>
              {passwordStrength.label}
            </span>
          </div>
        )}
        
        {touched.password && errors.password && (
          <span className="reset-password-form__error" role="alert">{errors.password}</span>
        )}
      </div>
      
      {/* Confirm Password Field */}
      <div className={`reset-password-form__field ${touched.confirmPassword && errors.confirmPassword ? 'reset-password-form__field--error' : ''}`}>
        <label htmlFor="reset-confirmPassword" className="reset-password-form__label">
          Confirm New Password
        </label>
        <div className="reset-password-form__input-wrapper">
          <svg viewBox="0 0 20 20" fill="currentColor" className="reset-password-form__input-icon">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
          </svg>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="reset-confirmPassword"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Confirm new password"
            autoComplete="new-password"
            disabled={isLoading}
            aria-invalid={touched.confirmPassword && errors.confirmPassword ? 'true' : 'false'}
            className="reset-password-form__input"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(prev => !prev)}
            className="reset-password-form__password-toggle"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showConfirmPassword ? (
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
        
        {/* Password Match Indicator */}
        {values.confirmPassword && values.password === values.confirmPassword && (
          <div className="reset-password-form__match">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            <span>Passwords match</span>
          </div>
        )}
        
        {touched.confirmPassword && errors.confirmPassword && (
          <span className="reset-password-form__error" role="alert">{errors.confirmPassword}</span>
        )}
      </div>
      
      {/* Password Requirements */}
      <div className="reset-password-form__requirements">
        <p className="reset-password-form__requirements-title">Password must contain:</p>
        <ul className="reset-password-form__requirements-list">
          <li className={values.password.length >= 8 ? 'met' : ''}>
            At least 8 characters
          </li>
          <li className={PASSWORD_REQUIREMENTS.hasUppercase.test(values.password) ? 'met' : ''}>
            One uppercase letter
          </li>
          <li className={PASSWORD_REQUIREMENTS.hasLowercase.test(values.password) ? 'met' : ''}>
            One lowercase letter
          </li>
          <li className={PASSWORD_REQUIREMENTS.hasNumber.test(values.password) ? 'met' : ''}>
            One number
          </li>
          <li className={PASSWORD_REQUIREMENTS.hasSpecial.test(values.password) ? 'met' : ''}>
            One special character
          </li>
        </ul>
      </div>
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="reset-password-form__submit"
      >
        {isLoading ? (
          <>
            <span className="reset-password-form__submit-spinner" />
            <span>Resetting...</span>
          </>
        ) : (
          <>
            <svg viewBox="0 0 20 20" fill="currentColor" className="reset-password-form__submit-icon">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
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
        className="reset-password-form__back-link"
      >
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
        </svg>
        <span>Back to Login</span>
      </button>
    </form>
  );
};

export { validateResetForm, checkPasswordStrength, PASSWORD_REQUIREMENTS };
export default ResetPasswordForm;