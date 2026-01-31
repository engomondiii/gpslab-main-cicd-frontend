/**
 * GPS Lab Platform - BarakaWallet Component
 * @module components/layout/Sidebar/BarakaWallet
 * @version 1.1.0
 * 
 * FIXED: Converted <a href> to React Router <Link>
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './BarakaWallet.css';

const BARAKA_TIERS = {
  YELLOW: { color: '#F1C40F', name: 'Yellow', min: 0 },
  GREEN: { color: '#2ECC71', name: 'Green', min: 1000 },
  BLUE: { color: '#3498DB', name: 'Blue', min: 5000 },
  INDIGO: { color: '#9B59B6', name: 'Indigo', min: 15000 },
  PURPLE: { color: '#8E44AD', name: 'Purple', min: 50000 },
  BLACK: { color: '#2C3E50', name: 'Black', min: 100000 }
};

const getTierFromBalance = (balance) => {
  if (balance >= 100000) return BARAKA_TIERS.BLACK;
  if (balance >= 50000) return BARAKA_TIERS.PURPLE;
  if (balance >= 15000) return BARAKA_TIERS.INDIGO;
  if (balance >= 5000) return BARAKA_TIERS.BLUE;
  if (balance >= 1000) return BARAKA_TIERS.GREEN;
  return BARAKA_TIERS.YELLOW;
};

const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
};

const BarakaWallet = ({ balance = 0, pending = 0, tier, className = '' }) => {
  const currentTier = tier || getTierFromBalance(balance);
  
  return (
    <div className={`baraka-wallet ${className}`} style={{ '--tier-color': currentTier.color }}>
      <div className="baraka-wallet__header">
        <div className="baraka-wallet__icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
          </svg>
        </div>
        <div className="baraka-wallet__info">
          <span className="baraka-wallet__label">Baraka Balance</span>
          <span className="baraka-wallet__tier">{currentTier.name} Tier</span>
        </div>
      </div>
      <div className="baraka-wallet__balance">
        <span className="baraka-wallet__amount">{formatNumber(balance)}</span>
        <span className="baraka-wallet__symbol">B</span>
      </div>
      {pending > 0 && (
        <div className="baraka-wallet__pending">
          <span>+{formatNumber(pending)} pending</span>
        </div>
      )}
      <div className="baraka-wallet__actions">
        {/* FIXED: Using Link instead of <a> */}
        <Link to="/wallet/baraka" className="baraka-wallet__action">
          View Details
        </Link>
      </div>
    </div>
  );
};

export { BARAKA_TIERS };
export default BarakaWallet;