/**
 * GPS Lab Platform - BarakaTransactionList Component
 * 
 * Scrollable list of Baraka transactions with filtering
 * and grouping by date.
 * 
 * @module components/baraka/BarakaTransactions/BarakaTransactionList
 */

import React, { useState, useCallback, useMemo } from 'react';
import BarakaTransactionItem, { TRANSACTION_TYPES } from './BarakaTransactionItem';
import './BarakaTransactionList.css';

/**
 * Filter options
 */
const FILTER_OPTIONS = [
  { id: 'all', label: 'All', icon: '📋' },
  { id: 'earned', label: 'Earned', icon: '💰' },
  { id: 'spent', label: 'Spent', icon: '💸' },
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
 * BarakaTransactionList Component
 */
const BarakaTransactionList = ({
  transactions = [],
  onTransactionClick,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  isLoadingMore = false,
  showFilters = true,
  showGrouping = true,
  showHeader = true,
  emptyMessage = 'No transactions yet',
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
        filtered = filtered.filter((t) => t.amount > 0);
        break;
      case 'spent':
        filtered = filtered.filter((t) => t.amount < 0);
        break;
      case 'transfers':
        filtered = filtered.filter((t) => 
          t.type === 'transfer_sent' || t.type === 'transfer_received'
        );
        break;
      default:
        break;
    }
    
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((t) => {
        const config = TRANSACTION_TYPES[t.type] || {};
        return (
          config.label?.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.reference?.name?.toLowerCase().includes(query)
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
  
  // Calculate totals
  const totals = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => {
        if (t.amount > 0) {
          acc.earned += t.amount;
        } else {
          acc.spent += Math.abs(t.amount);
        }
        return acc;
      },
      { earned: 0, spent: 0 }
    );
  }, [filteredTransactions]);
  
  const handleTransactionClick = useCallback((transaction) => {
    if (onTransactionClick) {
      onTransactionClick(transaction);
    }
  }, [onTransactionClick]);
  
  const classNames = [
    'baraka-transaction-list',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      {showHeader && (
        <header className="baraka-transaction-list__header">
          <div className="baraka-transaction-list__header-content">
            <h3 className="baraka-transaction-list__title">
              <span className="baraka-transaction-list__title-icon">📜</span>
              Transaction History
            </h3>
            <div className="baraka-transaction-list__totals">
              <span className="baraka-transaction-list__total baraka-transaction-list__total--earned">
                +{totals.earned.toLocaleString()} 🪙
              </span>
              <span className="baraka-transaction-list__total baraka-transaction-list__total--spent">
                -{totals.spent.toLocaleString()} 🪙
              </span>
            </div>
          </div>
          
          {/* Search */}
          <div className="baraka-transaction-list__search">
            <span className="baraka-transaction-list__search-icon">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              className="baraka-transaction-list__search-input"
            />
          </div>
        </header>
      )}
      
      {/* Filters */}
      {showFilters && (
        <div className="baraka-transaction-list__filters">
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`baraka-transaction-list__filter ${activeFilter === filter.id ? 'baraka-transaction-list__filter--active' : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              <span className="baraka-transaction-list__filter-icon">{filter.icon}</span>
              <span className="baraka-transaction-list__filter-label">{filter.label}</span>
            </button>
          ))}
        </div>
      )}
      
      {/* Content */}
      <div className="baraka-transaction-list__content">
        {/* Loading */}
        {isLoading && (
          <div className="baraka-transaction-list__loading">
            <div className="baraka-transaction-list__spinner" />
            <span>Loading transactions...</span>
          </div>
        )}
        
        {/* Empty */}
        {!isLoading && filteredTransactions.length === 0 && (
          <div className="baraka-transaction-list__empty">
            <span className="baraka-transaction-list__empty-icon">📭</span>
            <p className="baraka-transaction-list__empty-text">{emptyMessage}</p>
          </div>
        )}
        
        {/* Grouped List */}
        {!isLoading && filteredTransactions.length > 0 && (
          <div className="baraka-transaction-list__groups">
            {Object.entries(groupedTransactions).map(([dateKey, items]) => (
              <div key={dateKey} className="baraka-transaction-list__group">
                {showGrouping && (
                  <div className="baraka-transaction-list__group-header">
                    <span className="baraka-transaction-list__group-date">{dateKey}</span>
                    <span className="baraka-transaction-list__group-count">
                      {items.length} transaction{items.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                <div className="baraka-transaction-list__items">
                  {items.map((transaction) => (
                    <BarakaTransactionItem
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
          <div className="baraka-transaction-list__load-more">
            {isLoadingMore ? (
              <>
                <div className="baraka-transaction-list__spinner baraka-transaction-list__spinner--small" />
                <span>Loading more...</span>
              </>
            ) : (
              <button
                type="button"
                className="baraka-transaction-list__load-more-btn"
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

export default BarakaTransactionList;