/**
 * GPS Lab Platform - pR2RPanel Component
 * GPS 101 INTEGRATION: Track pR2R usage for GPS 101 checkpoints
 * 
 * Purchased Right to Retry (pR2R) management panel.
 * Allows purchasing retries with Baraka currency.
 * 
 * @module components/study/RetryRights/pR2RPanel
 */

import React, { useState } from 'react';
import RetryButton from './RetryButton';
import './pR2RPanel.css';

/**
 * pR2RPanel Component
 */
const pR2RPanel = ({
  available = 0,
  barakaBalance = 0,
  pricePerRetry = 100,
  maxPurchase = 3,
  purchaseHistory = [],
  // NEW: GPS 101 props
  gps101Available = 0,
  gps101PricePerRetry = 150, // GPS 101 retries cost more
  isGPS101Checkpoint = false,
  gps101StageNumber,
  onPurchase,
  onUseRetry,
  checkpointName,
  showPurchase = true,
  className = '',
  ...props
}) => {
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  // Determine pricing based on checkpoint type
  const activePrice = isGPS101Checkpoint ? gps101PricePerRetry : pricePerRetry;
  const displayAvailable = isGPS101Checkpoint ? gps101Available : available;
  
  const totalCost = purchaseQuantity * activePrice;
  const canAfford = barakaBalance >= totalCost;
  const canPurchase = purchaseQuantity <= maxPurchase && canAfford;
  
  const handlePurchase = async () => {
    if (!canPurchase || isPurchasing) return;
    
    setIsPurchasing(true);
    try {
      if (onPurchase) {
        await onPurchase(purchaseQuantity, isGPS101Checkpoint);
      }
    } finally {
      setIsPurchasing(false);
      setPurchaseQuantity(1);
    }
  };
  
  const classNames = [
    'pr2r-panel',
    isGPS101Checkpoint && 'pr2r-panel--gps101',
    className
  ].filter(Boolean).join(' ');
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="pr2r-panel__header">
        <div className="pr2r-panel__icon">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4z"/>
            <path fillRule="evenodd" d="M8 10a2 2 0 012-2h6a2 2 0 012 2v4a2 2 0 01-2 2h-6a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
          </svg>
        </div>
        <div className="pr2r-panel__title-section">
          <h3 className="pr2r-panel__title">
            {isGPS101Checkpoint ? 'GPS 101 Purchased Retry (pR2R)' : 'Purchased Retry (pR2R)'}
          </h3>
          <p className="pr2r-panel__subtitle">
            Buy retries with Baraka currency
          </p>
        </div>
      </div>
      
      {/* NEW: GPS 101 Context Banner */}
      {isGPS101Checkpoint && (
        <div className="pr2r-panel__gps101-banner">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
          </svg>
          <div>
            <strong>GPS 101 Stage {gps101StageNumber} Checkpoint</strong>
            <p>GPS 101 pR2R cost {gps101PricePerRetry} Baraka each (premium pricing for purpose-discovery journey)</p>
          </div>
        </div>
      )}
      
      {/* Stats */}
      <div className="pr2r-panel__stats">
        <div className="pr2r-panel__stat pr2r-panel__stat--available">
          <span className="pr2r-panel__stat-value">{displayAvailable}</span>
          <span className="pr2r-panel__stat-label">
            {isGPS101Checkpoint ? 'GPS 101 pR2R' : 'Available pR2R'}
          </span>
        </div>
        <div className="pr2r-panel__stat pr2r-panel__stat--balance">
          <span className="pr2r-panel__stat-value">
            <span className="pr2r-panel__baraka-icon">💰</span>
            {barakaBalance.toLocaleString()}
          </span>
          <span className="pr2r-panel__stat-label">Baraka Balance</span>
        </div>
      </div>
      
      {/* NEW: Regular pR2R Info (if GPS 101 checkpoint but has regular pR2R) */}
      {isGPS101Checkpoint && available > 0 && (
        <div className="pr2r-panel__regular-info">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          <p>You have {available} regular pR2R available, but they can't be used for GPS 101 checkpoints</p>
        </div>
      )}
      
      {/* Use pR2R */}
      {checkpointName && displayAvailable > 0 && (
        <div className="pr2r-panel__use-section">
          <p className="pr2r-panel__use-context">
            Retry <strong>{checkpointName}</strong>
          </p>
          <RetryButton
            type="pr2r"
            available={displayAvailable}
            onUseRetry={onUseRetry}
            size="large"
            isGPS101={isGPS101Checkpoint}
          />
        </div>
      )}
      
      {/* Purchase Section */}
      {showPurchase && (
        <div className="pr2r-panel__purchase">
          <h4 className="pr2r-panel__section-title">
            {isGPS101Checkpoint ? 'Purchase GPS 101 pR2R' : 'Purchase pR2R'}
          </h4>
          
          <div className="pr2r-panel__purchase-info">
            <div className="pr2r-panel__price">
              <span className="pr2r-panel__price-amount">{activePrice}</span>
              <span className="pr2r-panel__price-unit">Baraka per retry</span>
            </div>
            <span className="pr2r-panel__max-info">Max {maxPurchase} at once</span>
          </div>
          
          {isGPS101Checkpoint && (
            <div className="pr2r-panel__gps101-price-note">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              <p>GPS 101 retries are premium priced to encourage thorough preparation</p>
            </div>
          )}
          
          <div className="pr2r-panel__purchase-controls">
            <div className="pr2r-panel__quantity">
              <button
                type="button"
                className="pr2r-panel__qty-btn"
                onClick={() => setPurchaseQuantity(Math.max(1, purchaseQuantity - 1))}
                disabled={purchaseQuantity <= 1}
              >
                −
              </button>
              <span className="pr2r-panel__qty-value">{purchaseQuantity}</span>
              <button
                type="button"
                className="pr2r-panel__qty-btn"
                onClick={() => setPurchaseQuantity(Math.min(maxPurchase, purchaseQuantity + 1))}
                disabled={purchaseQuantity >= maxPurchase}
              >
                +
              </button>
            </div>
            
            <div className="pr2r-panel__total">
              <span className="pr2r-panel__total-label">Total:</span>
              <span className={`pr2r-panel__total-value ${!canAfford ? 'pr2r-panel__total-value--insufficient' : ''}`}>
                💰 {totalCost.toLocaleString()}
              </span>
            </div>
          </div>
          
          <button
            type="button"
            className="pr2r-panel__purchase-btn"
            onClick={handlePurchase}
            disabled={!canPurchase || isPurchasing}
          >
            {isPurchasing ? (
              <>
                <span className="pr2r-panel__spinner" />
                Processing...
              </>
            ) : !canAfford ? (
              'Insufficient Baraka'
            ) : (
              `Purchase ${purchaseQuantity} ${isGPS101Checkpoint ? 'GPS 101 ' : ''}pR2R`
            )}
          </button>
          
          {!canAfford && (
            <p className="pr2r-panel__insufficient">
              You need {(totalCost - barakaBalance).toLocaleString()} more Baraka
            </p>
          )}
        </div>
      )}
      
      {/* Purchase History */}
      {purchaseHistory.length > 0 && (
        <div className="pr2r-panel__history">
          <h4 className="pr2r-panel__section-title">Purchase History</h4>
          <ul className="pr2r-panel__history-list">
            {purchaseHistory.slice(0, 5).map((item, index) => (
              <li key={index} className={`pr2r-panel__history-item ${item.isGPS101 ? 'pr2r-panel__history-item--gps101' : ''}`}>
                <span className="pr2r-panel__history-qty">
                  +{item.quantity} {item.isGPS101 && '🎓'} pR2R
                </span>
                <span className="pr2r-panel__history-cost">💰 {item.cost}</span>
                <span className="pr2r-panel__history-date">{formatDate(item.date)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Info Note */}
      <div className="pr2r-panel__note">
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
        </svg>
        <p>
          {isGPS101Checkpoint 
            ? 'Tip: Earn free GPS 101 R2R by completing GPS 101 study missions before purchasing pR2R.'
            : 'Tip: Earn free R2R by completing study missions before purchasing pR2R.'}
        </p>
      </div>
    </div>
  );
};

export default pR2RPanel;