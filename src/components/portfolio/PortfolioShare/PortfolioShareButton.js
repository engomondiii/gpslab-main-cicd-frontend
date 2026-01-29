/**
 * GPS Lab Platform - PortfolioShareButton Component
 * 
 * Button to trigger portfolio sharing modal.
 * 
 * @module components/portfolio/PortfolioShare/PortfolioShareButton
 */

import React from 'react';
import './PortfolioShareButton.css';

/**
 * PortfolioShareButton Component
 */
const PortfolioShareButton = ({
  onClick,
  variant = 'default', // default, icon, text
  size = 'medium', // small, medium, large
  disabled = false,
  className = '',
  ...props
}) => {
  const classNames = [
    'portfolio-share-button',
    `portfolio-share-button--${variant}`,
    `portfolio-share-button--${size}`,
    disabled && 'portfolio-share-button--disabled',
    className
  ].filter(Boolean).join(' ');
  
  // Icon only variant
  if (variant === 'icon') {
    return (
      <button
        type="button"
        className={classNames}
        onClick={onClick}
        disabled={disabled}
        title="Share Portfolio"
        {...props}
      >
        <span className="portfolio-share-button__icon">🔗</span>
      </button>
    );
  }
  
  // Text only variant
  if (variant === 'text') {
    return (
      <button
        type="button"
        className={classNames}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        Share Portfolio
      </button>
    );
  }
  
  // Default variant with icon and text
  return (
    <button
      type="button"
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <span className="portfolio-share-button__icon">🔗</span>
      <span className="portfolio-share-button__text">Share</span>
    </button>
  );
};

export default PortfolioShareButton;