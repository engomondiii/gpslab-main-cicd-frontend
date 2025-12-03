/**
 * GPS Lab Platform - Checkbox Component
 * 
 * Checkbox input with label and indeterminate state support.
 * 
 * @module components/common/Input/Checkbox
 * @version 1.0.0
 */

import React, { forwardRef, useEffect, useRef, useId } from 'react';
import './Checkbox.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const CHECKBOX_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg'
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Checkbox component
 * 
 * @param {Object} props - Component props
 * @param {boolean} [props.checked=false] - Checked state
 * @param {boolean} [props.indeterminate=false] - Indeterminate state
 * @param {string} [props.size='md'] - Checkbox size
 * @param {string} [props.label] - Checkbox label
 * @param {string} [props.description] - Additional description
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.required=false] - Required field
 * @param {string} [props.errorText] - Error message
 * @param {string} [props.className] - Additional CSS classes
 * @param {Function} [props.onChange] - Change handler
 */
const Checkbox = forwardRef(({
  checked = false,
  indeterminate = false,
  size = CHECKBOX_SIZES.MD,
  label,
  description,
  disabled = false,
  required = false,
  errorText,
  className = '',
  id: providedId,
  onChange,
  ...props
}, ref) => {
  
  // Refs
  const checkboxRef = useRef(null);
  const combinedRef = ref || checkboxRef;
  
  // IDs
  const generatedId = useId();
  const checkboxId = providedId || generatedId;
  const descriptionId = `${checkboxId}-description`;
  const errorId = `${checkboxId}-error`;
  
  // Set indeterminate state (can only be done via JS)
  useEffect(() => {
    if (combinedRef.current) {
      combinedRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate, combinedRef]);
  
  // Build class names
  const containerClassNames = [
    'checkbox-container',
    `checkbox-container--${size}`,
    disabled && 'checkbox-container--disabled',
    errorText && 'checkbox-container--error',
    className
  ].filter(Boolean).join(' ');
  
  const checkboxClassNames = [
    'checkbox-input'
  ].filter(Boolean).join(' ');
  
  return (
    <div className={containerClassNames}>
      <div className="checkbox-wrapper">
        <input
          ref={combinedRef}
          type="checkbox"
          id={checkboxId}
          className={checkboxClassNames}
          checked={checked}
          disabled={disabled}
          required={required}
          aria-invalid={!!errorText}
          aria-describedby={
            [description && descriptionId, errorText && errorId]
              .filter(Boolean)
              .join(' ') || undefined
          }
          onChange={onChange}
          {...props}
        />
        
        {/* Custom checkbox visual */}
        <span className="checkbox-custom" aria-hidden="true">
          {checked && !indeterminate && (
            <svg className="checkbox-check" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {indeterminate && (
            <svg className="checkbox-indeterminate" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          )}
        </span>
        
        {/* Label and description */}
        {(label || description) && (
          <div className="checkbox-content">
            {label && (
              <label htmlFor={checkboxId} className="checkbox-label">
                {label}
                {required && <span className="checkbox-required">*</span>}
              </label>
            )}
            {description && (
              <span id={descriptionId} className="checkbox-description">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Error text */}
      {errorText && (
        <span id={errorId} className="checkbox-error" role="alert">
          {errorText}
        </span>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

// =============================================================================
// EXPORTS
// =============================================================================

export default Checkbox;