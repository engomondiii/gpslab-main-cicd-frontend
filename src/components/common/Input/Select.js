/**
 * GPS Lab Platform - Select Component
 * 
 * Dropdown select input with single and multi-select support.
 * 
 * @module components/common/Input/Select
 * @version 1.0.0
 */

import React, { forwardRef, useState, useRef, useEffect, useId } from 'react';
import './Select.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const SELECT_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg'
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Select component
 * 
 * @param {Object} props - Component props
 * @param {Array} props.options - Array of {value, label, disabled?} objects
 * @param {string|Array} [props.value] - Selected value(s)
 * @param {boolean} [props.multiple=false] - Allow multiple selection
 * @param {string} [props.size='md'] - Select size
 * @param {string} [props.label] - Input label
 * @param {string} [props.placeholder='Select...'] - Placeholder text
 * @param {string} [props.helperText] - Helper text
 * @param {string} [props.errorText] - Error message
 * @param {boolean} [props.required=false] - Required field
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.searchable=false] - Enable search/filter
 * @param {boolean} [props.clearable=false] - Show clear button
 * @param {boolean} [props.fullWidth=false] - Full width
 * @param {Function} [props.onChange] - Change handler
 */
const Select = forwardRef(({
  options = [],
  value,
  multiple = false,
  size = SELECT_SIZES.MD,
  label,
  placeholder = 'Select...',
  helperText,
  errorText,
  required = false,
  disabled = false,
  searchable = false,
  clearable = false,
  fullWidth = false,
  className = '',
  id: providedId,
  onChange,
  ...props
}, ref) => {
  
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  
  // Refs
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // IDs
  const generatedId = useId();
  const selectId = providedId || generatedId;
  const listboxId = `${selectId}-listbox`;
  const helperId = `${selectId}-helper`;
  
  // Computed values
  const hasError = !!errorText;
  const displayText = errorText || helperText;
  const selectedValues = multiple ? (value || []) : (value ? [value] : []);
  
  // Filter options based on search
  const filteredOptions = searchable && searchQuery
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;
  
  // Get display label for selected value(s)
  const getDisplayLabel = () => {
    if (selectedValues.length === 0) {
      return null;
    }
    
    if (multiple) {
      if (selectedValues.length === 1) {
        const option = options.find(o => o.value === selectedValues[0]);
        return option?.label;
      }
      return `${selectedValues.length} selected`;
    }
    
    const option = options.find(o => o.value === value);
    return option?.label;
  };
  
  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);
  
  // Handle toggle
  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setHighlightedIndex(0);
    }
  };
  
  // Handle option select
  const handleSelect = (optionValue) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange?.({ target: { value: newValues } });
    } else {
      onChange?.({ target: { value: optionValue } });
      setIsOpen(false);
      setSearchQuery('');
    }
  };
  
  // Handle clear
  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.({ target: { value: multiple ? [] : '' } });
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        if (!isOpen) {
          setIsOpen(true);
        } else if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        e.preventDefault();
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        break;
      case 'ArrowDown':
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            Math.min(prev + 1, filteredOptions.length - 1)
          );
        }
        e.preventDefault();
        break;
      case 'ArrowUp':
        setHighlightedIndex(prev => Math.max(prev - 1, 0));
        e.preventDefault();
        break;
      default:
        break;
    }
  };
  
  // Build class names
  const containerClassNames = [
    'select-container',
    fullWidth && 'select-container--full-width',
    className
  ].filter(Boolean).join(' ');
  
  const triggerClassNames = [
    'select-trigger',
    `select-trigger--${size}`,
    hasError && 'select-trigger--error',
    disabled && 'select-trigger--disabled',
    isOpen && 'select-trigger--open'
  ].filter(Boolean).join(' ');
  
  const displayLabel = getDisplayLabel();
  
  return (
    <div className={containerClassNames} ref={containerRef}>
      {/* Label */}
      {label && (
        <label htmlFor={selectId} className="select-label">
          {label}
          {required && <span className="select-label__required">*</span>}
        </label>
      )}
      
      {/* Select trigger */}
      <div
        ref={ref}
        id={selectId}
        className={triggerClassNames}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={displayText ? helperId : undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {/* Display value */}
        <span className={`select-value ${!displayLabel ? 'select-value--placeholder' : ''}`}>
          {displayLabel || placeholder}
        </span>
        
        {/* Actions */}
        <div className="select-actions">
          {/* Clear button */}
          {clearable && selectedValues.length > 0 && !disabled && (
            <button
              type="button"
              className="select-clear"
              onClick={handleClear}
              aria-label="Clear selection"
              tabIndex={-1}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          
          {/* Chevron */}
          <span className={`select-chevron ${isOpen ? 'select-chevron--open' : ''}`}>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </div>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="select-dropdown">
          {/* Search input */}
          {searchable && (
            <div className="select-search">
              <input
                ref={searchInputRef}
                type="text"
                className="select-search__input"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          
          {/* Options list */}
          <ul
            id={listboxId}
            className="select-options"
            role="listbox"
            aria-multiselectable={multiple}
          >
            {filteredOptions.length === 0 ? (
              <li className="select-option select-option--empty">
                No options found
              </li>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = selectedValues.includes(option.value);
                const isHighlighted = index === highlightedIndex;
                
                return (
                  <li
                    key={option.value}
                    className={`select-option ${
                      isSelected ? 'select-option--selected' : ''
                    } ${isHighlighted ? 'select-option--highlighted' : ''} ${
                      option.disabled ? 'select-option--disabled' : ''
                    }`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {multiple && (
                      <span className="select-option__checkbox">
                        {isSelected && (
                          <svg viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                    )}
                    <span className="select-option__label">{option.label}</span>
                    {!multiple && isSelected && (
                      <span className="select-option__check">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
      
      {/* Helper text */}
      {displayText && (
        <span 
          id={helperId}
          className={`select-helper ${hasError ? 'select-helper--error' : ''}`}
          role={hasError ? 'alert' : undefined}
        >
          {displayText}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';

// =============================================================================
// EXPORTS
// =============================================================================

export default Select;