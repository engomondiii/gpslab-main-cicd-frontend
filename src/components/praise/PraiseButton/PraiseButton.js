/**
 * GPS Lab Platform - PraiseButton Component
 * 
 * Button to initiate praise/encouragement flow for other users.
 * Supports multiple variants and animation states.
 * 
 * @module components/praise/PraiseButton/PraiseButton
 */

import React, { useState, useCallback } from 'react';
import './PraiseButton.css';

/**
 * PraiseButton Component
 */
const PraiseButton = ({
  recipient = null,
  variant = 'default', // default, icon, text, floating
  size = 'medium', // small, medium, large
  disabled = false,
  showLabel = true,
  label = 'Give Praise',
  onClick,
  className = '',
  ...props
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [particlesVisible, setParticlesVisible] = useState(false);
  
  const handleClick = useCallback((e) => {
    if (disabled) return;
    
    // Trigger animation
    setIsAnimating(true);
    setParticlesVisible(true);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
    
    setTimeout(() => {
      setParticlesVisible(false);
    }, 1000);
    
    if (onClick) {
      onClick(recipient, e);
    }
  }, [disabled, onClick, recipient]);
  
  const classNames = [
    'praise-button',
    `praise-button--${variant}`,
    `praise-button--${size}`,
    isAnimating && 'praise-button--animating',
    disabled && 'praise-button--disabled',
    className
  ].filter(Boolean).join(' ');
  
  // Icon only variant
  if (variant === 'icon') {
    return (
      <button
        type="button"
        className={classNames}
        onClick={handleClick}
        disabled={disabled}
        title={label}
        {...props}
      >
        <span className="praise-button__icon">🎉</span>
        {particlesVisible && (
          <div className="praise-button__particles">
            <span className="praise-button__particle">✨</span>
            <span className="praise-button__particle">⭐</span>
            <span className="praise-button__particle">🌟</span>
          </div>
        )}
      </button>
    );
  }
  
  // Floating action button variant
  if (variant === 'floating') {
    return (
      <button
        type="button"
        className={classNames}
        onClick={handleClick}
        disabled={disabled}
        title={label}
        {...props}
      >
        <span className="praise-button__icon">🎉</span>
        <span className="praise-button__pulse" />
        {particlesVisible && (
          <div className="praise-button__particles">
            <span className="praise-button__particle">✨</span>
            <span className="praise-button__particle">⭐</span>
            <span className="praise-button__particle">🌟</span>
            <span className="praise-button__particle">💫</span>
          </div>
        )}
      </button>
    );
  }
  
  // Default and text variants
  return (
    <button
      type="button"
      className={classNames}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      <span className="praise-button__icon">🎉</span>
      {showLabel && (
        <span className="praise-button__label">{label}</span>
      )}
      {recipient && (
        <span className="praise-button__recipient">
          for {recipient.name || recipient}
        </span>
      )}
      {particlesVisible && (
        <div className="praise-button__particles">
          <span className="praise-button__particle">✨</span>
          <span className="praise-button__particle">⭐</span>
          <span className="praise-button__particle">🌟</span>
        </div>
      )}
    </button>
  );
};

export default PraiseButton;