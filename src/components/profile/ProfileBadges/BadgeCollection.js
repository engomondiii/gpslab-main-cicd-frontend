/**
 * GPS Lab Platform - BadgeCollection Component
 * 
 * Complete badge collection view with filtering,
 * categories, and progress tracking.
 * 
 * @module components/profile/ProfileBadges/BadgeCollection
 */

import React, { useState, useMemo, useCallback } from 'react';
import BadgeShowcase, { RARITY_CONFIG } from './BadgeShowcase';
import './BadgeCollection.css';

/**
 * Badge categories
 */
const BADGE_CATEGORIES = [
  { id: 'all', label: 'All Badges', icon: '🏆' },
  { id: 'progress', label: 'Progress', icon: '📈' },
  { id: 'social', label: 'Social', icon: '👥' },
  { id: 'achievement', label: 'Achievements', icon: '⭐' },
  { id: 'special', label: 'Special', icon: '✨' },
  { id: 'seasonal', label: 'Seasonal', icon: '🎄' }
];

/**
 * Rarity filter options
 */
const RARITY_OPTIONS = [
  { id: 'all', label: 'All Rarities' },
  { id: 'common', label: 'Common' },
  { id: 'uncommon', label: 'Uncommon' },
  { id: 'rare', label: 'Rare' },
  { id: 'epic', label: 'Epic' },
  { id: 'legendary', label: 'Legendary' }
];

/**
 * BadgeCollection Component
 */
const BadgeCollection = ({
  earnedBadges = [],
  allBadges = [],
  onBadgeClick,
  showLocked = true,
  showProgress = true,
  className = '',
  ...props
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [showEarnedOnly, setShowEarnedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create a set of earned badge IDs for quick lookup
  const earnedBadgeIds = useMemo(() => 
    new Set(earnedBadges.map((b) => b.id)),
    [earnedBadges]
  );
  
  // Filter and sort badges
  const filteredBadges = useMemo(() => {
    let badges = showLocked ? allBadges : earnedBadges;
    
    // Apply category filter
    if (activeCategory !== 'all') {
      badges = badges.filter((b) => b.category === activeCategory);
    }
    
    // Apply rarity filter
    if (rarityFilter !== 'all') {
      badges = badges.filter((b) => b.rarity === rarityFilter);
    }
    
    // Apply earned filter
    if (showEarnedOnly) {
      badges = badges.filter((b) => earnedBadgeIds.has(b.id));
    }
    
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      badges = badges.filter((b) => 
        b.name?.toLowerCase().includes(query) ||
        b.description?.toLowerCase().includes(query)
      );
    }
    
    // Mark earned status
    return badges.map((b) => ({
      ...b,
      isEarned: earnedBadgeIds.has(b.id)
    }));
  }, [allBadges, earnedBadges, activeCategory, rarityFilter, showEarnedOnly, searchQuery, earnedBadgeIds, showLocked]);
  
  // Calculate stats
  const stats = useMemo(() => {
    const total = allBadges.length;
    const earned = earnedBadges.length;
    const byRarity = {};
    
    Object.keys(RARITY_CONFIG).forEach((rarity) => {
      const totalInRarity = allBadges.filter((b) => b.rarity === rarity).length;
      const earnedInRarity = earnedBadges.filter((b) => b.rarity === rarity).length;
      byRarity[rarity] = { total: totalInRarity, earned: earnedInRarity };
    });
    
    return { total, earned, byRarity };
  }, [allBadges, earnedBadges]);
  
  const handleBadgeClick = useCallback((badge) => {
    if (onBadgeClick) {
      onBadgeClick(badge);
    }
  }, [onBadgeClick]);
  
  const classNames = [
    'badge-collection',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <header className="badge-collection__header">
        <div className="badge-collection__header-content">
          <h2 className="badge-collection__title">
            <span className="badge-collection__title-icon">🏆</span>
            Badge Collection
          </h2>
          <p className="badge-collection__subtitle">
            {stats.earned} of {stats.total} badges earned
          </p>
        </div>
        
        {/* Progress */}
        {showProgress && (
          <div className="badge-collection__progress">
            <div className="badge-collection__progress-bar">
              <div 
                className="badge-collection__progress-fill"
                style={{ width: `${(stats.earned / stats.total) * 100}%` }}
              />
            </div>
            <span className="badge-collection__progress-text">
              {Math.round((stats.earned / stats.total) * 100)}%
            </span>
          </div>
        )}
      </header>
      
      {/* Rarity Stats */}
      <div className="badge-collection__rarity-stats">
        {Object.entries(stats.byRarity).map(([rarity, data]) => {
          if (data.total === 0) return null;
          const config = RARITY_CONFIG[rarity];
          return (
            <div 
              key={rarity}
              className={`badge-collection__rarity-stat badge-collection__rarity-stat--${rarity}`}
              style={{ '--rarity-color': config.color }}
            >
              <span className="badge-collection__rarity-label">
                {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
              </span>
              <span className="badge-collection__rarity-count">
                {data.earned}/{data.total}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Filters */}
      <div className="badge-collection__filters">
        {/* Categories */}
        <div className="badge-collection__categories">
          {BADGE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`badge-collection__category ${activeCategory === category.id ? 'badge-collection__category--active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="badge-collection__category-icon">{category.icon}</span>
              <span className="badge-collection__category-label">{category.label}</span>
            </button>
          ))}
        </div>
        
        {/* Filter Row */}
        <div className="badge-collection__filter-row">
          {/* Search */}
          <div className="badge-collection__search">
            <span className="badge-collection__search-icon">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search badges..."
              className="badge-collection__search-input"
            />
          </div>
          
          {/* Rarity Filter */}
          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value)}
            className="badge-collection__select"
          >
            {RARITY_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Earned Toggle */}
          <label className="badge-collection__toggle">
            <input
              type="checkbox"
              checked={showEarnedOnly}
              onChange={(e) => setShowEarnedOnly(e.target.checked)}
            />
            <span className="badge-collection__toggle-slider" />
            <span className="badge-collection__toggle-label">Earned only</span>
          </label>
        </div>
      </div>
      
      {/* Badge Grid */}
      <div className="badge-collection__grid">
        {filteredBadges.map((badge) => (
          <div
            key={badge.id}
            className={`badge-collection__badge ${badge.isEarned ? 'badge-collection__badge--earned' : 'badge-collection__badge--locked'}`}
            onClick={() => handleBadgeClick(badge)}
          >
            <div className={`badge-collection__badge-inner badge-collection__badge-inner--${badge.rarity || 'common'}`}>
              <span className="badge-collection__badge-icon">
                {badge.isEarned ? badge.icon : '🔒'}
              </span>
              {!badge.isEarned && (
                <div className="badge-collection__badge-overlay">
                  <span className="badge-collection__badge-lock">🔒</span>
                </div>
              )}
            </div>
            <span className="badge-collection__badge-name">{badge.name}</span>
            {badge.isEarned && badge.earnedDate && (
              <span className="badge-collection__badge-date">{badge.earnedDate}</span>
            )}
          </div>
        ))}
        
        {filteredBadges.length === 0 && (
          <div className="badge-collection__empty">
            <span className="badge-collection__empty-icon">🔍</span>
            <p>No badges found</p>
            <span className="badge-collection__empty-hint">
              Try adjusting your filters
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export { BADGE_CATEGORIES, RARITY_OPTIONS };
export default BadgeCollection;