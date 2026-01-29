/**
 * GPS Lab Platform - BarakaStoreItem Component
 * 
 * Individual store item card with purchase functionality,
 * inventory tracking, and visual feedback.
 * 
 * @module components/baraka/BarakaSpend/BarakaStoreItem
 */

import React, { useState, useCallback } from 'react';
import './BarakaStoreItem.css';

/**
 * Item rarity configurations
 */
const RARITY_CONFIG = {
  common: {
    label: 'Common',
    color: 'var(--neutral-400)',
    gradient: 'linear-gradient(135deg, rgba(139, 148, 158, 0.1) 0%, rgba(139, 148, 158, 0.2) 100%)'
  },
  uncommon: {
    label: 'Uncommon',
    color: 'var(--success)',
    gradient: 'linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(46, 204, 113, 0.2) 100%)'
  },
  rare: {
    label: 'Rare',
    color: 'var(--gps-primary)',
    gradient: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 212, 255, 0.2) 100%)'
  },
  epic: {
    label: 'Epic',
    color: 'var(--beacon-purple)',
    gradient: 'linear-gradient(135deg, rgba(142, 68, 173, 0.1) 0%, rgba(142, 68, 173, 0.2) 100%)'
  },
  legendary: {
    label: 'Legendary',
    color: 'var(--warning)',
    gradient: 'linear-gradient(135deg, rgba(241, 196, 15, 0.1) 0%, rgba(241, 196, 15, 0.2) 100%)'
  }
};

/**
 * Item category icons
 */
const CATEGORY_ICONS = {
  avatar: '👤',
  badge: '🏆',
  theme: '🎨',
  boost: '⚡',
  powerup: '🚀',
  title: '📛',
  emote: '😄',
  gift: '🎁'
};

/**
 * BarakaStoreItem Component
 */
const BarakaStoreItem = ({
  item,
  userBalance = 0,
  onPurchase,
  onPreview,
  variant = 'default', // default, compact, featured
  className = '',
  ...props
}) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  if (!item) return null;
  
  const {
    id,
    name,
    description,
    price = 0,
    originalPrice,
    category = 'badge',
    rarity = 'common',
    image,
    icon,
    stock,
    owned = false,
    isNew = false,
    isLimited = false,
    discount = 0
  } = item;
  
  const rarityConfig = RARITY_CONFIG[rarity] || RARITY_CONFIG.common;
  const categoryIcon = CATEGORY_ICONS[category] || '📦';
  const canAfford = userBalance >= price;
  const isAvailable = stock === undefined || stock > 0;
  
  const handlePurchaseClick = useCallback(() => {
    if (owned || !canAfford || !isAvailable) return;
    setShowConfirm(true);
  }, [owned, canAfford, isAvailable]);
  
  const handleConfirm = useCallback(async () => {
    setShowConfirm(false);
    setIsPurchasing(true);
    
    try {
      if (onPurchase) {
        await onPurchase(item);
      }
    } finally {
      setIsPurchasing(false);
    }
  }, [item, onPurchase]);
  
  const handleCancel = useCallback(() => {
    setShowConfirm(false);
  }, []);
  
  const handlePreview = useCallback(() => {
    if (onPreview) {
      onPreview(item);
    }
  }, [item, onPreview]);
  
  const classNames = [
    'baraka-store-item',
    `baraka-store-item--${variant}`,
    `baraka-store-item--${rarity}`,
    owned && 'baraka-store-item--owned',
    !canAfford && !owned && 'baraka-store-item--unaffordable',
    !isAvailable && 'baraka-store-item--unavailable',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <article 
      className={classNames} 
      style={{ '--rarity-color': rarityConfig.color }}
      {...props}
    >
      {/* Badges */}
      <div className="baraka-store-item__badges">
        {isNew && (
          <span className="baraka-store-item__badge baraka-store-item__badge--new">
            NEW
          </span>
        )}
        {isLimited && (
          <span className="baraka-store-item__badge baraka-store-item__badge--limited">
            LIMITED
          </span>
        )}
        {discount > 0 && (
          <span className="baraka-store-item__badge baraka-store-item__badge--discount">
            -{discount}%
          </span>
        )}
        {owned && (
          <span className="baraka-store-item__badge baraka-store-item__badge--owned">
            OWNED
          </span>
        )}
      </div>
      
      {/* Image/Icon */}
      <div className="baraka-store-item__visual" onClick={handlePreview}>
        {image ? (
          <img 
            src={image} 
            alt={name} 
            className="baraka-store-item__image"
          />
        ) : (
          <span className="baraka-store-item__icon">
            {icon || categoryIcon}
          </span>
        )}
        <div className="baraka-store-item__visual-overlay">
          <span className="baraka-store-item__preview-text">Preview</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="baraka-store-item__content">
        <div className="baraka-store-item__header">
          <span 
            className="baraka-store-item__rarity"
            style={{ color: rarityConfig.color }}
          >
            {rarityConfig.label}
          </span>
          <span className="baraka-store-item__category">
            {categoryIcon} {category}
          </span>
        </div>
        
        <h4 className="baraka-store-item__name">{name}</h4>
        
        {variant !== 'compact' && (
          <p className="baraka-store-item__description">{description}</p>
        )}
        
        {/* Stock */}
        {stock !== undefined && (
          <div className="baraka-store-item__stock">
            {stock > 0 ? (
              <span className="baraka-store-item__stock-text">
                {stock} left
              </span>
            ) : (
              <span className="baraka-store-item__stock-text baraka-store-item__stock-text--empty">
                Sold Out
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="baraka-store-item__footer">
        <div className="baraka-store-item__price">
          <span className="baraka-store-item__price-current">
            {price.toLocaleString()} 🪙
          </span>
          {originalPrice && originalPrice > price && (
            <span className="baraka-store-item__price-original">
              {originalPrice.toLocaleString()} 🪙
            </span>
          )}
        </div>
        
        <button
          type="button"
          className="baraka-store-item__buy-btn"
          onClick={handlePurchaseClick}
          disabled={owned || !canAfford || !isAvailable || isPurchasing}
        >
          {isPurchasing ? (
            <>
              <span className="baraka-store-item__spinner" />
              Purchasing...
            </>
          ) : owned ? (
            'Owned'
          ) : !isAvailable ? (
            'Sold Out'
          ) : !canAfford ? (
            'Not Enough'
          ) : (
            'Buy Now'
          )}
        </button>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="baraka-store-item__confirm-overlay">
          <div className="baraka-store-item__confirm">
            <h5 className="baraka-store-item__confirm-title">Confirm Purchase</h5>
            <p className="baraka-store-item__confirm-text">
              Buy <strong>{name}</strong> for <strong>{price.toLocaleString()} 🪙</strong>?
            </p>
            <div className="baraka-store-item__confirm-balance">
              Balance after: {(userBalance - price).toLocaleString()} 🪙
            </div>
            <div className="baraka-store-item__confirm-actions">
              <button
                type="button"
                className="baraka-store-item__confirm-cancel"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="baraka-store-item__confirm-buy"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Rarity Glow */}
      <div className="baraka-store-item__glow" />
    </article>
  );
};

export { RARITY_CONFIG, CATEGORY_ICONS };
export default BarakaStoreItem;