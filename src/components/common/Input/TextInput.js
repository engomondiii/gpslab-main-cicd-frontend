/**
 * GPS Lab Platform - TextInput Component
 * 
 * Text input field extending the base Input component
 * with common text input patterns.
 * 
 * @module components/common/Input/TextInput
 * @version 1.0.0
 */

import React, { forwardRef, useState } from 'react';
import Input, { INPUT_SIZES, INPUT_STATES } from './Input';
import './TextInput.css';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Text Input component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.type='text'] - Input type (text, email, password, etc.)
 * @param {boolean} [props.showPasswordToggle=false] - Show password visibility toggle
 * @param {boolean} [props.clearable=false] - Show clear button when has value
 * @param {number} [props.maxLength] - Maximum character length
 * @param {boolean} [props.showCharCount=false] - Show character count
 * @param {string} [props.prefix] - Text prefix (e.g., "$", "@")
 * @param {string} [props.suffix] - Text suffix (e.g., ".com", "%")
 */
const TextInput = forwardRef(({
  type = 'text',
  showPasswordToggle = false,
  clearable = false,
  maxLength,
  showCharCount = false,
  prefix,
  suffix,
  value,
  onChange,
  ...props
}, ref) => {
  
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState('');
  
  // Use controlled or uncontrolled value
  const currentValue = value !== undefined ? value : internalValue;
  const charCount = String(currentValue).length;
  
  // Determine actual input type
  const actualType = type === 'password' && showPassword ? 'text' : type;
  
  // Handle value change
  const handleChange = (e) => {
    const newValue = e.target.value;
    
    // Respect maxLength
    if (maxLength && newValue.length > maxLength) {
      return;
    }
    
    if (value === undefined) {
      setInternalValue(newValue);
    }
    
    onChange?.(e);
  };
  
  // Handle clear
  const handleClear = () => {
    const syntheticEvent = {
      target: { value: '' },
      currentTarget: { value: '' }
    };
    
    if (value === undefined) {
      setInternalValue('');
    }
    
    onChange?.(syntheticEvent);
  };
  
  // Build left addon
  const leftAddon = prefix ? (
    <span className="text-input__prefix">{prefix}</span>
  ) : props.leftAddon;
  
  // Build right addon
  let rightAddon = props.rightAddon;
  
  if (suffix) {
    rightAddon = <span className="text-input__suffix">{suffix}</span>;
  }
  
  if (type === 'password' && showPasswordToggle) {
    rightAddon = (
      <button
        type="button"
        className="text-input__toggle-password"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {showPassword ? (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>
    );
  }
  
  if (clearable && currentValue) {
    rightAddon = (
      <button
        type="button"
        className="text-input__clear"
        onClick={handleClear}
        aria-label="Clear input"
        tabIndex={-1}
      >
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </button>
    );
  }
  
  return (
    <div className="text-input">
      <Input
        ref={ref}
        type={actualType}
        value={currentValue}
        onChange={handleChange}
        leftAddon={leftAddon}
        rightAddon={rightAddon}
        maxLength={maxLength}
        {...props}
      />
      
      {/* Character count */}
      {showCharCount && maxLength && (
        <span className="text-input__char-count">
          {charCount}/{maxLength}
        </span>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';

// =============================================================================
// EXPORTS
// =============================================================================

export default TextInput;
export { INPUT_SIZES, INPUT_STATES };