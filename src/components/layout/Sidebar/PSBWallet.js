/**
 * GPS Lab Platform - PSBWallet Component (Problem Solving Bank)
 * @module components/layout/Sidebar/PSBWallet
 */

import React from 'react';
import './PSBWallet.css';

const formatCurrency = (num) => {
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
  return `$${num.toLocaleString()}`;
};

const PSBWallet = ({ balance = 0, invested = 0, returns = 0, className = '' }) => {
  const totalValue = balance + invested;
  const returnRate = invested > 0 ? ((returns / invested) * 100).toFixed(1) : 0;
  
  return (
    <div className={`psb-wallet ${className}`}>
      <div className="psb-wallet__header">
        <div className="psb-wallet__icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-9-1c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-6v11c0 1.1-.9 2-2 2H4v-2h17V7h2z"/>
          </svg>
        </div>
        <div className="psb-wallet__info">
          <span className="psb-wallet__label">PSB Account</span>
          <span className="psb-wallet__sublabel">Problem Solving Bank</span>
        </div>
      </div>
      
      <div className="psb-wallet__balance">
        <span className="psb-wallet__amount">{formatCurrency(totalValue)}</span>
        <span className="psb-wallet__total-label">Total Value</span>
      </div>
      
      <div className="psb-wallet__breakdown">
        <div className="psb-wallet__breakdown-item">
          <span className="psb-wallet__breakdown-label">Available</span>
          <span className="psb-wallet__breakdown-value">{formatCurrency(balance)}</span>
        </div>
        <div className="psb-wallet__breakdown-item">
          <span className="psb-wallet__breakdown-label">Invested</span>
          <span className="psb-wallet__breakdown-value">{formatCurrency(invested)}</span>
        </div>
        {returns !== 0 && (
          <div className="psb-wallet__breakdown-item">
            <span className="psb-wallet__breakdown-label">Returns</span>
            <span className={`psb-wallet__breakdown-value psb-wallet__breakdown-value--${returns >= 0 ? 'positive' : 'negative'}`}>
              {returns >= 0 ? '+' : ''}{formatCurrency(returns)} ({returnRate}%)
            </span>
          </div>
        )}
      </div>
      
      <div className="psb-wallet__actions">
        <a href="/wallet/psb" className="psb-wallet__action">View Details</a>
        <a href="/wallet/psb/invest" className="psb-wallet__action psb-wallet__action--primary">Invest</a>
      </div>
    </div>
  );
};

export default PSBWallet;