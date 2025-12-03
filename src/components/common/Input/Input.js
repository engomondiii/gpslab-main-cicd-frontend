/**
 * GPS Lab Platform - Input Component
 * 
 * Base input component with validation states, labels,
 * and helper text support.
 * 
 * @module components/common/Input/Input
 * @version 1.0.0
 */

import React, { forwardRef, useId } from 'react';
import './Input.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const INPUT_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg'
};

export const INPUT_STATES = {
  DEFAULT: 'default',
  ERROR: 'error',
  SUCCESS: 'success',
  WARNING: 'warning'
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Base Input component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.type='text'] - Input type
 * @param {string} [props.size='md'] - Input size
 * @param {string} [props.state='default'] - Validation state
 * @param {string} [props.label] - Input label
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.helperText] - Helper text below input
 * @param {string} [props.errorText] - Error message (overrides helperText)
 * @param {boolean} [props.required=false] - Required field
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.readOnly=false] - Read only state
 * @param {React.ReactNode} [props.leftAddon] - Left addon element
 * @param {React.ReactNode} [props.rightAddon] - Right addon element
 * @param {boolean} [props.fullWidth=false] - Full width input
 * @param {string} [props.className] - Additional CSS classes
 * @param {Function} [props.onChange] - Change handler
 * @param {Function} [props.onBlur] - Blur handler
 * @param {Function} [props.onFocus] - Focus handler
 */
const Input = forwardRef(({
  type = 'text',
  size = INPUT_SIZES.MD,
  state = INPUT_STATES.DEFAULT,
  label,
  placeholder,
  helperText,
  errorText,
  required = false,
  disabled = false,
  readOnly = false,
  leftAddon,
  rightAddon,
  fullWidth = false,
  className = '',
  id: providedId,
  onChange,
  onBlur,
  onFocus,
  ...props
}, ref) => {
  
  // Generate unique ID if not provided
  const generatedId = useId();
  const inputId = providedId || generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  
  // Determine actual state based on errorText
  const actualState = errorText ? INPUT_STATES.ERROR : state;
  const displayText = errorText || helperText;
  const describedBy = displayText ? (errorText ? errorId : helperId) : undefined;
  
  // Build container class names
  const containerClassNames = [
    'input-container',
    fullWidth && 'input-container--full-width',
    className
  ].filter(Boolean).join(' ');
  
  // Build wrapper class names
  const wrapperClassNames = [
    'input-wrapper',
    `input-wrapper--${size}`,
    `input-wrapper--${actualState}`,
    disabled && 'input-wrapper--disabled',
    readOnly && 'input-wrapper--readonly',
    leftAddon && 'input-wrapper--has-left-addon',
    rightAddon && 'input-wrapper--has-right-addon'
  ].filter(Boolean).join(' ');
  
  return (
    <div className={containerClassNames}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          className="input-label"
        >
          {label}
          {required && <span className="input-label__required" aria-hidden="true">*</span>}
        </label>
      )}
      
      {/* Input wrapper */}
      <div className={wrapperClassNames}>
        {/* Left addon */}
        {leftAddon && (
          <span className="input-addon input-addon--left">
            {leftAddon}
          </span>
        )}
        
        {/* Input field */}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className="input-field"
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-required={required}
          aria-invalid={actualState === INPUT_STATES.ERROR}
          aria-describedby={describedBy}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          {...props}
        />
        
        {/* Right addon */}
        {rightAddon && (
          <span className="input-addon input-addon--right">
            {rightAddon}
          </span>
        )}
        
        {/* State icon */}
        {actualState !== INPUT_STATES.DEFAULT && (
          <span className="input-state-icon" aria-hidden="true">
            {actualState === INPUT_STATES.ERROR && (
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {actualState === INPUT_STATES.SUCCESS && (
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {actualState === INPUT_STATES.WARNING && (
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </span>
        )}
      </div>
      
      {/* Helper/Error text */}
      {displayText && (
        <span 
          id={errorText ? errorId : helperId}
          className={`input-helper ${errorText ? 'input-helper--error' : ''}`}
          role={errorText ? 'alert' : undefined}
        >
          {displayText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// =============================================================================
// EXPORTS
// =============================================================================

export default Input;