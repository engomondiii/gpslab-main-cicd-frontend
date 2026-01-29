/**
 * GPS Lab Platform - BarakaWithdrawForm Component
 * 
 * Form for initiating Baraka withdrawals with
 * method selection, amount input, and validation.
 * 
 * @module components/baraka/BarakaWithdraw/BarakaWithdrawForm
 */

import React, { useState, useCallback, useMemo } from 'react';
import WithdrawConfirmation from './WithdrawConfirmation';
import './BarakaWithdrawForm.css';

/**
 * Withdrawal methods
 */
const WITHDRAWAL_METHODS = [
  {
    id: 'mpesa',
    name: 'M-Pesa',
    icon: '📱',
    description: 'Mobile money transfer',
    currencies: ['KES'],
    minAmount: 100,
    maxAmount: 50000,
    fee: 10,
    feePercent: 0,
    exchangeRate: 0.5, // 1 Baraka = 0.5 KES
    estimatedTime: 'Instant - 24 hours'
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: '🏦',
    description: 'Direct bank deposit',
    currencies: ['KES', 'USD'],
    minAmount: 500,
    maxAmount: 100000,
    fee: 50,
    feePercent: 1,
    exchangeRate: 0.5,
    estimatedTime: '1-3 business days'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '💳',
    description: 'International transfers',
    currencies: ['USD'],
    minAmount: 1000,
    maxAmount: 50000,
    fee: 25,
    feePercent: 2.5,
    exchangeRate: 0.005, // 1 Baraka = 0.005 USD
    estimatedTime: '1-5 business days'
  }
];

/**
 * Quick amount options
 */
const QUICK_AMOUNTS = [100, 500, 1000, 5000, 10000];

/**
 * BarakaWithdrawForm Component
 */
