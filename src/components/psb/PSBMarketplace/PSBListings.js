/**
 * GPS Lab Platform - PSBListings Component
 * 
 * Displays active PSB buy/sell listings on the marketplace
 * with price, quantity, and seller information.
 * 
 * @module components/psb/PSBMarketplace/PSBListings
 */

import React, { useState, useCallback, useMemo } from 'react';
import './PSBListings.css';

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
 * Format relative time
 */
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * PSBListings Component
 */
const PSBListings = ({
  listings = [],
  type = 'all', // all, buy, sell
  currentPrice = 0.01,
  userBalance = 0,
  userPSBBalance = 0,
  onAcceptListing,
  onCancelListing,
  currentUserId,
  isLoading = false,
  showFilters = true,
  className = '',
  ...props
}) => {
  const [activeType, setActiveType] = useState(type);
  const [sortBy, setSortBy] = useState('price'); // price, amount, time
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  
  // Filter and sort listings
  const processedListings = useMemo(() => {
    let filtered = listings;
    
    // Filter by type
    if (activeType !== 'all') {
      filtered = filtered.filter((l) => l.type === activeType);
    }
    
    // Sort
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'price':
          comparison = a.pricePerPSB - b.pricePerPSB;
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'time':
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [listings, activeType, sortBy, sortOrder]);
  
  // Separate buy and sell listings for order book view
  const orderBook = useMemo(() => {
    const buyOrders = listings
      .filter((l) => l.type === 'buy')
      .sort((a, b) => b.pricePerPSB - a.pricePerPSB)
      .slice(0, 10);
    
    const sellOrders = listings
      .filter((l) => l.type === 'sell')
      .sort((a, b) => a.pricePerPSB - b.pricePerPSB)
      .slice(0, 10);
    
    return { buyOrders, sellOrders };
  }, [listings]);
  
  const handleAccept = useCallback((listing) => {
    if (onAcceptListing) {
      onAcceptListing(listing);
    }
  }, [onAcceptListing]);
  
  const handleCancel = useCallback((listing) => {
    if (onCancelListing) {
      onCancelListing(listing);
    }
  }, [onCancelListing]);
  
  const toggleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }, [sortBy, sortOrder]);
  
  const classNames = [
    'psb-listings',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <header className="psb-listings__header">
        <h3 className="psb-listings__title">
          <span className="psb-listings__title-icon">📊</span>
          Order Book
        </h3>
        <div className="psb-listings__current-price">
          <span className="psb-listings__price-label">Current Price</span>
          <span className="psb-listings__price-value">${formatNumber(currentPrice, 4)}</span>
        </div>
      </header>
      
      {/* Filters */}
      {showFilters && (
        <div className="psb-listings__filters">
          <div className="psb-listings__type-filter">
            <button
              type="button"
              className={`psb-listings__type-btn ${activeType === 'all' ? 'psb-listings__type-btn--active' : ''}`}
              onClick={() => setActiveType('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`psb-listings__type-btn psb-listings__type-btn--buy ${activeType === 'buy' ? 'psb-listings__type-btn--active' : ''}`}
              onClick={() => setActiveType('buy')}
            >
              Buy Orders
            </button>
            <button
              type="button"
              className={`psb-listings__type-btn psb-listings__type-btn--sell ${activeType === 'sell' ? 'psb-listings__type-btn--active' : ''}`}
              onClick={() => setActiveType('sell')}
            >
              Sell Orders
            </button>
          </div>
        </div>
      )}
      
      {/* Order Book View */}
      {activeType === 'all' && (
        <div className="psb-listings__order-book">
          {/* Sell Orders (asks) */}
          <div className="psb-listings__book-section psb-listings__book-section--sell">
            <div className="psb-listings__book-header">
              <span>Price</span>
              <span>Amount</span>
              <span>Total</span>
            </div>
            <div className="psb-listings__book-rows">
              {orderBook.sellOrders.map((order) => (
                <div key={order.id} className="psb-listings__book-row psb-listings__book-row--sell">
                  <span className="psb-listings__book-price">${formatNumber(order.pricePerPSB, 4)}</span>
                  <span className="psb-listings__book-amount">{formatNumber(order.amount)}</span>
                  <span className="psb-listings__book-total">${formatNumber(order.amount * order.pricePerPSB)}</span>
                  <div 
                    className="psb-listings__book-bar"
                    style={{ width: `${Math.min(100, (order.amount / 1000) * 100)}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Spread */}
          <div className="psb-listings__spread">
            <span className="psb-listings__spread-label">Spread</span>
            <span className="psb-listings__spread-value">
              {orderBook.sellOrders[0] && orderBook.buyOrders[0] 
                ? `$${formatNumber(orderBook.sellOrders[0].pricePerPSB - orderBook.buyOrders[0].pricePerPSB, 4)}`
                : '-'}
            </span>
          </div>
          
          {/* Buy Orders (bids) */}
          <div className="psb-listings__book-section psb-listings__book-section--buy">
            <div className="psb-listings__book-rows">
              {orderBook.buyOrders.map((order) => (
                <div key={order.id} className="psb-listings__book-row psb-listings__book-row--buy">
                  <span className="psb-listings__book-price">${formatNumber(order.pricePerPSB, 4)}</span>
                  <span className="psb-listings__book-amount">{formatNumber(order.amount)}</span>
                  <span className="psb-listings__book-total">${formatNumber(order.amount * order.pricePerPSB)}</span>
                  <div 
                    className="psb-listings__book-bar"
                    style={{ width: `${Math.min(100, (order.amount / 1000) * 100)}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* List View */}
      {activeType !== 'all' && (
        <div className="psb-listings__list">
          {/* Table Header */}
          <div className="psb-listings__table-header">
            <button
              type="button"
              className={`psb-listings__sort-btn ${sortBy === 'price' ? 'psb-listings__sort-btn--active' : ''}`}
              onClick={() => toggleSort('price')}
            >
              Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              type="button"
              className={`psb-listings__sort-btn ${sortBy === 'amount' ? 'psb-listings__sort-btn--active' : ''}`}
              onClick={() => toggleSort('amount')}
            >
              Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <span>Total</span>
            <span>Seller</span>
            <span>Action</span>
          </div>
          
          {/* Listings */}
          {isLoading ? (
            <div className="psb-listings__loading">
              <div className="psb-listings__spinner" />
            </div>
          ) : processedListings.length === 0 ? (
            <div className="psb-listings__empty">
              No {activeType} orders available
            </div>
          ) : (
            processedListings.map((listing) => (
              <div 
                key={listing.id} 
                className={`psb-listings__row psb-listings__row--${listing.type}`}
              >
                <span className="psb-listings__cell psb-listings__cell--price">
                  ${formatNumber(listing.pricePerPSB, 4)}
                </span>
                <span className="psb-listings__cell psb-listings__cell--amount">
                  {formatNumber(listing.amount)} 💎
                </span>
                <span className="psb-listings__cell psb-listings__cell--total">
                  ${formatNumber(listing.amount * listing.pricePerPSB)}
                </span>
                <span className="psb-listings__cell psb-listings__cell--seller">
                  {listing.sellerId === currentUserId ? 'You' : listing.sellerName || 'Anonymous'}
                </span>
                <div className="psb-listings__cell psb-listings__cell--action">
                  {listing.sellerId === currentUserId ? (
                    <button
                      type="button"
                      className="psb-listings__cancel-btn"
                      onClick={() => handleCancel(listing)}
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`psb-listings__accept-btn psb-listings__accept-btn--${listing.type}`}
                      onClick={() => handleAccept(listing)}
                    >
                      {listing.type === 'sell' ? 'Buy' : 'Sell'}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PSBListings;