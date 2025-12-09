/**
 * GPS Lab Platform - RegisterForm Component
 * 
 * Registration form with full validation.
 * Includes name, email, password, and terms acceptance.
 * 
 * @module components/auth/RegisterForm/RegisterForm
 */

import React, { useState, useCallback } from 'react';
import './RegisterForm.css';

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
 * Validate registration form fields
 */
const validateRegisterForm = (values) => {
  const errors = {};
  
  // First Name
  if (!values.firstName) {
    errors.firstName = 'First name is required';
  } else if (values.firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }
  
  // Last Name
  if (!values.lastName) {
    errors.lastName = 'Last name is required';
  } else if (values.lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }
  
  // Email
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(values.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Password
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.password = `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`;
  }
  
  // Confirm Password
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  // Terms Acceptance
  if (!values.acceptTerms) {
    errors.acceptTerms = 'You must accept the terms and conditions';
  }
  
  return errors;
};

/**
 * RegisterForm Component
 */
const RegisterForm = ({
  onSubmit,
  isLoading = false,
  error = '',
  termsUrl = '/terms',
  privacyUrl = '/privacy',
  submitText = 'Create Account',
  className = '',
  ...props
}) => {
  
  // Form state
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: false
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
   * Handle field blur
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    // Validate field on blur
    const fieldErrors = validateRegisterForm(values);
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
    const validationErrors = validateRegisterForm(values);
    setErrors(validationErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
      acceptTerms: true
    });
    
    // Don't submit if there are errors
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    // Call onSubmit handler
    if (onSubmit) {
      onSubmit({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        newsletter: values.newsletter
      });
    }
  }, [values, onSubmit]);
  
  const classNames = ['register-form', className].filter(Boolean).join(' ');
  
  return (
    <form className={classNames} onSubmit={handleSubmit} noValidate {...props}>
      {/* Global Error Message */}
      {error && (
        <div className="register-form__error-banner" role="alert">
          <svg viewBox="0 0 20 20" fill="currentColor" className="register-form__error-icon">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {/* Name Row */}
      <div className="register-form__row">
        {/* First Name */}
        <div className={`register-form__field ${touched.firstName && errors.firstName ? 'register-form__field--error' : ''}`}>
          <label htmlFor="register-firstName" className="register-form__label">
            First Name
          </label>
          <input
            type="text"
            id="register-firstName"
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="John"
            autoComplete="given-name"
            disabled={isLoading}
            aria-invalid={touched.firstName && errors.firstName ? 'true' : 'false'}
            className="register-form__input"
          />
          {touched.firstName && errors.firstName && (
            <span className="register-form__error" role="alert">{errors.firstName}</span>
          )}
        </div>
        
        {/* Last Name */}
        <div className={`register-form__field ${touched.lastName && errors.lastName ? 'register-form__field--error' : ''}`}>
          <label htmlFor="register-lastName" className="register-form__label">
            Last Name
          </label>
          <input
            type="text"
            id="register-lastName"
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Doe"
            autoComplete="family-name"
            disabled={isLoading}
            aria-invalid={touched.lastName && errors.lastName ? 'true' : 'false'}
            className="register-form__input"
          />
          {touched.lastName && errors.lastName && (
            <span className="register-form__error" role="alert">{errors.lastName}</span>
          )}
        </div>
      </div>
      
      {/* Email Field */}
      <div className={`register-form__field ${touched.email && errors.email ? 'register-form__field--error' : ''}`}>
        <label htmlFor="register-email" className="register-form__label">
          Email Address
        </label>
        <div className="register-form__input-wrapper">
          <svg viewBox="0 0 20 20" fill="currentColor" className="register-form__input-icon">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
          </svg>
          <input
            type="email"
            id="register-email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isLoading}
            aria-invalid={touched.email && errors.email ? 'true' : 'false'}
            className="register-form__input register-form__input--with-icon"
          />
        </div>
        {touched.email && errors.email && (
          <span className="register-form__error" role="alert">{errors.email}</span>
        )}
      </div>
      
      {/* Password Field */}
      <div className={`register-form__field ${touched.password && errors.password ? 'register-form__field--error' : ''}`}>
        <label htmlFor="register-password" className="register-form__label">
          Password
        </label>
        <div className="register-form__input-wrapper">
          <svg viewBox="0 0 20 20" fill="currentColor" className="register-form__input-icon">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
          </svg>
          <input
            type={showPassword ? 'text' : 'password'}
            id="register-password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Create a strong password"
            autoComplete="new-password"
            disabled={isLoading}
            aria-invalid={touched.password && errors.password ? 'true' : 'false'}
            className="register-form__input register-form__input--with-icon"
          />
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="register-form__password-toggle"
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
          <div className="register-form__strength">
            <div className="register-form__strength-bar">
              <div 
                className={`register-form__strength-fill register-form__strength-fill--${passwordStrength.color}`}
                style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
              />
            </div>
            <span className={`register-form__strength-label register-form__strength-label--${passwordStrength.color}`}>
              {passwordStrength.label}
            </span>
          </div>
        )}
        
        {touched.password && errors.password && (
          <span className="register-form__error" role="alert">{errors.password}</span>
        )}
      </div>
      
      {/* Confirm Password Field */}
      <div className={`register-form__field ${touched.confirmPassword && errors.confirmPassword ? 'register-form__field--error' : ''}`}>
        <label htmlFor="register-confirmPassword" className="register-form__label">
          Confirm Password
        </label>
        <div className="register-form__input-wrapper">
          <svg viewBox="0 0 20 20" fill="currentColor" className="register-form__input-icon">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
          </svg>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="register-confirmPassword"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Confirm your password"
            autoComplete="new-password"
            disabled={isLoading}
            aria-invalid={touched.confirmPassword && errors.confirmPassword ? 'true' : 'false'}
            className="register-form__input register-form__input--with-icon"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(prev => !prev)}
            className="register-form__password-toggle"
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
        {touched.confirmPassword && errors.confirmPassword && (
          <span className="register-form__error" role="alert">{errors.confirmPassword}</span>
        )}
      </div>
      
      {/* Terms Acceptance */}
      <div className={`register-form__checkbox-field ${touched.acceptTerms && errors.acceptTerms ? 'register-form__checkbox-field--error' : ''}`}>
        <label className="register-form__checkbox-label">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={values.acceptTerms}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            className="register-form__checkbox"
          />
          <span className="register-form__checkbox-custom" />
          <span className="register-form__checkbox-text">
            I agree to the{' '}
            <a href={termsUrl} target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href={privacyUrl} target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </span>
        </label>
        {touched.acceptTerms && errors.acceptTerms && (
          <span className="register-form__error" role="alert">{errors.acceptTerms}</span>
        )}
      </div>
      
      {/* Newsletter Opt-in */}
      <div className="register-form__checkbox-field">
        <label className="register-form__checkbox-label">
          <input
            type="checkbox"
            name="newsletter"
            checked={values.newsletter}
            onChange={handleChange}
            disabled={isLoading}
            className="register-form__checkbox"
          />
          <span className="register-form__checkbox-custom" />
          <span className="register-form__checkbox-text">
            Send me updates about GPS Lab and new features
          </span>
        </label>
      </div>
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="register-form__submit"
      >
        {isLoading ? (
          <>
            <span className="register-form__submit-spinner" />
            <span>Creating account...</span>
          </>
        ) : (
          submitText
        )}
      </button>
    </form>
  );
};

export { validateRegisterForm, checkPasswordStrength, PASSWORD_REQUIREMENTS };
export default RegisterForm;