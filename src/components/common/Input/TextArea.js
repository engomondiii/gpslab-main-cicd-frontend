/**
 * GPS Lab Platform - TextArea Component
 * 
 * Multi-line text input with auto-resize and character count.
 * 
 * @module components/common/Input/TextArea
 * @version 1.0.0
 */

import React, { forwardRef, useEffect, useRef, useId } from 'react';
import './TextArea.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const TEXTAREA_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg'
};

export const TEXTAREA_RESIZE = {
  NONE: 'none',
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
  BOTH: 'both',
  AUTO: 'auto'  // Auto-resize based on content
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * TextArea component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.size='md'] - TextArea size
 * @param {string} [props.resize='vertical'] - Resize behavior
 * @param {string} [props.label] - Input label
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.helperText] - Helper text
 * @param {string} [props.errorText] - Error message
 * @param {boolean} [props.required=false] - Required field
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {number} [props.rows=3] - Number of visible rows
 * @param {number} [props.minRows=2] - Minimum rows (for auto-resize)
 * @param {number} [props.maxRows=10] - Maximum rows (for auto-resize)
 * @param {number} [props.maxLength] - Maximum character length
 * @param {boolean} [props.showCharCount=false] - Show character count
 * @param {boolean} [props.fullWidth=false] - Full width
 */
const TextArea = forwardRef(({
  size = TEXTAREA_SIZES.MD,
  resize = TEXTAREA_RESIZE.VERTICAL,
  label,
  placeholder,
  helperText,
  errorText,
  required = false,
  disabled = false,
  rows = 3,
  minRows = 2,
  maxRows = 10,
  maxLength,
  showCharCount = false,
  fullWidth = false,
  className = '',
  id: providedId,
  value,
  onChange,
  ...props
}, ref) => {
  
  // Refs
  const textareaRef = useRef(null);
  const combinedRef = ref || textareaRef;
  
  // Generate unique ID
  const generatedId = useId();
  const textareaId = providedId || generatedId;
  const helperId = `${textareaId}-helper`;
  const errorId = `${textareaId}-error`;
  
  // State
  const hasError = !!errorText;
  const displayText = errorText || helperText;
  const describedBy = displayText ? (errorText ? errorId : helperId) : undefined;
  const charCount = String(value || '').length;
  
  // Auto-resize effect
  useEffect(() => {
    if (resize !== TEXTAREA_RESIZE.AUTO) return;
    
    const textarea = combinedRef.current;
    if (!textarea) return;
    
    // Reset height to auto to get accurate scrollHeight
    textarea.style.height = 'auto';
    
    // Calculate line height
    const style = window.getComputedStyle(textarea);
    const lineHeight = parseInt(style.lineHeight, 10) || 24;
    const paddingTop = parseInt(style.paddingTop, 10);
    const paddingBottom = parseInt(style.paddingBottom, 10);
    const borderTop = parseInt(style.borderTopWidth, 10);
    const borderBottom = parseInt(style.borderBottomWidth, 10);
    
    const minHeight = (minRows * lineHeight) + paddingTop + paddingBottom + borderTop + borderBottom;
    const maxHeight = (maxRows * lineHeight) + paddingTop + paddingBottom + borderTop + borderBottom;
    
    // Set new height
    const newHeight = Math.min(maxHeight, Math.max(minHeight, textarea.scrollHeight));
    textarea.style.height = `${newHeight}px`;
  }, [value, resize, minRows, maxRows, combinedRef]);
  
  // Build class names
  const containerClassNames = [
    'textarea-container',
    fullWidth && 'textarea-container--full-width',
    className
  ].filter(Boolean).join(' ');
  
  const wrapperClassNames = [
    'textarea-wrapper',
    `textarea-wrapper--${size}`,
    hasError && 'textarea-wrapper--error',
    disabled && 'textarea-wrapper--disabled'
  ].filter(Boolean).join(' ');
  
  const textareaClassNames = [
    'textarea-field',
    `textarea-field--resize-${resize === TEXTAREA_RESIZE.AUTO ? 'none' : resize}`
  ].filter(Boolean).join(' ');
  
  return (
    <div className={containerClassNames}>
      {/* Label */}
      {label && (
        <label htmlFor={textareaId} className="textarea-label">
          {label}
          {required && <span className="textarea-label__required">*</span>}
        </label>
      )}
      
      {/* TextArea wrapper */}
      <div className={wrapperClassNames}>
        <textarea
          ref={combinedRef}
          id={textareaId}
          className={textareaClassNames}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={resize === TEXTAREA_RESIZE.AUTO ? minRows : rows}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          {...props}
        />
      </div>
      
      {/* Footer: Helper text and character count */}
      <div className="textarea-footer">
        {displayText && (
          <span 
            id={errorText ? errorId : helperId}
            className={`textarea-helper ${hasError ? 'textarea-helper--error' : ''}`}
            role={hasError ? 'alert' : undefined}
          >
            {displayText}
          </span>
        )}
        
        {showCharCount && maxLength && (
          <span 
            className={`textarea-char-count ${
              charCount >= maxLength ? 'textarea-char-count--limit' :
              charCount >= maxLength * 0.9 ? 'textarea-char-count--warning' : ''
            }`}
          >
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
});

TextArea.displayName = 'TextArea';

// =============================================================================
// EXPORTS
// =============================================================================

export default TextArea;