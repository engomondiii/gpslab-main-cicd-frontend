/**
 * GPS Lab Platform - BarakaTransactionItem Component
 * 
 * Individual transaction record showing type, amount,
 * timestamp, and related context.
 * 
 * @module components/baraka/BarakaTransactions/BarakaTransactionItem
 */

import React from 'react';
import './BarakaTransactionItem.css';

/**
 * Transaction type configurations
 */
const TRANSACTION_TYPES = {
  bite_complete: {
    icon: '🍽️',
    label: 'Bite Completed',
    color: 'success'
  },
  checkpoint_complete: {
    icon: '🏁',
    label: 'Checkpoint Complete',
    color: 'success'
  },
  praise_sent: {
    icon: '🎉',
    label: 'Praise Sent',
    color: 'purple'
  },
  praise_received: {
    icon: '💜',
    label: 'Praise Received',
    color: 'purple'
  },
  daily_login: {
    icon: '📅',
    label: 'Daily Login',
    color: 'primary'
  },
  streak_bonus: {
    icon: '🔥',
    label: 'Streak Bonus',
    color: 'warning'
  },
  party_bonus: {
    icon: '👥',
    label: 'Party Bonus',
    color: 'primary'
  },
  store_purchase: {
    icon: '🛒',
    label: 'Store Purchase',
    color: 'error'
  },
  withdrawal: {
    icon: '📤',
    label: 'Withdrawal',
    color: 'error'
  },
  transfer_sent: {
    icon: '➡️',
    label: 'Transfer Sent',
    color: 'warning'
  },
  transfer_received: {
    icon: '⬅️',
    label: 'Transfer Received',
    color: 'success'
  },
  achievement: {
    icon: '🏆',
    label: 'Achievement',
    color: 'warning'
  },
  stage_advance: {
    icon: '⬆️',
    label: 'Stage Advance',
    color: 'success'
  },
  refund: {
    icon: '↩️',
    label: 'Refund',
    color: 'primary'
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
 * Format number with commas
 */
const formatNumber = (num) => {
  return Math.abs(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * BarakaTransactionItem Component
 */
const BarakaTransactionItem = ({
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
    type = 'bite_complete',
    amount = 0,
    timestamp,
    description,
    reference,
    status = 'completed', // completed, pending, failed
    balanceAfter
  } = transaction;
  
  const config = TRANSACTION_TYPES[type] || {
    icon: '💰',
    label: type,
    color: 'neutral'
  };
  
  const isPositive = amount >= 0;
  
  const classNames = [
    'baraka-transaction-item',
    `baraka-transaction-item--${variant}`,
    `baraka-transaction-item--${config.color}`,
    `baraka-transaction-item--${status}`,
    isPositive ? 'baraka-transaction-item--positive' : 'baraka-transaction-item--negative',
    onClick && 'baraka-transaction-item--clickable',
    className
  ].filter(Boolean).join(' ');
  
  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={classNames} onClick={onClick} {...props}>
        <span className="baraka-transaction-item__icon">{config.icon}</span>
        <span className="baraka-transaction-item__label">{config.label}</span>
        <span className="baraka-transaction-item__amount">
          {isPositive ? '+' : '-'}{formatNumber(amount)} 🪙
        </span>
      </div>
    );
  }
  
  return (
    <article className={classNames} onClick={onClick} {...props}>
      {/* Icon */}
      <div className="baraka-transaction-item__icon-wrapper">
        <span className="baraka-transaction-item__icon">{config.icon}</span>
      </div>
      
      {/* Content */}
      <div className="baraka-transaction-item__content">
        <div className="baraka-transaction-item__header">
          <span className="baraka-transaction-item__label">{config.label}</span>
          <span className="baraka-transaction-item__time">{formatTime(timestamp)}</span>
        </div>
        
        {showDetails && description && (
          <p className="baraka-transaction-item__description">{description}</p>
        )}
        
        {showDetails && reference && (
          <span className="baraka-transaction-item__reference">
            {reference.type}: {reference.name}
          </span>
        )}
      </div>
      
      {/* Amount */}
      <div className="baraka-transaction-item__amount-wrapper">
        <span className="baraka-transaction-item__amount">
          {isPositive ? '+' : '-'}{formatNumber(amount)}
        </span>
        <span className="baraka-transaction-item__currency">🪙</span>
        {balanceAfter !== undefined && (
          <span className="baraka-transaction-item__balance-after">
            Balance: {formatNumber(balanceAfter)}
          </span>
        )}
      </div>
      
      {/* Status indicator */}
      {status !== 'completed' && (
        <span className={`baraka-transaction-item__status baraka-transaction-item__status--${status}`}>
          {status === 'pending' && '⏳'}
          {status === 'failed' && '❌'}
          {status}
        </span>
      )}
    </article>
  );
};

export { TRANSACTION_TYPES };
export default BarakaTransactionItem;