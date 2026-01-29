/**
 * GPS Lab Platform - BadgeShowcase Component
 * 
 * Displays featured badges in an interactive showcase
 * with animations and details on hover.
 * 
 * @module components/profile/ProfileBadges/BadgeShowcase
 */

import React, { useState, useCallback } from 'react';
import './BadgeShowcase.css';

/**
 * Badge rarity colors and effects
 */
const RARITY_CONFIG = {
  common: {
    color: '#a8dadc',
    glow: 'rgba(168, 218, 220, 0.3)'
  },
  uncommon: {
    color: '#2ecc71',
    glow: 'rgba(46, 204, 113, 0.3)'
  },
  rare: {
    color: '#00d4ff',
    glow: 'rgba(0, 212, 255, 0.3)'
  },
  epic: {
    color: '#8e44ad',
    glow: 'rgba(142, 68, 173, 0.3)'
  },
  legendary: {
    color: '#f1c40f',
    glow: 'rgba(241, 196, 15, 0.3)'
  }
};

/**
 * BadgeShowcase Component
 */
const BadgeShowcase = ({
  badges = [],
  title = 'Featured Badges',
  maxDisplay = 6,
  onBadgeClick,
  onViewAll,
  showEmpty = true,
  variant = 'default', // default, compact, grid
  className = '',
  ...props
}) => {
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [hoveredBadge, setHoveredBadge] = useState(null);
  
  const displayBadges = badges.slice(0, maxDisplay);
  const hasMore = badges.length > maxDisplay;
  
  const handleBadgeClick = useCallback((badge) => {
    setSelectedBadge(badge);
    if (onBadgeClick) {
      onBadgeClick(badge);
    }
  }, [onBadgeClick]);
  
  const handleBadgeHover = useCallback((badge) => {
    setHoveredBadge(badge);
  }, []);
  
  const classNames = [
    'badge-showcase',
    `badge-showcase--${variant}`,
    className
  ].filter(Boolean).join(' ');
  
  // Empty state
  if (badges.length === 0 && !showEmpty) {
    return null;
  }
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      {title && (
        <header className="badge-showcase__header">
          <h3 className="badge-showcase__title">
            <span className="badge-showcase__title-icon">🎖️</span>
            {title}
          </h3>
          {onViewAll && badges.length > 0 && (
            <button
              type="button"
              className="badge-showcase__view-all"
              onClick={onViewAll}
            >
              View All ({badges.length})
            </button>
          )}
        </header>
      )}
      
      {/* Badges Grid */}
      <div className="badge-showcase__grid">
        {displayBadges.map((badge) => {
          const rarityConfig = RARITY_CONFIG[badge.rarity] || RARITY_CONFIG.common;
          const isHovered = hoveredBadge?.id === badge.id;
          
          return (
            <div
              key={badge.id}
              className={`badge-showcase__badge badge-showcase__badge--${badge.rarity || 'common'}`}
              style={{
                '--badge-color': rarityConfig.color,
                '--badge-glow': rarityConfig.glow
              }}
              onClick={() => handleBadgeClick(badge)}
              onMouseEnter={() => handleBadgeHover(badge)}
              onMouseLeave={() => handleBadgeHover(null)}
            >
              <div className="badge-showcase__badge-inner">
                <span className="badge-showcase__badge-icon">
                  {badge.icon || '🏅'}
                </span>
                <div className="badge-showcase__badge-glow" />
              </div>
              
              {/* Tooltip */}
              {isHovered && (
                <div className="badge-showcase__tooltip">
                  <span className="badge-showcase__tooltip-name">
                    {badge.name}
                  </span>
                  {badge.description && (
                    <span className="badge-showcase__tooltip-desc">
                      {badge.description}
                    </span>
                  )}
                  <span className="badge-showcase__tooltip-rarity">
                    {badge.rarity?.charAt(0).toUpperCase() + badge.rarity?.slice(1) || 'Common'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
        
        {/* More indicator */}
        {hasMore && (
          <button
            type="button"
            className="badge-showcase__more"
            onClick={onViewAll}
          >
            <span className="badge-showcase__more-count">
              +{badges.length - maxDisplay}
            </span>
            <span className="badge-showcase__more-text">more</span>
          </button>
        )}
        
        {/* Empty slots */}
        {displayBadges.length < maxDisplay && showEmpty && (
          Array.from({ length: maxDisplay - displayBadges.length }).map((_, i) => (
            <div key={`empty-${i}`} className="badge-showcase__badge badge-showcase__badge--empty">
              <div className="badge-showcase__badge-inner">
                <span className="badge-showcase__badge-icon">?</span>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Empty State */}
      {badges.length === 0 && showEmpty && (
        <div className="badge-showcase__empty">
          <span className="badge-showcase__empty-icon">🎖️</span>
          <p className="badge-showcase__empty-text">No badges yet</p>
          <span className="badge-showcase__empty-hint">
            Complete stages and achievements to earn badges!
          </span>
        </div>
      )}
      
      {/* Selected Badge Modal */}
      {selectedBadge && (
        <div 
          className="badge-showcase__modal-overlay"
          onClick={() => setSelectedBadge(null)}
        >
          <div 
            className={`badge-showcase__modal badge-showcase__modal--${selectedBadge.rarity || 'common'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="badge-showcase__modal-close"
              onClick={() => setSelectedBadge(null)}
            >
              ✕
            </button>
            <div className="badge-showcase__modal-badge">
              <span className="badge-showcase__modal-icon">
                {selectedBadge.icon || '🏅'}
              </span>
            </div>
            <h4 className="badge-showcase__modal-name">
              {selectedBadge.name}
            </h4>
            <span className="badge-showcase__modal-rarity">
              {selectedBadge.rarity?.charAt(0).toUpperCase() + selectedBadge.rarity?.slice(1) || 'Common'}
            </span>
            {selectedBadge.description && (
              <p className="badge-showcase__modal-desc">
                {selectedBadge.description}
              </p>
            )}
            {selectedBadge.earnedDate && (
              <span className="badge-showcase__modal-date">
                Earned: {selectedBadge.earnedDate}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { RARITY_CONFIG };
export default BadgeShowcase;