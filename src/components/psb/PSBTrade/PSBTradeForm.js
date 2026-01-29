/**
 * GPS Lab Platform - PSBTradeForm Component
 * 
 * Form for creating buy/sell orders for PSB with
 * price setting, amount input, and order preview.
 * 
 * @module components/psb/PSBTrade/PSBTradeForm
 */

import React, { useState, useCallback, useMemo } from 'react';
import './PSBTradeForm.css';

/**
 * Format number with decimals
 */
const formatNumber = (num, decimals = 2) => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * PSBTradeForm Component
 */
const PSBTradeForm = ({
  currentPrice = 0.01,
  userBalance = 0,
  userPSBBalance = 0,
  minOrder = 1,
  maxOrder = 10000,
  tradingFeePercent = 1,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = '',
  ...props
}) => {
  const [orderType, setOrderType] = useState('buy'); // buy, sell
  const [priceType, setPriceType] = useState('market'); // market, limit
  const [amount, setAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState(currentPrice.toFixed(4));
  const [errors, setErrors] = useState({});
  
  // Calculate order details
  const orderDetails = useMemo(() => {
    const numAmount = parseFloat(amount) || 0;
    const price = priceType === 'market' ? currentPrice : (parseFloat(limitPrice) || 0);
    const subtotal = numAmount * price;
    const fee = subtotal * (tradingFeePercent / 100);
    const total = orderType === 'buy' ? subtotal + fee : subtotal - fee;
    
    return {
      amount: numAmount,
      price,
      subtotal,
      fee,
      total,
      priceImpact: priceType === 'market' ? 0 : ((price - currentPrice) / currentPrice) * 100
    };
  }, [amount, limitPrice, priceType, currentPrice, orderType, tradingFeePercent]);
  
  // Validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    const numAmount = parseFloat(amount) || 0;
    const price = priceType === 'market' ? currentPrice : (parseFloat(limitPrice) || 0);
    
    if (numAmount < minOrder) {
      newErrors.amount = `Minimum order is ${minOrder} PSB`;
    } else if (numAmount > maxOrder) {
      newErrors.amount = `Maximum order is ${maxOrder} PSB`;
    }
    
    if (orderType === 'buy') {
      const required = numAmount * price * (1 + tradingFeePercent / 100);
      if (required > userBalance) {
        newErrors.amount = `Insufficient Baraka balance (need ${formatNumber(required)} 🪙)`;
      }
    } else {
      if (numAmount > userPSBBalance) {
        newErrors.amount = `Insufficient PSB balance (have ${formatNumber(userPSBBalance)} 💎)`;
      }
    }
    
    if (priceType === 'limit' && price <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [amount, limitPrice, priceType, currentPrice, orderType, userBalance, userPSBBalance, minOrder, maxOrder, tradingFeePercent]);
  
  const handleAmountChange = useCallback((e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
    setErrors((prev) => ({ ...prev, amount: null }));
  }, []);
  
  const handlePriceChange = useCallback((e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setLimitPrice(value);
    setErrors((prev) => ({ ...prev, price: null }));
  }, []);
  
  const handlePercentClick = useCallback((percent) => {
    const maxAvailable = orderType === 'buy'
      ? userBalance / (currentPrice * (1 + tradingFeePercent / 100))
      : userPSBBalance;
    
    const newAmount = Math.min(maxAvailable * (percent / 100), maxOrder);
    setAmount(newAmount.toFixed(2));
    setErrors((prev) => ({ ...prev, amount: null }));
  }, [orderType, userBalance, userPSBBalance, currentPrice, tradingFeePercent, maxOrder]);
  
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (validateForm() && onSubmit) {
      onSubmit({
        type: orderType,
        priceType,
        amount: parseFloat(amount),
        pricePerPSB: priceType === 'market' ? currentPrice : parseFloat(limitPrice),
        total: orderDetails.total,
        fee: orderDetails.fee
      });
    }
  }, [validateForm, onSubmit, orderType, priceType, amount, limitPrice, currentPrice, orderDetails]);
  
  const classNames = [
    'psb-trade-form',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <form className={classNames} onSubmit={handleSubmit} {...props}>
      {/* Header */}
      <header className="psb-trade-form__header">
        <h3 className="psb-trade-form__title">
          <span className="psb-trade-form__title-icon">📊</span>
          Create Order
        </h3>
        <div className="psb-trade-form__current-price">
          <span className="psb-trade-form__price-label">Market Price</span>
          <span className="psb-trade-form__price-value">${currentPrice.toFixed(4)}</span>
        </div>
      </header>
      
      {/* Order Type Toggle */}
      <div className="psb-trade-form__type-toggle">
        <button
          type="button"
          className={`psb-trade-form__type-btn psb-trade-form__type-btn--buy ${orderType === 'buy' ? 'psb-trade-form__type-btn--active' : ''}`}
          onClick={() => setOrderType('buy')}
        >
          <span className="psb-trade-form__type-icon">📥</span>
          Buy PSB
        </button>
        <button
          type="button"
          className={`psb-trade-form__type-btn psb-trade-form__type-btn--sell ${orderType === 'sell' ? 'psb-trade-form__type-btn--active' : ''}`}
          onClick={() => setOrderType('sell')}
        >
          <span className="psb-trade-form__type-icon">📤</span>
          Sell PSB
        </button>
      </div>
      
      {/* Balance Display */}
      <div className="psb-trade-form__balance">
        <span className="psb-trade-form__balance-label">Available</span>
        <span className="psb-trade-form__balance-value">
          {orderType === 'buy' 
            ? `${formatNumber(userBalance)} 🪙 Baraka`
            : `${formatNumber(userPSBBalance)} 💎 PSB`}
        </span>
      </div>
      
      {/* Price Type */}
      <div className="psb-trade-form__section">
        <div className="psb-trade-form__price-type">
          <button
            type="button"
            className={`psb-trade-form__price-btn ${priceType === 'market' ? 'psb-trade-form__price-btn--active' : ''}`}
            onClick={() => setPriceType('market')}
          >
            Market
          </button>
          <button
            type="button"
            className={`psb-trade-form__price-btn ${priceType === 'limit' ? 'psb-trade-form__price-btn--active' : ''}`}
            onClick={() => setPriceType('limit')}
          >
            Limit
          </button>
        </div>
      </div>
      
      {/* Limit Price Input */}
      {priceType === 'limit' && (
        <div className="psb-trade-form__section">
          <label className="psb-trade-form__label">Price per PSB</label>
          <div className="psb-trade-form__input-wrapper">
            <span className="psb-trade-form__input-prefix">$</span>
            <input
              type="text"
              value={limitPrice}
              onChange={handlePriceChange}
              placeholder="0.0000"
              className={`psb-trade-form__input ${errors.price ? 'psb-trade-form__input--error' : ''}`}
            />
          </div>
          {errors.price && (
            <span className="psb-trade-form__error">{errors.price}</span>
          )}
          {orderDetails.priceImpact !== 0 && (
            <span className={`psb-trade-form__price-diff ${orderDetails.priceImpact > 0 ? 'psb-trade-form__price-diff--above' : 'psb-trade-form__price-diff--below'}`}>
              {orderDetails.priceImpact > 0 ? '↑' : '↓'} {Math.abs(orderDetails.priceImpact).toFixed(2)}% vs market
            </span>
          )}
        </div>
      )}
      
      {/* Amount Input */}
      <div className="psb-trade-form__section">
        <label className="psb-trade-form__label">Amount (PSB)</label>
        <div className="psb-trade-form__input-wrapper">
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            className={`psb-trade-form__input ${errors.amount ? 'psb-trade-form__input--error' : ''}`}
          />
          <span className="psb-trade-form__input-suffix">💎</span>
        </div>
        {errors.amount && (
          <span className="psb-trade-form__error">{errors.amount}</span>
        )}
        
        {/* Percent Buttons */}
        <div className="psb-trade-form__percent-btns">
          {[25, 50, 75, 100].map((percent) => (
            <button
              key={percent}
              type="button"
              className="psb-trade-form__percent-btn"
              onClick={() => handlePercentClick(percent)}
            >
              {percent}%
            </button>
          ))}
        </div>
      </div>
      
      {/* Order Summary */}
      <div className="psb-trade-form__summary">
        <div className="psb-trade-form__summary-row">
          <span>Price</span>
          <span>${formatNumber(orderDetails.price, 4)} per PSB</span>
        </div>
        <div className="psb-trade-form__summary-row">
          <span>Subtotal</span>
          <span>${formatNumber(orderDetails.subtotal)}</span>
        </div>
        <div className="psb-trade-form__summary-row">
          <span>Fee ({tradingFeePercent}%)</span>
          <span>${formatNumber(orderDetails.fee)}</span>
        </div>
        <div className="psb-trade-form__summary-row psb-trade-form__summary-row--total">
          <span>{orderType === 'buy' ? 'Total Cost' : 'You Receive'}</span>
          <span>
            {orderType === 'buy' 
              ? `${formatNumber(orderDetails.total)} 🪙`
              : `${formatNumber(orderDetails.total)} 🪙`}
          </span>
        </div>
      </div>
      
      {/* Actions */}
      <div className="psb-trade-form__actions">
        {onCancel && (
          <button
            type="button"
            className="psb-trade-form__cancel-btn"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={`psb-trade-form__submit-btn psb-trade-form__submit-btn--${orderType}`}
          disabled={isSubmitting || !amount}
        >
          {isSubmitting ? (
            <>
              <span className="psb-trade-form__spinner" />
              Processing...
            </>
          ) : (
            <>
              {orderType === 'buy' ? '📥 Buy' : '📤 Sell'} {amount || '0'} PSB
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PSBTradeForm;