const BarakaWithdrawForm = ({
  userBalance = 0,
  onSubmit,
  onCancel,
  isProcessing = false,
  className = '',
  ...props
}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('KES');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Calculate fees and totals
  const calculations = useMemo(() => {
    if (!selectedMethod || !amount) {
      return { fee: 0, netAmount: 0, fiatAmount: 0 };
    }
    
    const numAmount = parseInt(amount, 10) || 0;
    const baseFee = selectedMethod.fee;
    const percentFee = Math.ceil(numAmount * (selectedMethod.feePercent / 100));
    const totalFee = baseFee + percentFee;
    const netAmount = Math.max(0, numAmount - totalFee);
    const exchangeRate = selectedCurrency === 'USD' 
      ? selectedMethod.exchangeRate / 100 
      : selectedMethod.exchangeRate;
    const fiatAmount = netAmount * exchangeRate;
    
    return { fee: totalFee, netAmount, fiatAmount, exchangeRate };
  }, [selectedMethod, amount, selectedCurrency]);
  
  // Validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    const numAmount = parseInt(amount, 10) || 0;
    
    if (!selectedMethod) {
      newErrors.method = 'Please select a withdrawal method';
    }
    
    if (!amount || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (selectedMethod) {
      if (numAmount < selectedMethod.minAmount) {
        newErrors.amount = `Minimum withdrawal is ${selectedMethod.minAmount} 🪙`;
      } else if (numAmount > selectedMethod.maxAmount) {
        newErrors.amount = `Maximum withdrawal is ${selectedMethod.maxAmount} 🪙`;
      } else if (numAmount > userBalance) {
        newErrors.amount = 'Insufficient balance';
      }
    }
    
    if (!recipient.trim()) {
      newErrors.recipient = 'Please enter recipient details';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [selectedMethod, amount, recipient, userBalance]);
  
  const handleAmountChange = useCallback((e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
    setErrors((prev) => ({ ...prev, amount: null }));
  }, []);
  
  const handleQuickAmount = useCallback((quickAmount) => {
    setAmount(quickAmount.toString());
    setErrors((prev) => ({ ...prev, amount: null }));
  }, []);
  
  const handleMethodSelect = useCallback((method) => {
    setSelectedMethod(method);
    setSelectedCurrency(method.currencies[0]);
    setErrors((prev) => ({ ...prev, method: null }));
  }, []);
  
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setShowConfirmation(true);
    }
  }, [validateForm]);
  
  const handleConfirm = useCallback(async (data) => {
    if (onSubmit) {
      await onSubmit({
        method: selectedMethod.id,
        amount: parseInt(amount, 10),
        recipient,
        recipientName,
        currency: selectedCurrency,
        ...calculations,
        ...data
      });
    }
    setShowConfirmation(false);
  }, [selectedMethod, amount, recipient, recipientName, selectedCurrency, calculations, onSubmit]);
  
  const classNames = [
    'baraka-withdraw-form',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <>
      <form className={classNames} onSubmit={handleSubmit} {...props}>
        {/* Header */}
        <header className="baraka-withdraw-form__header">
          <h2 className="baraka-withdraw-form__title">
            <span className="baraka-withdraw-form__title-icon">📤</span>
            Withdraw Baraka
          </h2>
          <p className="baraka-withdraw-form__subtitle">
            Convert your Baraka to real currency
          </p>
        </header>
        
        {/* Balance */}
        <div className="baraka-withdraw-form__balance">
          <span className="baraka-withdraw-form__balance-label">Available Balance</span>
          <span className="baraka-withdraw-form__balance-value">
            {userBalance.toLocaleString()} 🪙
          </span>
        </div>
        
        {/* Method Selection */}
        <div className="baraka-withdraw-form__section">
          <label className="baraka-withdraw-form__label">Withdrawal Method</label>
          <div className="baraka-withdraw-form__methods">
            {WITHDRAWAL_METHODS.map((method) => (
              <button
                key={method.id}
                type="button"
                className={`baraka-withdraw-form__method ${selectedMethod?.id === method.id ? 'baraka-withdraw-form__method--selected' : ''}`}
                onClick={() => handleMethodSelect(method)}
              >
                <span className="baraka-withdraw-form__method-icon">{method.icon}</span>
                <div className="baraka-withdraw-form__method-content">
                  <span className="baraka-withdraw-form__method-name">{method.name}</span>
                  <span className="baraka-withdraw-form__method-desc">{method.description}</span>
                </div>
                {selectedMethod?.id === method.id && (
                  <span className="baraka-withdraw-form__method-check">✓</span>
                )}
              </button>
            ))}
          </div>
          {errors.method && (
            <span className="baraka-withdraw-form__error">{errors.method}</span>
          )}
        </div>
        
        {/* Amount */}
        <div className="baraka-withdraw-form__section">
          <label className="baraka-withdraw-form__label">Amount</label>
          <div className="baraka-withdraw-form__amount-input">
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className={`baraka-withdraw-form__input ${errors.amount ? 'baraka-withdraw-form__input--error' : ''}`}
            />
            <span className="baraka-withdraw-form__input-suffix">🪙</span>
          </div>
          {selectedMethod && (
            <span className="baraka-withdraw-form__hint">
              Min: {selectedMethod.minAmount.toLocaleString()} 🪙 | Max: {selectedMethod.maxAmount.toLocaleString()} 🪙
            </span>
          )}
          {errors.amount && (
            <span className="baraka-withdraw-form__error">{errors.amount}</span>
          )}
          
          {/* Quick Amounts */}
          <div className="baraka-withdraw-form__quick-amounts">
            {QUICK_AMOUNTS.map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                className={`baraka-withdraw-form__quick-btn ${amount === quickAmount.toString() ? 'baraka-withdraw-form__quick-btn--active' : ''}`}
                onClick={() => handleQuickAmount(quickAmount)}
                disabled={quickAmount > userBalance}
              >
                {quickAmount.toLocaleString()}
              </button>
            ))}
            <button
              type="button"
              className="baraka-withdraw-form__quick-btn baraka-withdraw-form__quick-btn--max"
              onClick={() => handleQuickAmount(Math.min(userBalance, selectedMethod?.maxAmount || userBalance))}
            >
              MAX
            </button>
          </div>
        </div>
        
        {/* Currency Selection (if multiple) */}
        {selectedMethod && selectedMethod.currencies.length > 1 && (
          <div className="baraka-withdraw-form__section">
            <label className="baraka-withdraw-form__label">Currency</label>
            <div className="baraka-withdraw-form__currencies">
              {selectedMethod.currencies.map((currency) => (
                <button
                  key={currency}
                  type="button"
                  className={`baraka-withdraw-form__currency ${selectedCurrency === currency ? 'baraka-withdraw-form__currency--selected' : ''}`}
                  onClick={() => setSelectedCurrency(currency)}
                >
                  {currency}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Recipient Details */}
        <div className="baraka-withdraw-form__section">
          <label className="baraka-withdraw-form__label">
            {selectedMethod?.id === 'mpesa' && 'Phone Number'}
            {selectedMethod?.id === 'bank' && 'Account Number'}
            {selectedMethod?.id === 'paypal' && 'PayPal Email'}
            {!selectedMethod && 'Recipient'}
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => {
              setRecipient(e.target.value);
              setErrors((prev) => ({ ...prev, recipient: null }));
            }}
            placeholder={
              selectedMethod?.id === 'mpesa' ? '+254 7XX XXX XXX' :
              selectedMethod?.id === 'bank' ? 'Enter account number' :
              selectedMethod?.id === 'paypal' ? 'email@example.com' :
              'Enter recipient details'
            }
            className={`baraka-withdraw-form__input ${errors.recipient ? 'baraka-withdraw-form__input--error' : ''}`}
          />
          {errors.recipient && (
            <span className="baraka-withdraw-form__error">{errors.recipient}</span>
          )}
        </div>
        
        {/* Recipient Name */}
        <div className="baraka-withdraw-form__section">
          <label className="baraka-withdraw-form__label">
            Recipient Name (Optional)
          </label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Enter recipient name"
            className="baraka-withdraw-form__input"
          />
        </div>
        
        {/* Summary */}
        {selectedMethod && amount && (
          <div className="baraka-withdraw-form__summary">
            <h4 className="baraka-withdraw-form__summary-title">Summary</h4>
            <div className="baraka-withdraw-form__summary-row">
              <span>Withdrawal Amount</span>
              <span>{parseInt(amount, 10).toLocaleString()} 🪙</span>
            </div>
            <div className="baraka-withdraw-form__summary-row">
              <span>Processing Fee</span>
              <span>-{calculations.fee.toLocaleString()} 🪙</span>
            </div>
            <div className="baraka-withdraw-form__summary-row baraka-withdraw-form__summary-row--total">
              <span>You'll Receive</span>
              <span>{calculations.fiatAmount.toLocaleString()} {selectedCurrency}</span>
            </div>
            <div className="baraka-withdraw-form__summary-row baraka-withdraw-form__summary-row--rate">
              <span>Exchange Rate</span>
              <span>1 🪙 = {calculations.exchangeRate} {selectedCurrency}</span>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="baraka-withdraw-form__actions">
          {onCancel && (
            <button
              type="button"
              className="baraka-withdraw-form__cancel-btn"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="baraka-withdraw-form__submit-btn"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="baraka-withdraw-form__spinner" />
                Processing...
              </>
            ) : (
              'Continue to Confirm'
            )}
          </button>
        </div>
      </form>
      
      {/* Confirmation Modal */}
      <WithdrawConfirmation
        isOpen={showConfirmation}
        withdrawData={{
          amount: parseInt(amount, 10) || 0,
          method: selectedMethod?.id,
          recipient,
          recipientName,
          fee: calculations.fee,
          exchangeRate: calculations.exchangeRate,
          currency: selectedCurrency,
          estimatedTime: selectedMethod?.estimatedTime
        }}
        userBalance={userBalance}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmation(false)}
        isProcessing={isProcessing}
      />
    </>
  );
};

export { WITHDRAWAL_METHODS, QUICK_AMOUNTS };
export default BarakaWithdrawForm;