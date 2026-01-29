/**
 * GPS Lab Platform - BarakaBalance Component
 * 
 * Displays the user's Baraka balance with animated counter
 * and visual feedback for balance changes.
 * 
 * Baraka (🪙) is the GPS Lab virtual currency earned through:
 * - Completing bites (10-50 Baraka)
 * - Completing checkpoints (100-500 Baraka)
 * - Giving praise (+5 Baraka)
 * - Helping party members
 * - Daily login streaks
 * 
 * @module components/baraka/BarakaWallet/BarakaBalance
 */

import React, { useState, useEffect, useRef } from 'react';
import './BarakaBalance.css';

/**
 * Format number with commas
 */
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * BarakaBalance Component
 */
const BarakaBalance = ({
  balance = 0,
  pendingBalance = 0,
  previousBalance = null,
  showChange = true,
  variant = 'default', // default, compact, large, card
  animated = true,
  showPending = true,
  onClick,
  className = '',
  ...props
}) => {
  const [displayBalance, setDisplayBalance] = useState(balance);
  const [isAnimating, setIsAnimating] = useState(false);
  const [changeAmount, setChangeAmount] = useState(0);
  const prevBalanceRef = useRef(balance);
  
  // Animate balance changes
  useEffect(() => {
    if (!animated) {
      setDisplayBalance(balance);
      return;
    }
    
    const prevBalance = prevBalanceRef.current;
    const diff = balance - prevBalance;
    
    if (diff !== 0) {
      setIsAnimating(true);
      setChangeAmount(diff);
      
      // Animate counter
      const duration = 1000;
      const steps = 30;
      const stepValue = diff / steps;
      const stepDuration = duration / steps;
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayBalance(balance);
          clearInterval(interval);
          setTimeout(() => {
            setIsAnimating(false);
            setChangeAmount(0);
          }, 1500);
        } else {
          setDisplayBalance(Math.round(prevBalance + stepValue * currentStep));
        }
      }, stepDuration);
      
      prevBalanceRef.current = balance;
      
      return () => clearInterval(interval);
    }
  }, [balance, animated]);
  
  const classNames = [
    'baraka-balance',
    `baraka-balance--${variant}`,
    isAnimating && 'baraka-balance--animating',
    changeAmount > 0 && 'baraka-balance--increase',
    changeAmount < 0 && 'baraka-balance--decrease',
    onClick && 'baraka-balance--clickable',
    className
  ].filter(Boolean).join(' ');
  
  const handleClick = () => {
    if (onClick) onClick();
  };
  
  // Compact variant
  if (variant === 'compact') {
    return (
      <button
        type="button"
        className={classNames}
        onClick={handleClick}
        disabled={!onClick}
        {...props}
      >
        <span className="baraka-balance__icon">🪙</span>
        <span className="baraka-balance__value">{formatNumber(displayBalance)}</span>
        {isAnimating && showChange && (
          <span className="baraka-balance__change">
            {changeAmount > 0 ? '+' : ''}{formatNumber(changeAmount)}
          </span>
        )}
      </button>
    );
  }
  
  // Large variant
  if (variant === 'large') {
    return (
      <div className={classNames} onClick={handleClick} {...props}>
        <div className="baraka-balance__coin-stack">
          <span className="baraka-balance__coin baraka-balance__coin--1">🪙</span>
          <span className="baraka-balance__coin baraka-balance__coin--2">🪙</span>
          <span className="baraka-balance__coin baraka-balance__coin--3">🪙</span>
        </div>
        <div className="baraka-balance__content">
          <span className="baraka-balance__label">Baraka Balance</span>
          <span className="baraka-balance__value">{formatNumber(displayBalance)}</span>
          {showPending && pendingBalance > 0 && (
            <span className="baraka-balance__pending">
              +{formatNumber(pendingBalance)} pending
            </span>
          )}
        </div>
        {isAnimating && showChange && (
          <div className="baraka-balance__change-popup">
            {changeAmount > 0 ? '+' : ''}{formatNumber(changeAmount)} 🪙
          </div>
        )}
      </div>
    );
  }
  
  // Card variant
  if (variant === 'card') {
    return (
      <div className={classNames} onClick={handleClick} {...props}>
        <div className="baraka-balance__card-header">
          <span className="baraka-balance__card-icon">🪙</span>
          <span className="baraka-balance__card-title">Baraka</span>
        </div>
        <div className="baraka-balance__card-body">
          <span className="baraka-balance__value">{formatNumber(displayBalance)}</span>
          {isAnimating && showChange && (
            <span className="baraka-balance__change">
              {changeAmount > 0 ? '+' : ''}{formatNumber(changeAmount)}
            </span>
          )}
        </div>
        {showPending && pendingBalance > 0 && (
          <div className="baraka-balance__card-footer">
            <span className="baraka-balance__pending-label">Pending:</span>
            <span className="baraka-balance__pending-value">+{formatNumber(pendingBalance)}</span>
          </div>
        )}
        <div className="baraka-balance__card-glow" />
      </div>
    );
  }
  
  // Default variant
  return (
    <div className={classNames} onClick={handleClick} {...props}>
      <span className="baraka-balance__icon">🪙</span>
      <div className="baraka-balance__content">
        <span className="baraka-balance__label">Baraka</span>
        <span className="baraka-balance__value">{formatNumber(displayBalance)}</span>
      </div>
      {isAnimating && showChange && (
        <span className="baraka-balance__change">
          {changeAmount > 0 ? '+' : ''}{formatNumber(changeAmount)}
        </span>
      )}
      {showPending && pendingBalance > 0 && (
        <span className="baraka-balance__pending">
          +{formatNumber(pendingBalance)}
        </span>
      )}
    </div>
  );
};

export default BarakaBalance;