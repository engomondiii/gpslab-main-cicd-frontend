/**
 * GPS Lab Platform - DropdownMenu Component
 * 
 * Menu list for dropdown with items, dividers, and groups.
 * 
 * @module components/common/Dropdown/DropdownMenu
 * @version 1.0.0
 */

import React from 'react';
import './DropdownMenu.css';

// =============================================================================
// DROPDOWN MENU
// =============================================================================

/**
 * DropdownMenu component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Menu items
 */
const DropdownMenu = ({ className = '', children, ...props }) => (
  <div className={`dropdown-menu ${className}`} role="menu" {...props}>
    {children}
  </div>
);

// =============================================================================
// DROPDOWN ITEM
// =============================================================================

/**
 * DropdownItem component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.icon] - Item icon
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.destructive=false] - Destructive action style
 * @param {boolean} [props.selected=false] - Selected state
 * @param {Function} [props.onClick] - Click handler
 * @param {React.ReactNode} props.children - Item content
 */
export const DropdownItem = ({
  icon,
  disabled = false,
  destructive = false,
  selected = false,
  onClick,
  className = '',
  children,
  ...props
}) => {
  
  const classNames = [
    'dropdown-item',
    disabled && 'dropdown-item--disabled',
    destructive && 'dropdown-item--destructive',
    selected && 'dropdown-item--selected',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      type="button"
      className={classNames}
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      data-dropdown-item
      {...props}
    >
      {icon && <span className="dropdown-item__icon">{icon}</span>}
      <span className="dropdown-item__label">{children}</span>
      {selected && (
        <span className="dropdown-item__check">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </span>
      )}
    </button>
  );
};

// =============================================================================
// DROPDOWN DIVIDER
// =============================================================================

/**
 * DropdownDivider component
 */
export const DropdownDivider = ({ className = '', ...props }) => (
  <div className={`dropdown-divider ${className}`} role="separator" {...props} />
);

// =============================================================================
// DROPDOWN HEADER
// =============================================================================

/**
 * DropdownHeader component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Header content
 */
export const DropdownHeader = ({ className = '', children, ...props }) => (
  <div className={`dropdown-header ${className}`} {...props}>
    {children}
  </div>
);

// =============================================================================
// DROPDOWN GROUP
// =============================================================================

/**
 * DropdownGroup component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.label] - Group label
 * @param {React.ReactNode} props.children - Group items
 */
export const DropdownGroup = ({ label, className = '', children, ...props }) => (
  <div className={`dropdown-group ${className}`} role="group" {...props}>
    {label && <div className="dropdown-group__label">{label}</div>}
    {children}
  </div>
);

// =============================================================================
// EXPORTS
// =============================================================================

export default DropdownMenu;