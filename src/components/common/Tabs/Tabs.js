/**
 * GPS Lab Platform - Tabs Component
 * 
 * Tab navigation component with panels.
 * 
 * @module components/common/Tabs/Tabs
 * @version 1.0.0
 */

import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import './Tabs.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const TAB_VARIANTS = {
  DEFAULT: 'default',
  PILLS: 'pills',
  UNDERLINE: 'underline',
  ENCLOSED: 'enclosed'
};

export const TAB_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg'
};

// =============================================================================
// CONTEXT
// =============================================================================

const TabsContext = createContext(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component');
  }
  return context;
};

// =============================================================================
// TABS COMPONENT
// =============================================================================

/**
 * Tabs component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.defaultValue] - Default active tab
 * @param {string} [props.value] - Controlled active tab
 * @param {Function} [props.onChange] - Tab change handler
 * @param {string} [props.variant='default'] - Tab style variant
 * @param {string} [props.size='md'] - Tab size
 * @param {boolean} [props.fullWidth=false] - Full width tabs
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Tab components
 */
const Tabs = ({
  defaultValue,
  value: controlledValue,
  onChange,
  variant = TAB_VARIANTS.DEFAULT,
  size = TAB_SIZES.MD,
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : internalValue;
  
  const handleChange = (newValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };
  
  const contextValue = {
    activeValue,
    onChange: handleChange,
    variant,
    size
  };
  
  const classNames = [
    'tabs',
    `tabs--${variant}`,
    `tabs--${size}`,
    fullWidth && 'tabs--full-width',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <TabsContext.Provider value={contextValue}>
      <div className={classNames} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// =============================================================================
// TAB LIST
// =============================================================================

/**
 * TabList component - container for Tab buttons
 */
export const TabList = ({ className = '', children, ...props }) => {
  const { variant } = useTabsContext();
  const listRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  
  // Update indicator position for underline variant
  useEffect(() => {
    if (variant !== TAB_VARIANTS.UNDERLINE || !listRef.current) return;
    
    const activeTab = listRef.current.querySelector('[data-state="active"]');
    if (activeTab) {
      setIndicatorStyle({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth
      });
    }
  });
  
  return (
    <div 
      ref={listRef}
      className={`tab-list ${className}`} 
      role="tablist"
      {...props}
    >
      {children}
      {variant === TAB_VARIANTS.UNDERLINE && (
        <div 
          className="tab-list__indicator"
          style={indicatorStyle}
        />
      )}
    </div>
  );
};

// =============================================================================
// TAB
// =============================================================================

/**
 * Tab component - individual tab button
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Tab value
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {React.ReactNode} [props.icon] - Tab icon
 * @param {React.ReactNode} [props.badge] - Tab badge
 */
export const Tab = ({ 
  value, 
  disabled = false, 
  icon, 
  badge,
  className = '', 
  children, 
  ...props 
}) => {
  const { activeValue, onChange, variant } = useTabsContext();
  const isActive = activeValue === value;
  
  const handleClick = () => {
    if (!disabled) {
      onChange(value);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };
  
  const classNames = [
    'tab',
    isActive && 'tab--active',
    disabled && 'tab--disabled',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      type="button"
      role="tab"
      className={classNames}
      aria-selected={isActive}
      aria-disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      data-state={isActive ? 'active' : 'inactive'}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {icon && <span className="tab__icon">{icon}</span>}
      <span className="tab__label">{children}</span>
      {badge && <span className="tab__badge">{badge}</span>}
    </button>
  );
};

// =============================================================================
// TAB PANELS
// =============================================================================

/**
 * TabPanels component - container for TabPanel components
 */
export const TabPanels = ({ className = '', children, ...props }) => (
  <div className={`tab-panels ${className}`} {...props}>
    {children}
  </div>
);

// =============================================================================
// TAB PANEL
// =============================================================================

/**
 * TabPanel component - content panel for a tab
 * 
 * @param {Object} props - Component props
 * @param {string} props.value - Tab value this panel corresponds to
 * @param {boolean} [props.keepMounted=false] - Keep mounted when inactive
 */
export const TabPanel = ({ 
  value, 
  keepMounted = false,
  className = '', 
  children, 
  ...props 
}) => {
  const { activeValue } = useTabsContext();
  const isActive = activeValue === value;
  
  if (!isActive && !keepMounted) {
    return null;
  }
  
  return (
    <div
      role="tabpanel"
      className={`tab-panel ${isActive ? 'tab-panel--active' : ''} ${className}`}
      hidden={!isActive}
      {...props}
    >
      {children}
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default Tabs;