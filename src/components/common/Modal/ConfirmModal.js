/**
 * GPS Lab Platform - ConfirmModal Component
 * 
 * Confirmation dialog for destructive or important actions.
 * 
 * @module components/common/Modal/ConfirmModal
 * @version 1.0.0
 */

import React from 'react';
import Modal, { MODAL_SIZES } from './Modal';
import './ConfirmModal.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const CONFIRM_VARIANTS = {
  DEFAULT: 'default',
  DANGER: 'danger',
  WARNING: 'warning',
  SUCCESS: 'success'
};

// Variant icons
const VARIANT_ICONS = {
  [CONFIRM_VARIANTS.DEFAULT]: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  [CONFIRM_VARIANTS.DANGER]: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  [CONFIRM_VARIANTS.WARNING]: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4m0 4h.01" />
    </svg>
  ),
  [CONFIRM_VARIANTS.SUCCESS]: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ConfirmModal component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onConfirm - Confirm handler
 * @param {string} [props.variant='default'] - Modal variant
 * @param {string} [props.title] - Modal title
 * @param {string} [props.message] - Confirmation message
 * @param {string} [props.confirmText='Confirm'] - Confirm button text
 * @param {string} [props.cancelText='Cancel'] - Cancel button text
 * @param {boolean} [props.loading=false] - Loading state
 * @param {boolean} [props.destructive=false] - Destructive action flag
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  variant = CONFIRM_VARIANTS.DEFAULT,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  destructive = false,
  className = '',
  children,
  ...props
}) => {
  
  // Determine actual variant
  const actualVariant = destructive ? CONFIRM_VARIANTS.DANGER : variant;
  
  // Handle confirm
  const handleConfirm = () => {
    onConfirm?.();
  };
  
  // Build class names
  const classNames = [
    'confirm-modal',
    `confirm-modal--${actualVariant}`,
    className
  ].filter(Boolean).join(' ');
  
  // Confirm button class
  const confirmButtonClass = [
    'confirm-modal__btn',
    'confirm-modal__btn--confirm',
    `confirm-modal__btn--${actualVariant}`,
    loading && 'confirm-modal__btn--loading'
  ].filter(Boolean).join(' ');
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={MODAL_SIZES.SM}
      showCloseButton={false}
      className={classNames}
      {...props}
    >
      <div className="confirm-modal__content">
        {/* Icon */}
        <div className={`confirm-modal__icon confirm-modal__icon--${actualVariant}`}>
          {VARIANT_ICONS[actualVariant]}
        </div>
        
        {/* Title */}
        <h3 className="confirm-modal__title">{title}</h3>
        
        {/* Message */}
        {message && (
          <p className="confirm-modal__message">{message}</p>
        )}
        
        {/* Custom content */}
        {children}
        
        {/* Actions */}
        <div className="confirm-modal__actions">
          <button
            type="button"
            className="confirm-modal__btn confirm-modal__btn--cancel"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            className={confirmButtonClass}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="confirm-modal__spinner" />
            ) : null}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default ConfirmModal;