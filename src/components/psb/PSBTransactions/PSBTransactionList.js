/**
 * GPS Lab Platform - PSBTransactionList Component
 * 
 * Scrollable list of PSB transactions with filtering
 * and market context information.
 * 
 * @module components/psb/PSBTransactions/PSBTransactionList
 */

import React, { useState, useCallback, useMemo } from 'react';
import PSBTransactionItem, { PSB_TRANSACTION_TYPES } from './PSBTransactionItem';
import './PSBTransactionList.css';

/**
 * Filter options for PSB transactions
 */
const PSB_FILTER_OPTIONS = [
  { id: 'all', label: 'All', icon: '📋' },
  { id: 'earned', label: 'Earned', icon: '🏆' },
  { id: 'trades', label: 'Trades', icon: '📊' },
  { id: 'staking', label: 'Staking', icon: '🔒' },
  { id: 'transfers', label: 'Transfers', icon: '↔️' }
];

/**
 * Group transactions by date
 */
const groupByDate = (transactions) => {
  const groups = {};
  
  transactions.forEach((transaction) => {
    const date = new Date(transaction.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let key;
    if (date.toDateString() === today.toDateString()) {
      key = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      key = 'Yesterday';
    } else {
      key = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    }
    
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(transaction);
  });
  
  return groups;
};

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
 * PSBTransactionList Component
 */
const PSBTransactionList = ({
  transactions = [],
  onTransactionClick,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  isLoadingMore = false,
  showFilters = true,
  showGrouping = true,
  showHeader = true,
  showSummary = true,
  emptyMessage = 'No PSB transactions yet',
  className = '',
  ...props
}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    
    // Apply type filter
    switch (activeFilter) {
      case 'earned':
        filtered = filtered.filter((t) => 
          t.type?.startsWith('earn_') || t.type === 'reward' || t.type === 'dividend'
        );
        break;
      case 'trades':
        filtered = filtered.filter((t) => 
          t.type === 'buy' || t.type === 'sell'
        );
        break;
      case 'staking':
        filtered = filtered.filter((t) => 
          t.type === 'stake' || t.type === 'unstake'
        );
        break;
      case 'transfers':
        filtered = filtered.filter((t) => 
          t.type === 'transfer_in' || t.type === 'transfer_out'
        );
        break;
      default:
        break;
    }
    
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((t) => {
        const config = PSB_TRANSACTION_TYPES[t.type] || {};
        return (
          config.label?.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.counterparty?.toLowerCase().includes(query) ||
          t.txHash?.toLowerCase().includes(query)
        );
      });
    }
    
    return filtered;
  }, [transactions, activeFilter, searchQuery]);
  
  // Group transactions
  const groupedTransactions = useMemo(() => {
    if (!showGrouping) return { 'All Transactions': filteredTransactions };
    return groupByDate(filteredTransactions);
  }, [filteredTransactions, showGrouping]);
  
  // Calculate summary
  const summary = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => {
        if (t.amount > 0) {
          acc.totalIn += t.amount;
          acc.valueIn += t.totalValue || 0;
        } else {
          acc.totalOut += Math.abs(t.amount);
          acc.valueOut += t.totalValue || 0;
        }
        return acc;
      },
      { totalIn: 0, totalOut: 0, valueIn: 0, valueOut: 0 }
    );
  }, [filteredTransactions]);
  
  const handleTransactionClick = useCallback((transaction) => {
    if (onTransactionClick) {
      onTransactionClick(transaction);
    }
  }, [onTransactionClick]);
  
  const classNames = [
    'psb-transaction-list',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      {showHeader && (
        <header className="psb-transaction-list__header">
          <div className="psb-transaction-list__header-content">
            <h3 className="psb-transaction-list__title">
              <span className="psb-transaction-list__title-icon">📜</span>
              PSB History
            </h3>
            {showSummary && (
              <div className="psb-transaction-list__summary">
                <span className="psb-transaction-list__summary-item psb-transaction-list__summary-item--in">
                  +{formatNumber(summary.totalIn)} 💎
                </span>
                <span className="psb-transaction-list__summary-item psb-transaction-list__summary-item--out">
                  -{formatNumber(summary.totalOut)} 💎
                </span>
              </div>
            )}
          </div>
          
          {/* Search */}
          <div className="psb-transaction-list__search">
            <span className="psb-transaction-list__search-icon">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              className="psb-transaction-list__search-input"
            />
          </div>
        </header>
      )}
      
      {/* Filters */}
      {showFilters && (
        <div className="psb-transaction-list__filters">
          {PSB_FILTER_OPTIONS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`psb-transaction-list__filter ${activeFilter === filter.id ? 'psb-transaction-list__filter--active' : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              <span className="psb-transaction-list__filter-icon">{filter.icon}</span>
              <span className="psb-transaction-list__filter-label">{filter.label}</span>
            </button>
          ))}
        </div>
      )}
      
      {/* Content */}
      <div className="psb-transaction-list__content">
        {/* Loading */}
        {isLoading && (
          <div className="psb-transaction-list__loading">
            <div className="psb-transaction-list__spinner" />
            <span>Loading transactions...</span>
          </div>
        )}
        
        {/* Empty */}
        {!isLoading && filteredTransactions.length === 0 && (
          <div className="psb-transaction-list__empty">
            <span className="psb-transaction-list__empty-icon">💎</span>
            <p className="psb-transaction-list__empty-text">{emptyMessage}</p>
          </div>
        )}
        
        {/* Grouped List */}
        {!isLoading && filteredTransactions.length > 0 && (
          <div className="psb-transaction-list__groups">
            {Object.entries(groupedTransactions).map(([dateKey, items]) => (
              <div key={dateKey} className="psb-transaction-list__group">
                {showGrouping && (
                  <div className="psb-transaction-list__group-header">
                    <span className="psb-transaction-list__group-date">{dateKey}</span>
                    <span className="psb-transaction-list__group-count">
                      {items.length} transaction{items.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                <div className="psb-transaction-list__items">
                  {items.map((transaction) => (
                    <PSBTransactionItem
                      key={transaction.id}
                      transaction={transaction}
                      onClick={() => handleTransactionClick(transaction)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Load More */}
        {hasMore && (
          <div className="psb-transaction-list__load-more">
            {isLoadingMore ? (
              <>
                <div className="psb-transaction-list__spinner psb-transaction-list__spinner--small" />
                <span>Loading more...</span>
              </>
            ) : (
              <button
                type="button"
                className="psb-transaction-list__load-more-btn"
                onClick={onLoadMore}
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PSBTransactionList;