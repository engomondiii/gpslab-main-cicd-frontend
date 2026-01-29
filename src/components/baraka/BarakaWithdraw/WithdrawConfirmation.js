/**
 * GPS Lab Platform - WithdrawConfirmation Component
 * 
 * Confirmation dialog for Baraka withdrawals with
 * transaction summary and verification.
 * 
 * @module components/baraka/BarakaWithdraw/WithdrawConfirmation
 */

import React, { useState, useCallback } from 'react';
import './WithdrawConfirmation.css';

/**
 * WithdrawConfirmation Component
 */
const WithdrawConfirmation = ({
  isOpen = false,
  withdrawData = {},
  userBalance = 0,
  onConfirm,
  onCancel,
  isProcessing = false,
  className = '',
  ...props
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  if (!isOpen) return null;
  
  const {
    amount = 0,
    method = 'mpesa',
    recipient = '',
    recipientName = '',
    fee = 0,
    exchangeRate = 1,
    currency = 'KES',
    estimatedTime = '1-3 business days'
  } = withdrawData;
  
  const netAmount = amount - fee;
  const fiatAmount = netAmount * exchangeRate;
  const newBalance = userBalance - amount;
  
  const handleConfirm = useCallback(() => {
    if (!agreedToTerms) return;
    
    if (onConfirm) {
      onConfirm({
        ...withdrawData,
        verificationCode
      });
    }
  }, [withdrawData, verificationCode, agreedToTerms, onConfirm]);
  
  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget && onCancel && !isProcessing) {
      onCancel();
    }
  }, [onCancel, isProcessing]);
  
  const classNames = [
    'withdraw-confirmation',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className="withdraw-confirmation__overlay" onClick={handleOverlayClick}>
      <div className={classNames} {...props}>
        {/* Header */}
        <header className="withdraw-confirmation__header">
          <span className="withdraw-confirmation__icon">📤</span>
          <h2 className="withdraw-confirmation__title">Confirm Withdrawal</h2>
        </header>
        
        {/* Summary */}
        <div className="withdraw-confirmation__summary">
          <div className="withdraw-confirmation__row">
            <span className="withdraw-confirmation__label">Withdrawal Amount</span>
            <span className="withdraw-confirmation__value withdraw-confirmation__value--amount">
              {amount.toLocaleString()} 🪙
            </span>
          </div>
          
          <div className="withdraw-confirmation__row">
            <span className="withdraw-confirmation__label">Processing Fee</span>
            <span className="withdraw-confirmation__value withdraw-confirmation__value--fee">
              -{fee.toLocaleString()} 🪙
            </span>
          </div>
          
          <div className="withdraw-confirmation__divider" />
          
          <div className="withdraw-confirmation__row">
            <span className="withdraw-confirmation__label">Net Amount</span>
            <span className="withdraw-confirmation__value withdraw-confirmation__value--net">
              {netAmount.toLocaleString()} 🪙
            </span>
          </div>
          
          <div className="withdraw-confirmation__row">
            <span className="withdraw-confirmation__label">Exchange Rate</span>
            <span className="withdraw-confirmation__value">
              1 🪙 = {exchangeRate.toFixed(2)} {currency}
            </span>
          </div>
          
          <div className="withdraw-confirmation__row withdraw-confirmation__row--highlight">
            <span className="withdraw-confirmation__label">You'll Receive</span>
            <span className="withdraw-confirmation__value withdraw-confirmation__value--receive">
              {fiatAmount.toLocaleString()} {currency}
            </span>
          </div>
        </div>
        
        {/* Recipient Details */}
        <div className="withdraw-confirmation__recipient">
          <h4 className="withdraw-confirmation__recipient-title">Recipient</h4>
          <div className="withdraw-confirmation__recipient-details">
            <div className="withdraw-confirmation__recipient-row">
              <span className="withdraw-confirmation__recipient-label">Method</span>
              <span className="withdraw-confirmation__recipient-value">
                {method === 'mpesa' && '📱 M-Pesa'}
                {method === 'bank' && '🏦 Bank Transfer'}
                {method === 'paypal' && '💳 PayPal'}
              </span>
            </div>
            <div className="withdraw-confirmation__recipient-row">
              <span className="withdraw-confirmation__recipient-label">Account</span>
              <span className="withdraw-confirmation__recipient-value">{recipient}</span>
            </div>
            {recipientName && (
              <div className="withdraw-confirmation__recipient-row">
                <span className="withdraw-confirmation__recipient-label">Name</span>
                <span className="withdraw-confirmation__recipient-value">{recipientName}</span>
              </div>
            )}
            <div className="withdraw-confirmation__recipient-row">
              <span className="withdraw-confirmation__recipient-label">Est. Time</span>
              <span className="withdraw-confirmation__recipient-value">{estimatedTime}</span>
            </div>
          </div>
        </div>
        
        {/* Balance Impact */}
        <div className="withdraw-confirmation__balance">
          <div className="withdraw-confirmation__balance-row">
            <span>Current Balance</span>
            <span>{userBalance.toLocaleString()} 🪙</span>
          </div>
          <div className="withdraw-confirmation__balance-row">
            <span>After Withdrawal</span>
            <span>{newBalance.toLocaleString()} 🪙</span>
          </div>
        </div>
        
        {/* Verification */}
        <div className="withdraw-confirmation__verification">
          <label className="withdraw-confirmation__verification-label">
            Verification Code (if applicable)
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter code sent to your email"
            className="withdraw-confirmation__verification-input"
          />
        </div>
        
        {/* Terms */}
        <label className="withdraw-confirmation__terms">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />
          <span>
            I confirm the withdrawal details are correct and agree to the 
            <a href="/terms" target="_blank" rel="noopener"> terms of service</a>
          </span>
        </label>
        
        {/* Warning */}
        <div className="withdraw-confirmation__warning">
          <span className="withdraw-confirmation__warning-icon">⚠️</span>
          <p className="withdraw-confirmation__warning-text">
            Withdrawals are final and cannot be reversed. Please verify all details before confirming.
          </p>
        </div>
        
        {/* Actions */}
        <div className="withdraw-confirmation__actions">
          <button
            type="button"
            className="withdraw-confirmation__cancel-btn"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="button"
            className="withdraw-confirmation__confirm-btn"
            onClick={handleConfirm}
            disabled={!agreedToTerms || isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="withdraw-confirmation__spinner" />
                Processing...
              </>
            ) : (
              <>
                <span className="withdraw-confirmation__confirm-icon">✓</span>
                Confirm Withdrawal
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawConfirmation;