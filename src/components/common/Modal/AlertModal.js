/**
 * GPS Lab Platform - AlertModal Component
 * 
 * Simple alert/notification modal with OK button.
 * 
 * @module components/common/Modal/AlertModal
 * @version 1.0.0
 */

import React from 'react';
import Modal, { MODAL_SIZES } from './Modal';
import './AlertModal.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const ALERT_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

// Type icons
const TYPE_ICONS = {
  [ALERT_TYPES.INFO]: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  [ALERT_TYPES.SUCCESS]: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  [ALERT_TYPES.WARNING]: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  [ALERT_TYPES.ERROR]: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  )
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * AlertModal component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {string} [props.type='info'] - Alert type
 * @param {string} [props.title] - Alert title
 * @param {string} [props.message] - Alert message
 * @param {string} [props.buttonText='OK'] - Button text
 * @param {boolean} [props.showIcon=true] - Show type icon
 */
const AlertModal = ({
  isOpen,
  onClose,
  type = ALERT_TYPES.INFO,
  title,
  message,
  buttonText = 'OK',
  showIcon = true,
  className = '',
  children,
  ...props
}) => {
  
  // Build class names
  const classNames = [
    'alert-modal',
    `alert-modal--${type}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={MODAL_SIZES.SM}
      showCloseButton={false}
      closeOnOverlay={false}
      className={classNames}
      {...props}
    >
      <div className="alert-modal__content">
        {/* Icon */}
        {showIcon && (
          <div className={`alert-modal__icon alert-modal__icon--${type}`}>
            {TYPE_ICONS[type]}
          </div>
        )}
        
        {/* Title */}
        {title && (
          <h3 className="alert-modal__title">{title}</h3>
        )}
        
        {/* Message */}
        {message && (
          <p className="alert-modal__message">{message}</p>
        )}
        
        {/* Custom content */}
        {children}
        
        {/* Button */}
        <button
          type="button"
          className={`alert-modal__btn alert-modal__btn--${type}`}
          onClick={onClose}
        >
          {buttonText}
        </button>
      </div>
    </Modal>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default AlertModal;