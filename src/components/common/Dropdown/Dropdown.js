/**
 * GPS Lab Platform - Dropdown Component
 * 
 * Base dropdown component for menus and selections.
 * 
 * @module components/common/Dropdown/Dropdown
 * @version 1.0.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Dropdown.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const DROPDOWN_POSITIONS = {
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_CENTER: 'bottom-center',
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right',
  TOP_CENTER: 'top-center'
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Dropdown component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.trigger - Trigger element
 * @param {string} [props.position='bottom-left'] - Dropdown position
 * @param {boolean} [props.closeOnSelect=true] - Close on item select
 * @param {boolean} [props.closeOnClickOutside=true] - Close on outside click
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Dropdown content
 */
const Dropdown = ({
  trigger,
  position = DROPDOWN_POSITIONS.BOTTOM_LEFT,
  closeOnSelect = true,
  closeOnClickOutside = true,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  
  // Toggle dropdown
  const toggle = useCallback(() => {
    if (!disabled) {
      setIsOpen(prev => !prev);
    }
  }, [disabled]);
  
  // Close dropdown
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  // Handle click outside
  useEffect(() => {
    if (!closeOnClickOutside || !isOpen) return;
    
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        close();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeOnClickOutside, close]);
  
  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        close();
        triggerRef.current?.focus();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, close]);
  
  // Handle content click (for closeOnSelect)
  const handleContentClick = (e) => {
    if (closeOnSelect && e.target.closest('[data-dropdown-item]')) {
      close();
    }
  };
  
  // Clone trigger with ref and handlers
  const triggerElement = React.cloneElement(trigger, {
    ref: triggerRef,
    onClick: (e) => {
      trigger.props.onClick?.(e);
      toggle();
    },
    'aria-expanded': isOpen,
    'aria-haspopup': true,
    disabled: disabled || trigger.props.disabled
  });
  
  // Build class names
  const containerClassNames = [
    'dropdown',
    isOpen && 'dropdown--open',
    disabled && 'dropdown--disabled',
    className
  ].filter(Boolean).join(' ');
  
  const contentClassNames = [
    'dropdown__content',
    `dropdown__content--${position}`
  ].filter(Boolean).join(' ');
  
  return (
    <div className={containerClassNames} {...props}>
      {triggerElement}
      
      {isOpen && (
        <div 
          ref={dropdownRef}
          className={contentClassNames}
          onClick={handleContentClick}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default Dropdown;