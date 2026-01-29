/**
 * GPS Lab Platform - PSBTransactionItem Component
 * 
 * Individual PSB transaction record showing type, amount,
 * price, and market context.
 * 
 * @module components/psb/PSBTransactions/PSBTransactionItem
 */

import React from 'react';
import './PSBTransactionItem.css';

/**
 * PSB Transaction type configurations
 */
const PSB_TRANSACTION_TYPES = {
  earn_stage: {
    icon: '⬆️',
    label: 'Stage Completion',
    color: 'success'
  },
  earn_project: {
    icon: '🎯',
    label: 'Project Milestone',
    color: 'success'
  },
  earn_leadership: {
    icon: '👑',
    label: 'Leadership Bonus',
    color: 'warning'
  },
  earn_achievement: {
    icon: '🏆',
    label: 'Achievement',
    color: 'warning'
  },
  buy: {
    icon: '📥',
    label: 'Purchase',
    color: 'primary'
  },
  sell: {
    icon: '📤',
    label: 'Sale',
    color: 'error'
  },
  stake: {
    icon: '🔒',
    label: 'Staked',
    color: 'purple'
  },
  unstake: {
    icon: '🔓',
    label: 'Unstaked',
    color: 'purple'
  },
  transfer_in: {
    icon: '⬅️',
    label: 'Received',
    color: 'success'
  },
  transfer_out: {
    icon: '➡️',
    label: 'Sent',
    color: 'error'
  },
  reward: {
    icon: '🎁',
    label: 'Reward',
    color: 'warning'
  },
  dividend: {
    icon: '💵',
    label: 'Dividend',
    color: 'success'
  }
};

/**
 * Format timestamp
 */
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format number with decimals
 */
const formatNumber = (num, decimals = 2) => {
  return Math.abs(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * PSBTransactionItem Component
 */
const PSBTransactionItem = ({
  transaction,
  onClick,
  showDetails = true,
  variant = 'default', // default, compact
  className = '',
  ...props
}) => {
  if (!transaction) return null;
  
  const {
    id,
    type = 'earn_stage',
    amount = 0,
    pricePerPSB,
    totalValue,
    timestamp,
    description,
    counterparty,
    txHash,
    status = 'completed' // completed, pending, failed
  } = transaction;
  
  const config = PSB_TRANSACTION_TYPES[type] || {
    icon: '💎',
    label: type,
    color: 'neutral'
  };
  
  const isPositive = amount >= 0;
  
  const classNames = [
    'psb-transaction-item',
    `psb-transaction-item--${variant}`,
    `psb-transaction-item--${config.color}`,
    `psb-transaction-item--${status}`,
    isPositive ? 'psb-transaction-item--positive' : 'psb-transaction-item--negative',
    onClick && 'psb-transaction-item--clickable',
    className
  ].filter(Boolean).join(' ');
  
  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={classNames} onClick={onClick} {...props}>
        <span className="psb-transaction-item__icon">{config.icon}</span>
        <span className="psb-transaction-item__label">{config.label}</span>
        <span className="psb-transaction-item__amount">
          {isPositive ? '+' : '-'}{formatNumber(amount)} 💎
        </span>
      </div>
    );
  }
  
  return (
    <article className={classNames} onClick={onClick} {...props}>
      {/* Icon */}
      <div className="psb-transaction-item__icon-wrapper">
        <span className="psb-transaction-item__icon">{config.icon}</span>
      </div>
      
      {/* Content */}
      <div className="psb-transaction-item__content">
        <div className="psb-transaction-item__header">
          <span className="psb-transaction-item__label">{config.label}</span>
          <span className="psb-transaction-item__time">{formatTime(timestamp)}</span>
        </div>
        
        {showDetails && description && (
          <p className="psb-transaction-item__description">{description}</p>
        )}
        
        {showDetails && counterparty && (
          <span className="psb-transaction-item__counterparty">
            {isPositive ? 'From: ' : 'To: '}{counterparty}
          </span>
        )}
        
        {showDetails && txHash && (
          <span className="psb-transaction-item__hash">
            TX: {txHash.slice(0, 8)}...{txHash.slice(-6)}
          </span>
        )}
      </div>
      
      {/* Amount & Value */}
      <div className="psb-transaction-item__amount-wrapper">
        <span className="psb-transaction-item__amount">
          {isPositive ? '+' : '-'}{formatNumber(amount)}
        </span>
        <span className="psb-transaction-item__currency">💎 PSB</span>
        {pricePerPSB !== undefined && (
          <span className="psb-transaction-item__price">
            @ ${pricePerPSB.toFixed(4)}
          </span>
        )}
        {totalValue !== undefined && (
          <span className="psb-transaction-item__value">
            ${formatNumber(totalValue)}
          </span>
        )}
      </div>
      
      {/* Status indicator */}
      {status !== 'completed' && (
        <span className={`psb-transaction-item__status psb-transaction-item__status--${status}`}>
          {status === 'pending' && '⏳'}
          {status === 'failed' && '❌'}
          {status}
        </span>
      )}
    </article>
  );
};

export { PSB_TRANSACTION_TYPES };
export default PSBTransactionItem;