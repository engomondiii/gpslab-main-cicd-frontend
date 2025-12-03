/**
 * GPS Lab Platform - Radio Component
 * 
 * Radio button input with label support and group management.
 * 
 * @module components/common/Input/Radio
 * @version 1.0.0
 */

import React, { forwardRef, useId, createContext, useContext } from 'react';
import './Radio.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const RADIO_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg'
};

// =============================================================================
// RADIO GROUP CONTEXT
// =============================================================================

const RadioGroupContext = createContext(null);

/**
 * Radio Group component - wraps multiple Radio buttons
 */
export const RadioGroup = ({
  name,
  value,
  onChange,
  size = RADIO_SIZES.MD,
  disabled = false,
  orientation = 'vertical',
  className = '',
  children
}) => {
  const classNames = [
    'radio-group',
    `radio-group--${orientation}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <RadioGroupContext.Provider value={{ name, value, onChange, size, disabled }}>
      <div className={classNames} role="radiogroup">
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

// =============================================================================
// RADIO COMPONENT
// =============================================================================

/**
 * Radio component
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Radio value
 * @param {boolean} [props.checked] - Checked state (controlled)
 * @param {string} [props.name] - Radio group name
 * @param {string} [props.size='md'] - Radio size
 * @param {string} [props.label] - Radio label
 * @param {string} [props.description] - Additional description
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {string} [props.className] - Additional CSS classes
 * @param {Function} [props.onChange] - Change handler
 */
const Radio = forwardRef(({
  value,
  checked: checkedProp,
  name: nameProp,
  size: sizeProp,
  label,
  description,
  disabled: disabledProp = false,
  className = '',
  id: providedId,
  onChange: onChangeProp,
  ...props
}, ref) => {
  
  // Get context from RadioGroup (if used)
  const groupContext = useContext(RadioGroupContext);
  
  // Determine values from props or context
  const name = nameProp || groupContext?.name;
  const size = sizeProp || groupContext?.size || RADIO_SIZES.MD;
  const disabled = disabledProp || groupContext?.disabled || false;
  const checked = checkedProp !== undefined 
    ? checkedProp 
    : groupContext?.value === value;
  const onChange = onChangeProp || groupContext?.onChange;
  
  // IDs
  const generatedId = useId();
  const radioId = providedId || generatedId;
  const descriptionId = `${radioId}-description`;
  
  // Handle change
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };
  
  // Build class names
  const containerClassNames = [
    'radio-container',
    `radio-container--${size}`,
    disabled && 'radio-container--disabled',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={containerClassNames}>
      <div className="radio-wrapper">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          className="radio-input"
          aria-describedby={description ? descriptionId : undefined}
          onChange={handleChange}
          {...props}
        />
        
        {/* Custom radio visual */}
        <span className="radio-custom" aria-hidden="true">
          <span className="radio-dot" />
        </span>
        
        {/* Label and description */}
        {(label || description) && (
          <div className="radio-content">
            {label && (
              <label htmlFor={radioId} className="radio-label">
                {label}
              </label>
            )}
            {description && (
              <span id={descriptionId} className="radio-description">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

Radio.displayName = 'Radio';

// =============================================================================
// EXPORTS
// =============================================================================

export default Radio;