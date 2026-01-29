/**
 * GPS Lab Platform - BarakaStore Component
 * 
 * Main store interface for spending Baraka on
 * cosmetics, powerups, and other items.
 * 
 * @module components/baraka/BarakaSpend/BarakaStore
 */

import React, { useState, useCallback, useMemo } from 'react';
import BarakaStoreItem, { CATEGORY_ICONS } from './BarakaStoreItem';
import './BarakaStore.css';

/**
 * Store categories
 */
const STORE_CATEGORIES = [
  { id: 'all', label: 'All Items', icon: '🏪' },
  { id: 'featured', label: 'Featured', icon: '⭐' },
  { id: 'avatar', label: 'Avatars', icon: '👤' },
  { id: 'badge', label: 'Badges', icon: '🏆' },
  { id: 'theme', label: 'Themes', icon: '🎨' },
  { id: 'boost', label: 'Boosts', icon: '⚡' },
  { id: 'title', label: 'Titles', icon: '📛' },
  { id: 'emote', label: 'Emotes', icon: '😄' }
];

/**
 * Sort options
 */
const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'newest', label: 'Newest' },
  { id: 'rarity', label: 'Rarity' }
];

/**
 * Rarity order for sorting
 */
const RARITY_ORDER = {
  legendary: 5,
  epic: 4,
  rare: 3,
  uncommon: 2,
  common: 1
};

/**
 * BarakaStore Component
 */
const BarakaStore = ({
  items = [],
  userBalance = 0,
  onPurchase,
  onPreview,
  showBalance = true,
  showFilters = true,
  showHeader = true,
  className = '',
  ...props
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOwned, setShowOwned] = useState(true);
  
  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = items;
    
    // Category filter
    if (activeCategory !== 'all') {
      if (activeCategory === 'featured') {
        filtered = filtered.filter((item) => item.isNew || item.isLimited);
      } else {
        filtered = filtered.filter((item) => item.category === activeCategory);
      }
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    }
    
    // Owned filter
    if (!showOwned) {
      filtered = filtered.filter((item) => !item.owned);
    }
    
    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'rarity':
          return (RARITY_ORDER[b.rarity] || 0) - (RARITY_ORDER[a.rarity] || 0);
        default: // featured
          const aScore = (a.isLimited ? 10 : 0) + (a.isNew ? 5 : 0) + (RARITY_ORDER[a.rarity] || 0);
          const bScore = (b.isLimited ? 10 : 0) + (b.isNew ? 5 : 0) + (RARITY_ORDER[b.rarity] || 0);
          return bScore - aScore;
      }
    });
    
    return filtered;
  }, [items, activeCategory, searchQuery, showOwned, sortBy]);
  
  const handlePurchase = useCallback(async (item) => {
    if (onPurchase) {
      await onPurchase(item);
    }
  }, [onPurchase]);
  
  const classNames = [
    'baraka-store',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      {showHeader && (
        <header className="baraka-store__header">
          <div className="baraka-store__header-content">
            <h2 className="baraka-store__title">
              <span className="baraka-store__title-icon">🛒</span>
              Baraka Store
            </h2>
            <p className="baraka-store__subtitle">
              Spend your Baraka on exclusive items
            </p>
          </div>
          
          {showBalance && (
            <div className="baraka-store__balance">
              <span className="baraka-store__balance-label">Your Balance</span>
              <span className="baraka-store__balance-value">
                {userBalance.toLocaleString()} 🪙
              </span>
            </div>
          )}
        </header>
      )}
      
      {/* Filters */}
      {showFilters && (
        <div className="baraka-store__filters">
          {/* Categories */}
          <div className="baraka-store__categories">
            {STORE_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`baraka-store__category ${activeCategory === category.id ? 'baraka-store__category--active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="baraka-store__category-icon">{category.icon}</span>
                <span className="baraka-store__category-label">{category.label}</span>
              </button>
            ))}
          </div>
          
          {/* Search & Sort */}
          <div className="baraka-store__controls">
            <div className="baraka-store__search">
              <span className="baraka-store__search-icon">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items..."
                className="baraka-store__search-input"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="baraka-store__sort"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <label className="baraka-store__toggle">
              <input
                type="checkbox"
                checked={showOwned}
                onChange={(e) => setShowOwned(e.target.checked)}
              />
              <span>Show Owned</span>
            </label>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="baraka-store__content">
        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="baraka-store__empty">
            <span className="baraka-store__empty-icon">🏪</span>
            <h3 className="baraka-store__empty-title">No Items Found</h3>
            <p className="baraka-store__empty-text">
              {searchQuery ? 
                'Try adjusting your search or filters' : 
                'Check back later for new items!'}
            </p>
          </div>
        )}
        
        {/* Item Grid */}
        {filteredItems.length > 0 && (
          <div className="baraka-store__grid">
            {filteredItems.map((item) => (
              <BarakaStoreItem
                key={item.id}
                item={item}
                userBalance={userBalance}
                onPurchase={handlePurchase}
                onPreview={onPreview}
                variant={item.isLimited ? 'featured' : 'default'}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Footer Stats */}
      <footer className="baraka-store__footer">
        <span className="baraka-store__footer-stat">
          {filteredItems.length} items
        </span>
        <span className="baraka-store__footer-stat">
          {items.filter((i) => i.owned).length} owned
        </span>
        <span className="baraka-store__footer-stat">
          {items.filter((i) => i.isNew).length} new
        </span>
      </footer>
    </div>
  );
};

export { STORE_CATEGORIES, SORT_OPTIONS };
export default BarakaStore;