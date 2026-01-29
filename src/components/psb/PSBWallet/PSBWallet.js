/**
 * GPS Lab Platform - PSBWallet Component
 * 
 * Complete wallet interface for Problem-Solving Bonds (PSB)
 * showing balance, market stats, and quick actions.
 * 
 * @module components/psb/PSBWallet/PSBWallet
 */

import React, { useState, useCallback } from 'react';
import PSBBalance from './PSBBalance';
import './PSBWallet.css';

/**
 * Quick action buttons
 */
const PSB_ACTIONS = [
  { id: 'trade', label: 'Trade', icon: '📊', color: 'primary' },
  { id: 'marketplace', label: 'Marketplace', icon: '🏪', color: 'success' },
  { id: 'stake', label: 'Stake', icon: '🔒', color: 'warning' },
  { id: 'history', label: 'History', icon: '📜', color: 'neutral' }
];

/**
 * Format number with K/M suffix
 */
const formatCompact = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
  return num.toFixed(2);
};

/**
 * Format percentage change
 */
const formatChange = (change) => {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
};

/**
 * PSBWallet Component
 */
const PSBWallet = ({
  balance = 0,
  lockedBalance = 0,
  marketValue = 0,
  pricePerPSB = 0.01,
  priceChange24h = 0,
  volume24h = 0,
  totalSupply = 0,
  circulatingSupply = 0,
  rank = null,
  onAction,
  onBalanceClick,
  showStats = true,
  showActions = true,
  showMarketData = true,
  variant = 'default', // default, compact, expanded
  className = '',
  ...props
}) => {
  const [activeView, setActiveView] = useState('overview');
  
  const handleAction = useCallback((actionId) => {
    if (onAction) {
      onAction(actionId);
    }
  }, [onAction]);
  
  const classNames = [
    'psb-wallet',
    `psb-wallet--${variant}`,
    className
  ].filter(Boolean).join(' ');
  
  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={classNames} {...props}>
        <PSBBalance
          balance={balance}
          lockedBalance={lockedBalance}
          marketValue={marketValue}
          variant="compact"
          onClick={onBalanceClick}
        />
        {showActions && (
          <div className="psb-wallet__quick-actions psb-wallet__quick-actions--compact">
            <button
              type="button"
              className="psb-wallet__quick-btn"
              onClick={() => handleAction('trade')}
              title="Trade PSB"
            >
              📊
            </button>
            <button
              type="button"
              className="psb-wallet__quick-btn"
              onClick={() => handleAction('marketplace')}
              title="Marketplace"
            >
              🏪
            </button>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <header className="psb-wallet__header">
        <div className="psb-wallet__header-content">
          <h2 className="psb-wallet__title">
            <span className="psb-wallet__title-icon">💎</span>
            PSB Wallet
          </h2>
          <p className="psb-wallet__subtitle">
            Problem-Solving Bonds
          </p>
        </div>
        
        {/* Price Ticker */}
        {showMarketData && (
          <div className="psb-wallet__ticker">
            <span className="psb-wallet__price">
              ${pricePerPSB.toFixed(4)}
            </span>
            <span className={`psb-wallet__change ${priceChange24h >= 0 ? 'psb-wallet__change--positive' : 'psb-wallet__change--negative'}`}>
              {formatChange(priceChange24h)}
            </span>
          </div>
        )}
      </header>
      
      {/* Balance */}
      <div className="psb-wallet__balance-section">
        <PSBBalance
          balance={balance}
          lockedBalance={lockedBalance}
          marketValue={marketValue}
          variant={variant === 'expanded' ? 'large' : 'card'}
          onClick={onBalanceClick}
          showMarketValue={true}
        />
      </div>
      
      {/* Quick Actions */}
      {showActions && (
        <div className="psb-wallet__actions">
          {PSB_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              className={`psb-wallet__action psb-wallet__action--${action.color}`}
              onClick={() => handleAction(action.id)}
            >
              <span className="psb-wallet__action-icon">{action.icon}</span>
              <span className="psb-wallet__action-label">{action.label}</span>
            </button>
          ))}
        </div>
      )}
      
      {/* Market Stats */}
      {showStats && showMarketData && (
        <div className="psb-wallet__stats">
          <div className="psb-wallet__stat">
            <span className="psb-wallet__stat-icon">📈</span>
            <div className="psb-wallet__stat-content">
              <span className="psb-wallet__stat-value">${formatCompact(volume24h)}</span>
              <span className="psb-wallet__stat-label">24h Volume</span>
            </div>
          </div>
          
          <div className="psb-wallet__stat">
            <span className="psb-wallet__stat-icon">💰</span>
            <div className="psb-wallet__stat-content">
              <span className="psb-wallet__stat-value">{formatCompact(circulatingSupply)}</span>
              <span className="psb-wallet__stat-label">Circulating</span>
            </div>
          </div>
          
          <div className="psb-wallet__stat">
            <span className="psb-wallet__stat-icon">🔢</span>
            <div className="psb-wallet__stat-content">
              <span className="psb-wallet__stat-value">{formatCompact(totalSupply)}</span>
              <span className="psb-wallet__stat-label">Total Supply</span>
            </div>
          </div>
          
          {rank && (
            <div className="psb-wallet__stat psb-wallet__stat--highlight">
              <span className="psb-wallet__stat-icon">🏆</span>
              <div className="psb-wallet__stat-content">
                <span className="psb-wallet__stat-value">#{rank}</span>
                <span className="psb-wallet__stat-label">Your Rank</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Portfolio Distribution */}
      {showStats && balance > 0 && (
        <div className="psb-wallet__portfolio">
          <h4 className="psb-wallet__portfolio-title">Portfolio</h4>
          <div className="psb-wallet__portfolio-bars">
            <div className="psb-wallet__portfolio-bar">
              <div className="psb-wallet__portfolio-bar-header">
                <span>Available</span>
                <span>{((balance / (balance + lockedBalance)) * 100).toFixed(1)}%</span>
              </div>
              <div className="psb-wallet__portfolio-bar-track">
                <div 
                  className="psb-wallet__portfolio-bar-fill psb-wallet__portfolio-bar-fill--available"
                  style={{ width: `${(balance / (balance + lockedBalance)) * 100}%` }}
                />
              </div>
            </div>
            {lockedBalance > 0 && (
              <div className="psb-wallet__portfolio-bar">
                <div className="psb-wallet__portfolio-bar-header">
                  <span>Locked</span>
                  <span>{((lockedBalance / (balance + lockedBalance)) * 100).toFixed(1)}%</span>
                </div>
                <div className="psb-wallet__portfolio-bar-track">
                  <div 
                    className="psb-wallet__portfolio-bar-fill psb-wallet__portfolio-bar-fill--locked"
                    style={{ width: `${(lockedBalance / (balance + lockedBalance)) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Glow Effect */}
      <div className="psb-wallet__glow" />
    </div>
  );
};

export default PSBWallet;