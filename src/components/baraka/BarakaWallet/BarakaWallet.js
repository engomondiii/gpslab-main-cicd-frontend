/**
 * GPS Lab Platform - BarakaWallet Component
 * 
 * Complete wallet interface showing balance, quick actions,
 * and summary statistics for the Baraka economy.
 * 
 * @module components/baraka/BarakaWallet/BarakaWallet
 */

import React, { useState, useCallback } from 'react';
import BarakaBalance from './BarakaBalance';
import './BarakaWallet.css';

/**
 * Quick action buttons
 */
const QUICK_ACTIONS = [
  { id: 'earn', label: 'Earn', icon: '💰', color: 'success' },
  { id: 'spend', label: 'Store', icon: '🛒', color: 'primary' },
  { id: 'send', label: 'Send', icon: '📤', color: 'warning' },
  { id: 'history', label: 'History', icon: '📜', color: 'neutral' }
];

/**
 * Format number with K/M suffix
 */
const formatCompact = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

/**
 * BarakaWallet Component
 */
const BarakaWallet = ({
  balance = 0,
  pendingBalance = 0,
  totalEarned = 0,
  totalSpent = 0,
  weeklyEarnings = 0,
  streak = 0,
  rank = null,
  onAction,
  onBalanceClick,
  showStats = true,
  showActions = true,
  variant = 'default', // default, compact, expanded
  className = '',
  ...props
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const handleAction = useCallback((actionId) => {
    if (onAction) {
      onAction(actionId);
    }
  }, [onAction]);
  
  const classNames = [
    'baraka-wallet',
    `baraka-wallet--${variant}`,
    className
  ].filter(Boolean).join(' ');
  
  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={classNames} {...props}>
        <BarakaBalance
          balance={balance}
          pendingBalance={pendingBalance}
          variant="compact"
          onClick={onBalanceClick}
        />
        {showActions && (
          <div className="baraka-wallet__quick-actions baraka-wallet__quick-actions--compact">
            <button
              type="button"
              className="baraka-wallet__quick-btn"
              onClick={() => handleAction('earn')}
              title="Earn Baraka"
            >
              💰
            </button>
            <button
              type="button"
              className="baraka-wallet__quick-btn"
              onClick={() => handleAction('spend')}
              title="Baraka Store"
            >
              🛒
            </button>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <header className="baraka-wallet__header">
        <div className="baraka-wallet__header-content">
          <h2 className="baraka-wallet__title">
            <span className="baraka-wallet__title-icon">🪙</span>
            Baraka Wallet
          </h2>
          <p className="baraka-wallet__subtitle">
            Your GPS Lab currency
          </p>
        </div>
        {streak > 0 && (
          <div className="baraka-wallet__streak">
            <span className="baraka-wallet__streak-icon">🔥</span>
            <span className="baraka-wallet__streak-value">{streak}</span>
            <span className="baraka-wallet__streak-label">day streak</span>
          </div>
        )}
      </header>
      
      {/* Balance */}
      <div className="baraka-wallet__balance-section">
        <BarakaBalance
          balance={balance}
          pendingBalance={pendingBalance}
          variant={variant === 'expanded' ? 'large' : 'card'}
          onClick={onBalanceClick}
          showPending={true}
        />
      </div>
      
      {/* Quick Actions */}
      {showActions && (
        <div className="baraka-wallet__actions">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              className={`baraka-wallet__action baraka-wallet__action--${action.color}`}
              onClick={() => handleAction(action.id)}
            >
              <span className="baraka-wallet__action-icon">{action.icon}</span>
              <span className="baraka-wallet__action-label">{action.label}</span>
            </button>
          ))}
        </div>
      )}
      
      {/* Stats */}
      {showStats && (
        <div className="baraka-wallet__stats">
          <div className="baraka-wallet__stat">
            <span className="baraka-wallet__stat-icon">📈</span>
            <div className="baraka-wallet__stat-content">
              <span className="baraka-wallet__stat-value">{formatCompact(totalEarned)}</span>
              <span className="baraka-wallet__stat-label">Total Earned</span>
            </div>
          </div>
          
          <div className="baraka-wallet__stat">
            <span className="baraka-wallet__stat-icon">💸</span>
            <div className="baraka-wallet__stat-content">
              <span className="baraka-wallet__stat-value">{formatCompact(totalSpent)}</span>
              <span className="baraka-wallet__stat-label">Total Spent</span>
            </div>
          </div>
          
          <div className="baraka-wallet__stat">
            <span className="baraka-wallet__stat-icon">📊</span>
            <div className="baraka-wallet__stat-content">
              <span className="baraka-wallet__stat-value">{formatCompact(weeklyEarnings)}</span>
              <span className="baraka-wallet__stat-label">This Week</span>
            </div>
          </div>
          
          {rank && (
            <div className="baraka-wallet__stat baraka-wallet__stat--highlight">
              <span className="baraka-wallet__stat-icon">🏆</span>
              <div className="baraka-wallet__stat-content">
                <span className="baraka-wallet__stat-value">#{rank}</span>
                <span className="baraka-wallet__stat-label">Rank</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Expanded View Tabs */}
      {variant === 'expanded' && (
        <div className="baraka-wallet__tabs">
          <button
            type="button"
            className={`baraka-wallet__tab ${activeTab === 'overview' ? 'baraka-wallet__tab--active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            type="button"
            className={`baraka-wallet__tab ${activeTab === 'earn' ? 'baraka-wallet__tab--active' : ''}`}
            onClick={() => setActiveTab('earn')}
          >
            Earn
          </button>
          <button
            type="button"
            className={`baraka-wallet__tab ${activeTab === 'spend' ? 'baraka-wallet__tab--active' : ''}`}
            onClick={() => setActiveTab('spend')}
          >
            Spend
          </button>
          <button
            type="button"
            className={`baraka-wallet__tab ${activeTab === 'history' ? 'baraka-wallet__tab--active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>
      )}
      
      {/* Glow Effect */}
      <div className="baraka-wallet__glow" />
    </div>
  );
};

export default BarakaWallet;