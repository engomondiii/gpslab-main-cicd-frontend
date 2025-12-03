/**
 * GPS Lab Platform - Modal Component
 * 
 * Base modal component with overlay, animations,
 * and accessibility features.
 * 
 * @module components/common/Modal/Modal
 * @version 1.0.0
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const MODAL_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
  FULL: 'full'
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Modal component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {string} [props.size='md'] - Modal size
 * @param {string} [props.title] - Modal title
 * @param {boolean} [props.showCloseButton=true] - Show close button
 * @param {boolean} [props.closeOnOverlay=true] - Close on overlay click
 * @param {boolean} [props.closeOnEscape=true] - Close on Escape key
 * @param {boolean} [props.preventScroll=true] - Prevent body scroll
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} [props.header] - Custom header content
 * @param {React.ReactNode} [props.footer] - Footer content
 * @param {React.ReactNode} props.children - Modal body content
 */
const Modal = ({
  isOpen,
  onClose,
  size = MODAL_SIZES.MD,
  title,
  showCloseButton = true,
  closeOnOverlay = true,
  closeOnEscape = true,
  preventScroll = true,
  className = '',
  header,
  footer,
  children,
  ...props
}) => {
  
  // Refs
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);
  
  // Handle escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && closeOnEscape) {
      onClose?.();
    }
  }, [closeOnEscape, onClose]);
  
  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlay) {
      onClose?.();
    }
  };
  
  // Trap focus within modal
  const handleTabKey = useCallback((e) => {
    if (e.key !== 'Tab' || !modalRef.current) return;
    
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement?.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement?.focus();
    }
  }, []);
  
  // Effects
  useEffect(() => {
    if (isOpen) {
      // Store current active element
      previousActiveElement.current = document.activeElement;
      
      // Prevent body scroll
      if (preventScroll) {
        document.body.style.overflow = 'hidden';
      }
      
      // Add event listeners
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keydown', handleTabKey);
      
      // Focus modal
      setTimeout(() => {
        modalRef.current?.focus();
      }, 0);
    }
    
    return () => {
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Remove event listeners
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleTabKey);
      
      // Restore focus
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, preventScroll, handleKeyDown, handleTabKey]);
  
  // Don't render if not open
  if (!isOpen) return null;
  
  // Build class names
  const overlayClassNames = [
    'modal-overlay',
    isOpen && 'modal-overlay--open'
  ].filter(Boolean).join(' ');
  
  const modalClassNames = [
    'modal',
    `modal--${size}`,
    className
  ].filter(Boolean).join(' ');
  
  // Render modal content
  const modalContent = (
    <div 
      className={overlayClassNames}
      onClick={handleOverlayClick}
      aria-hidden={!isOpen}
    >
      <div
        ref={modalRef}
        className={modalClassNames}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        {...props}
      >
        {/* Header */}
        {(title || header || showCloseButton) && (
          <div className="modal__header">
            {header || (
              title && <h2 id="modal-title" className="modal__title">{title}</h2>
            )}
            
            {showCloseButton && (
              <button
                type="button"
                className="modal__close"
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* Body */}
        <div className="modal__body">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="modal__footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
  
  // Render in portal
  return createPortal(modalContent, document.body);
};

// =============================================================================
// EXPORTS
// =============================================================================

export default Modal;