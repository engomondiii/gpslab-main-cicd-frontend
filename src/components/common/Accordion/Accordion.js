/**
 * GPS Lab Platform - Accordion Component
 * 
 * Expandable/collapsible content sections.
 * 
 * @module components/common/Accordion/Accordion
 * @version 1.0.0
 */

import React, { useState, createContext, useContext, useRef, useEffect } from 'react';
import './Accordion.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const ACCORDION_VARIANTS = {
  DEFAULT: 'default',
  BORDERED: 'bordered',
  SEPARATED: 'separated'
};

// =============================================================================
// CONTEXT
// =============================================================================

const AccordionContext = createContext(null);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('AccordionItem must be used within an Accordion');
  }
  return context;
};

// =============================================================================
// ACCORDION COMPONENT
// =============================================================================

/**
 * Accordion component
 * 
 * @param {Object} props - Component props
 * @param {string|string[]} [props.defaultValue] - Default expanded items
 * @param {string|string[]} [props.value] - Controlled expanded items
 * @param {Function} [props.onChange] - Change handler
 * @param {boolean} [props.multiple=false] - Allow multiple items open
 * @param {boolean} [props.collapsible=true] - Allow all items to be closed
 * @param {string} [props.variant='default'] - Accordion variant
 * @param {string} [props.className] - Additional CSS classes
 */
const Accordion = ({
  defaultValue,
  value: controlledValue,
  onChange,
  multiple = false,
  collapsible = true,
  variant = ACCORDION_VARIANTS.DEFAULT,
  className = '',
  children,
  ...props
}) => {
  
  // Normalize value to array
  const normalizeValue = (val) => {
    if (!val) return [];
    return Array.isArray(val) ? val : [val];
  };
  
  const [internalValue, setInternalValue] = useState(normalizeValue(defaultValue));
  const isControlled = controlledValue !== undefined;
  const expandedItems = isControlled ? normalizeValue(controlledValue) : internalValue;
  
  const toggleItem = (itemValue) => {
    let newValue;
    const isExpanded = expandedItems.includes(itemValue);
    
    if (isExpanded) {
      // Collapsing
      if (!collapsible && expandedItems.length === 1) {
        return; // Can't collapse the only open item
      }
      newValue = expandedItems.filter(v => v !== itemValue);
    } else {
      // Expanding
      newValue = multiple ? [...expandedItems, itemValue] : [itemValue];
    }
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(multiple ? newValue : newValue[0] || null);
  };
  
  const contextValue = {
    expandedItems,
    toggleItem,
    variant
  };
  
  const classNames = [
    'accordion',
    `accordion--${variant}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={classNames} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

// =============================================================================
// ACCORDION ITEM
// =============================================================================

/**
 * AccordionItem component
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Item value/id
 * @param {boolean} [props.disabled=false] - Disabled state
 */
export const AccordionItem = ({
  value,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const { expandedItems, variant } = useAccordionContext();
  const isExpanded = expandedItems.includes(value);
  
  const classNames = [
    'accordion-item',
    isExpanded && 'accordion-item--expanded',
    disabled && 'accordion-item--disabled',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} data-state={isExpanded ? 'open' : 'closed'} {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { itemValue: value, disabled });
        }
        return child;
      })}
    </div>
  );
};

// =============================================================================
// ACCORDION TRIGGER
// =============================================================================

/**
 * AccordionTrigger component - clickable header
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.icon] - Custom icon
 */
export const AccordionTrigger = ({
  itemValue,
  disabled,
  icon,
  className = '',
  children,
  ...props
}) => {
  const { expandedItems, toggleItem } = useAccordionContext();
  const isExpanded = expandedItems.includes(itemValue);
  
  const handleClick = () => {
    if (!disabled) {
      toggleItem(itemValue);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };
  
  return (
    <button
      type="button"
      className={`accordion-trigger ${className}`}
      aria-expanded={isExpanded}
      aria-disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <span className="accordion-trigger__content">{children}</span>
      <span className="accordion-trigger__icon">
        {icon || (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </span>
    </button>
  );
};

// =============================================================================
// ACCORDION CONTENT
// =============================================================================

/**
 * AccordionContent component - expandable content area
 */
export const AccordionContent = ({
  itemValue,
  className = '',
  children,
  ...props
}) => {
  const { expandedItems } = useAccordionContext();
  const isExpanded = expandedItems.includes(itemValue);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);
  
  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [children]);
  
  return (
    <div
      className={`accordion-content ${isExpanded ? 'accordion-content--expanded' : ''} ${className}`}
      style={{ '--content-height': `${height}px` }}
      aria-hidden={!isExpanded}
      {...props}
    >
      <div ref={contentRef} className="accordion-content__inner">
        {children}
      </div>
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default Accordion;