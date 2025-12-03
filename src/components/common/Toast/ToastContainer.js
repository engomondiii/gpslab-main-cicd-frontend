/**
 * GPS Lab Platform - ToastContainer Component
 * 
 * Container for managing and displaying toast notifications.
 * 
 * @module components/common/Toast/ToastContainer
 * @version 1.0.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Toast, { TOAST_TYPES, TOAST_POSITIONS } from './Toast';
import './ToastContainer.css';

// =============================================================================
// TOAST CONTEXT (for external use)
// =============================================================================

let toastIdCounter = 0;
const generateId = () => `toast-${++toastIdCounter}`;

// Global toast handler (set by ToastContainer)
let globalAddToast = null;
let globalRemoveToast = null;

/**
 * Show a toast notification
 * @param {Object} options - Toast options
 */
export const toast = (options) => {
  if (globalAddToast) {
    const id = generateId();
    globalAddToast({ id, ...options });
    return id;
  }
  console.warn('ToastContainer not mounted');
  return null;
};

// Convenience methods
toast.success = (message, options = {}) => 
  toast({ type: TOAST_TYPES.SUCCESS, message, ...options });

toast.error = (message, options = {}) => 
  toast({ type: TOAST_TYPES.ERROR, message, ...options });

toast.warning = (message, options = {}) => 
  toast({ type: TOAST_TYPES.WARNING, message, ...options });

toast.info = (message, options = {}) => 
  toast({ type: TOAST_TYPES.INFO, message, ...options });

toast.dismiss = (id) => {
  if (globalRemoveToast) {
    globalRemoveToast(id);
  }
};

toast.dismissAll = () => {
  if (globalRemoveToast) {
    globalRemoveToast(null); // null = all
  }
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ToastContainer component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.position='top-right'] - Toast position
 * @param {number} [props.maxToasts=5] - Maximum visible toasts
 * @param {boolean} [props.newestOnTop=true] - Show newest toast on top
 */
const ToastContainer = ({
  position = TOAST_POSITIONS.TOP_RIGHT,
  maxToasts = 5,
  newestOnTop = true,
  className = '',
  ...props
}) => {
  
  const [toasts, setToasts] = useState([]);
  
  // Add toast
  const addToast = useCallback((toast) => {
    setToasts(prev => {
      const newToasts = newestOnTop 
        ? [toast, ...prev]
        : [...prev, toast];
      
      // Limit max toasts
      if (newToasts.length > maxToasts) {
        return newestOnTop 
          ? newToasts.slice(0, maxToasts)
          : newToasts.slice(-maxToasts);
      }
      
      return newToasts;
    });
  }, [maxToasts, newestOnTop]);
  
  // Remove toast
  const removeToast = useCallback((id) => {
    if (id === null) {
      // Remove all
      setToasts([]);
    } else {
      setToasts(prev => prev.filter(t => t.id !== id));
    }
  }, []);
  
  // Set global handlers
  useEffect(() => {
    globalAddToast = addToast;
    globalRemoveToast = removeToast;
    
    return () => {
      globalAddToast = null;
      globalRemoveToast = null;
    };
  }, [addToast, removeToast]);
  
  // Build class names
  const classNames = [
    'toast-container',
    `toast-container--${position}`,
    className
  ].filter(Boolean).join(' ');
  
  // Don't render if no toasts
  if (toasts.length === 0) return null;
  
  const container = (
    <div className={classNames} {...props}>
      {toasts.map(toastData => (
        <Toast
          key={toastData.id}
          {...toastData}
          onDismiss={removeToast}
        />
      ))}
    </div>
  );
  
  return createPortal(container, document.body);
};

// =============================================================================
// EXPORTS
// =============================================================================

export default ToastContainer;
export { TOAST_TYPES, TOAST_POSITIONS };