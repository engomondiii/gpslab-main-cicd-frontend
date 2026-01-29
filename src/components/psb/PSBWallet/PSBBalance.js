/**
 * GPS Lab Platform - PSBBalance Component
 * 
 * Displays the user's Problem-Solving Bonds (PSB) balance.
 * PSB is an advanced currency earned through sustained excellence
 * and can be traded on the marketplace.
 * 
 * PSB is earned through:
 * - Stage completion bonuses
 * - Project success milestones
 * - Community leadership
 * - Long-term achievements
 * 
 * @module components/psb/PSBWallet/PSBBalance
 */

import React, { useState, useEffect, useRef } from 'react';
import './PSBBalance.css';

/**
 * Format number with commas and decimals
 */
const formatNumber = (num, decimals = 2) => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * PSBBalance Component
 */
const PSBBalance = ({
  balance = 0,
  lockedBalance = 0,
  marketValue = 0,
  previousBalance = null,
  showChange = true,
  variant = 'default', // default, compact, large, card
  animated = true,
  showMarketValue = true,
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
          setDisplayBalance(prevBalance + stepValue * currentStep);
        }
      }, stepDuration);
      
      prevBalanceRef.current = balance;
      
      return () => clearInterval(interval);
    }
  }, [balance, animated]);
  
  const totalBalance = balance + lockedBalance;
  
  const classNames = [
    'psb-balance',
    `psb-balance--${variant}`,
    isAnimating && 'psb-balance--animating',
    changeAmount > 0 && 'psb-balance--increase',
    changeAmount < 0 && 'psb-balance--decrease',
    onClick && 'psb-balance--clickable',
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
        <span className="psb-balance__icon">💎</span>
        <span className="psb-balance__value">{formatNumber(displayBalance)}</span>
        <span className="psb-balance__label">PSB</span>
        {isAnimating && showChange && (
          <span className="psb-balance__change">
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
        <div className="psb-balance__gem-container">
          <span className="psb-balance__gem">💎</span>
          <div className="psb-balance__gem-glow" />
        </div>
        <div className="psb-balance__content">
          <span className="psb-balance__label">Problem-Solving Bonds</span>
          <span className="psb-balance__value">{formatNumber(displayBalance)}</span>
          {lockedBalance > 0 && (
            <span className="psb-balance__locked">
              🔒 {formatNumber(lockedBalance)} locked
            </span>
          )}
          {showMarketValue && marketValue > 0 && (
            <span className="psb-balance__market-value">
              ≈ ${formatNumber(marketValue)} market value
            </span>
          )}
        </div>
        {isAnimating && showChange && (
          <div className="psb-balance__change-popup">
            {changeAmount > 0 ? '+' : ''}{formatNumber(changeAmount)} PSB
          </div>
        )}
      </div>
    );
  }
  
  // Card variant
  if (variant === 'card') {
    return (
      <div className={classNames} onClick={handleClick} {...props}>
        <div className="psb-balance__card-header">
          <span className="psb-balance__card-icon">💎</span>
          <span className="psb-balance__card-title">PSB</span>
        </div>
        <div className="psb-balance__card-body">
          <span className="psb-balance__value">{formatNumber(displayBalance)}</span>
          {isAnimating && showChange && (
            <span className="psb-balance__change">
              {changeAmount > 0 ? '+' : ''}{formatNumber(changeAmount)}
            </span>
          )}
        </div>
        <div className="psb-balance__card-footer">
          {lockedBalance > 0 && (
            <div className="psb-balance__card-stat">
              <span className="psb-balance__card-stat-label">Locked</span>
              <span className="psb-balance__card-stat-value">{formatNumber(lockedBalance)}</span>
            </div>
          )}
          {showMarketValue && (
            <div className="psb-balance__card-stat">
              <span className="psb-balance__card-stat-label">Value</span>
              <span className="psb-balance__card-stat-value">${formatNumber(marketValue)}</span>
            </div>
          )}
        </div>
        <div className="psb-balance__card-glow" />
      </div>
    );
  }
  
  // Default variant
  return (
    <div className={classNames} onClick={handleClick} {...props}>
      <span className="psb-balance__icon">💎</span>
      <div className="psb-balance__content">
        <span className="psb-balance__label">PSB</span>
        <span className="psb-balance__value">{formatNumber(displayBalance)}</span>
      </div>
      {isAnimating && showChange && (
        <span className="psb-balance__change">
          {changeAmount > 0 ? '+' : ''}{formatNumber(changeAmount)}
        </span>
      )}
    </div>
  );
};

export default PSBBalance;