/**
 * GPS Lab Platform - PSBMarketplace Component
 * 
 * Main marketplace interface for trading PSB with
 * order book, price charts, and trading controls.
 * 
 * @module components/psb/PSBMarketplace/PSBMarketplace
 */

import React, { useState, useCallback, useMemo } from 'react';
import PSBListings from './PSBListings';
import './PSBMarketplace.css';

/**
 * Market stats mock data generator
 */
const generateMarketStats = (currentPrice) => ({
  high24h: currentPrice * 1.05,
  low24h: currentPrice * 0.95,
  change24h: ((currentPrice - currentPrice * 0.98) / (currentPrice * 0.98)) * 100,
  volume24h: 125000,
  trades24h: 342,
  marketCap: currentPrice * 10000000
});

/**
 * Format number with K/M suffix
 */
const formatCompact = (num) => {
  if (num >= 1000000) return '$' + (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return '$' + (num / 1000).toFixed(2) + 'K';
  return '$' + num.toFixed(2);
};

/**
 * Format percentage
 */
const formatPercent = (num) => {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};

/**
 * PSBMarketplace Component
 */
const PSBMarketplace = ({
  listings = [],
  recentTrades = [],
  currentPrice = 0.01,
  userBalance = 0,
  userPSBBalance = 0,
  currentUserId,
  onCreateListing,
  onAcceptListing,
  onCancelListing,
  isLoading = false,
  className = '',
  ...props
}) => {
  const [activeTab, setActiveTab] = useState('orderbook'); // orderbook, trades, myorders
  
  const marketStats = useMemo(() => generateMarketStats(currentPrice), [currentPrice]);
  
  // Filter user's listings
  const myListings = useMemo(() => 
    listings.filter((l) => l.sellerId === currentUserId),
    [listings, currentUserId]
  );
  
  const classNames = [
    'psb-marketplace',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <header className="psb-marketplace__header">
        <div className="psb-marketplace__header-content">
          <h2 className="psb-marketplace__title">
            <span className="psb-marketplace__title-icon">🏪</span>
            PSB Marketplace
          </h2>
          <p className="psb-marketplace__subtitle">
            Trade Problem-Solving Bonds
          </p>
        </div>
        
        {/* Price Display */}
        <div className="psb-marketplace__price-display">
          <div className="psb-marketplace__current-price">
            <span className="psb-marketplace__price-label">💎 PSB/USD</span>
            <span className="psb-marketplace__price-value">${currentPrice.toFixed(4)}</span>
            <span className={`psb-marketplace__price-change ${marketStats.change24h >= 0 ? 'psb-marketplace__price-change--positive' : 'psb-marketplace__price-change--negative'}`}>
              {formatPercent(marketStats.change24h)}
            </span>
          </div>
        </div>
      </header>
      
      {/* Market Stats */}
      <div className="psb-marketplace__stats">
        <div className="psb-marketplace__stat">
          <span className="psb-marketplace__stat-label">24h High</span>
          <span className="psb-marketplace__stat-value psb-marketplace__stat-value--high">
            ${marketStats.high24h.toFixed(4)}
          </span>
        </div>
        <div className="psb-marketplace__stat">
          <span className="psb-marketplace__stat-label">24h Low</span>
          <span className="psb-marketplace__stat-value psb-marketplace__stat-value--low">
            ${marketStats.low24h.toFixed(4)}
          </span>
        </div>
        <div className="psb-marketplace__stat">
          <span className="psb-marketplace__stat-label">24h Volume</span>
          <span className="psb-marketplace__stat-value">
            {formatCompact(marketStats.volume24h)}
          </span>
        </div>
        <div className="psb-marketplace__stat">
          <span className="psb-marketplace__stat-label">Trades</span>
          <span className="psb-marketplace__stat-value">
            {marketStats.trades24h}
          </span>
        </div>
        <div className="psb-marketplace__stat">
          <span className="psb-marketplace__stat-label">Market Cap</span>
          <span className="psb-marketplace__stat-value">
            {formatCompact(marketStats.marketCap)}
          </span>
        </div>
      </div>
      
      {/* Balances */}
      <div className="psb-marketplace__balances">
        <div className="psb-marketplace__balance">
          <span className="psb-marketplace__balance-icon">🪙</span>
          <div className="psb-marketplace__balance-content">
            <span className="psb-marketplace__balance-label">Baraka Balance</span>
            <span className="psb-marketplace__balance-value">{userBalance.toLocaleString()}</span>
          </div>
        </div>
        <div className="psb-marketplace__balance">
          <span className="psb-marketplace__balance-icon">💎</span>
          <div className="psb-marketplace__balance-content">
            <span className="psb-marketplace__balance-label">PSB Balance</span>
            <span className="psb-marketplace__balance-value">{userPSBBalance.toLocaleString()}</span>
          </div>
        </div>
        <button
          type="button"
          className="psb-marketplace__trade-btn"
          onClick={() => onCreateListing && onCreateListing()}
        >
          <span className="psb-marketplace__trade-btn-icon">📊</span>
          Create Order
        </button>
      </div>
      
      {/* Tabs */}
      <div className="psb-marketplace__tabs">
        <button
          type="button"
          className={`psb-marketplace__tab ${activeTab === 'orderbook' ? 'psb-marketplace__tab--active' : ''}`}
          onClick={() => setActiveTab('orderbook')}
        >
          Order Book
        </button>
        <button
          type="button"
          className={`psb-marketplace__tab ${activeTab === 'trades' ? 'psb-marketplace__tab--active' : ''}`}
          onClick={() => setActiveTab('trades')}
        >
          Recent Trades
        </button>
        <button
          type="button"
          className={`psb-marketplace__tab ${activeTab === 'myorders' ? 'psb-marketplace__tab--active' : ''}`}
          onClick={() => setActiveTab('myorders')}
        >
          My Orders ({myListings.length})
        </button>
      </div>
      
      {/* Content */}
      <div className="psb-marketplace__content">
        {activeTab === 'orderbook' && (
          <PSBListings
            listings={listings}
            currentPrice={currentPrice}
            userBalance={userBalance}
            userPSBBalance={userPSBBalance}
            currentUserId={currentUserId}
            onAcceptListing={onAcceptListing}
            onCancelListing={onCancelListing}
            isLoading={isLoading}
          />
        )}
        
        {activeTab === 'trades' && (
          <div className="psb-marketplace__trades">
            <div className="psb-marketplace__trades-header">
              <span>Price</span>
              <span>Amount</span>
              <span>Time</span>
            </div>
            <div className="psb-marketplace__trades-list">
              {recentTrades.length === 0 ? (
                <div className="psb-marketplace__empty">
                  No recent trades
                </div>
              ) : (
                recentTrades.map((trade) => (
                  <div 
                    key={trade.id} 
                    className={`psb-marketplace__trade psb-marketplace__trade--${trade.type}`}
                  >
                    <span className="psb-marketplace__trade-price">
                      ${trade.pricePerPSB.toFixed(4)}
                    </span>
                    <span className="psb-marketplace__trade-amount">
                      {trade.amount.toLocaleString()} 💎
                    </span>
                    <span className="psb-marketplace__trade-time">
                      {new Date(trade.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'myorders' && (
          <div className="psb-marketplace__my-orders">
            {myListings.length === 0 ? (
              <div className="psb-marketplace__empty">
                <span className="psb-marketplace__empty-icon">📋</span>
                <p>You have no active orders</p>
                <button
                  type="button"
                  className="psb-marketplace__empty-btn"
                  onClick={() => onCreateListing && onCreateListing()}
                >
                  Create Order
                </button>
              </div>
            ) : (
              <div className="psb-marketplace__orders-list">
                {myListings.map((listing) => (
                  <div 
                    key={listing.id} 
                    className={`psb-marketplace__order psb-marketplace__order--${listing.type}`}
                  >
                    <div className="psb-marketplace__order-type">
                      {listing.type === 'buy' ? '🟢 BUY' : '🔴 SELL'}
                    </div>
                    <div className="psb-marketplace__order-details">
                      <span className="psb-marketplace__order-amount">
                        {listing.amount.toLocaleString()} 💎
                      </span>
                      <span className="psb-marketplace__order-price">
                        @ ${listing.pricePerPSB.toFixed(4)}
                      </span>
                    </div>
                    <div className="psb-marketplace__order-total">
                      ${(listing.amount * listing.pricePerPSB).toLocaleString()}
                    </div>
                    <button
                      type="button"
                      className="psb-marketplace__order-cancel"
                      onClick={() => onCancelListing && onCancelListing(listing)}
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PSBMarketplace;