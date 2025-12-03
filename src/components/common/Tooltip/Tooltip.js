/**
 * GPS Lab Platform - Tooltip Component
 * 
 * Tooltip for displaying additional information on hover/focus.
 * 
 * @module components/common/Tooltip/Tooltip
 * @version 1.0.0
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Tooltip.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const TOOLTIP_POSITIONS = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right'
};

export const TOOLTIP_VARIANTS = {
  DEFAULT: 'default',
  LIGHT: 'light'
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Tooltip component
 * 
 * @param {Object} props - Component props
 * @param {string|React.ReactNode} props.content - Tooltip content
 * @param {string} [props.position='top'] - Tooltip position
 * @param {string} [props.variant='default'] - Tooltip variant
 * @param {number} [props.delay=300] - Show delay in ms
 * @param {number} [props.hideDelay=0] - Hide delay in ms
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.arrow=true] - Show arrow
 * @param {number} [props.offset=8] - Offset from trigger
 * @param {React.ReactNode} props.children - Trigger element
 */
const Tooltip = ({
  content,
  position = TOOLTIP_POSITIONS.TOP,
  variant = TOOLTIP_VARIANTS.DEFAULT,
  delay = 300,
  hideDelay = 0,
  disabled = false,
  arrow = true,
  offset = 8,
  className = '',
  children,
  ...props
}) => {
  
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const showTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  
  // Calculate position
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    let x = 0;
    let y = 0;
    
    switch (position) {
      case TOOLTIP_POSITIONS.TOP:
        x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.top - tooltipRect.height - offset;
        break;
      case TOOLTIP_POSITIONS.BOTTOM:
        x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.bottom + offset;
        break;
      case TOOLTIP_POSITIONS.LEFT:
        x = triggerRect.left - tooltipRect.width - offset;
        y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        break;
      case TOOLTIP_POSITIONS.RIGHT:
        x = triggerRect.right + offset;
        y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        break;
      default:
        break;
    }
    
    // Keep within viewport
    const padding = 8;
    x = Math.max(padding, Math.min(x, window.innerWidth - tooltipRect.width - padding));
    y = Math.max(padding, Math.min(y, window.innerHeight - tooltipRect.height - padding));
    
    setCoords({ x, y });
  }, [position, offset]);
  
  // Show tooltip
  const show = useCallback(() => {
    if (disabled) return;
    
    clearTimeout(hideTimeoutRef.current);
    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [disabled, delay]);
  
  // Hide tooltip
  const hide = useCallback(() => {
    clearTimeout(showTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
  }, [hideDelay]);
  
  // Update position when visible
  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible, updatePosition]);
  
  // Cleanup timeouts
  useEffect(() => {
    return () => {
      clearTimeout(showTimeoutRef.current);
      clearTimeout(hideTimeoutRef.current);
    };
  }, []);
  
  // Clone children with handlers
  const trigger = React.Children.only(children);
  const triggerElement = React.cloneElement(trigger, {
    ref: triggerRef,
    onMouseEnter: (e) => {
      trigger.props.onMouseEnter?.(e);
      show();
    },
    onMouseLeave: (e) => {
      trigger.props.onMouseLeave?.(e);
      hide();
    },
    onFocus: (e) => {
      trigger.props.onFocus?.(e);
      show();
    },
    onBlur: (e) => {
      trigger.props.onBlur?.(e);
      hide();
    },
    'aria-describedby': isVisible ? 'tooltip' : undefined
  });
  
  // Build tooltip class names
  const tooltipClassNames = [
    'tooltip',
    `tooltip--${position}`,
    `tooltip--${variant}`,
    arrow && 'tooltip--arrow',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <>
      {triggerElement}
      
      {isVisible && content && createPortal(
        <div
          ref={tooltipRef}
          id="tooltip"
          role="tooltip"
          className={tooltipClassNames}
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`
          }}
          {...props}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default Tooltip;