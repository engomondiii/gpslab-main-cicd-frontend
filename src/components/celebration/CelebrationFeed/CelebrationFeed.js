/**
 * GPS Lab Platform - CelebrationFeed Component
 * 
 * Activity feed showing celebrations from users,
 * parties, and the global community.
 * 
 * Integrates with:
 * - Phase 15: Party System (party celebrations)
 * - Phase 18: Praise System (social interactions)
 * - Phase 19: Economy (Baraka/PSB transactions)
 * - Phase 20: Profile/Portfolio updates
 * 
 * @module components/celebration/CelebrationFeed/CelebrationFeed
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import CelebrationItem, { ITEM_TYPES } from './CelebrationItem';
import './CelebrationFeed.css';

/**
 * Feed filter options
 */
const FEED_FILTERS = [
  { id: 'all', label: 'All', icon: '📣' },
  { id: 'progress', label: 'Progress', icon: '📈' },
  { id: 'achievement', label: 'Achievements', icon: '🏆' },
  { id: 'social', label: 'Social', icon: '👥' },
  { id: 'economy', label: 'Economy', icon: '💰' },
  { id: 'milestone', label: 'Milestones', icon: '🏁' }
];

/**
 * Feed scope options
 */
const FEED_SCOPES = [
  { id: 'global', label: 'Global', icon: '🌍' },
  { id: 'party', label: 'My Party', icon: '🎉' },
  { id: 'following', label: 'Following', icon: '👀' },
  { id: 'personal', label: 'My Activity', icon: '👤' }
];

/**
 * CelebrationFeed Component
 */
const CelebrationFeed = ({
  items = [],
  currentUserId,
  partyId,
  onLoadMore,
  onUserClick,
  onItemClick,
  onPraise,
  onShare,
  isLoading = false,
  hasMore = false,
  emptyMessage = 'No celebrations yet',
  showFilters = true,
  showScopeSelector = true,
  initialFilter = 'all',
  initialScope = 'global',
  variant = 'default', // default, compact, sidebar
  maxHeight,
  className = '',
  ...props
}) => {
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [activeScope, setActiveScope] = useState(initialScope);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [newItemsCount, setNewItemsCount] = useState(0);
  
  // Filter items based on selected filter and scope
  const filteredItems = useMemo(() => {
    let result = items;
    
    // Filter by category
    if (activeFilter !== 'all') {
      result = result.filter((item) => {
        const typeConfig = ITEM_TYPES[item.type];
        return typeConfig?.category === activeFilter;
      });
    }
    
    // Filter by scope
    switch (activeScope) {
      case 'party':
        result = result.filter((item) => item.partyId === partyId);
        break;
      case 'following':
        result = result.filter((item) => item.user?.isFollowing);
        break;
      case 'personal':
        result = result.filter((item) => item.user?.id === currentUserId);
        break;
      default:
        // 'global' shows all
        break;
    }
    
    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        item.user?.displayName?.toLowerCase().includes(query) ||
        item.details?.stageName?.toLowerCase().includes(query) ||
        item.details?.badgeName?.toLowerCase().includes(query) ||
        item.message?.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [items, activeFilter, activeScope, partyId, currentUserId, searchQuery]);
  
  // Group items by date
  const groupedItems = useMemo(() => {
    const groups = {};
    
    filteredItems.forEach((item) => {
      const date = new Date(item.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let groupKey;
      if (date.toDateString() === today.toDateString()) {
        groupKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'Yesterday';
      } else {
        groupKey = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });
    
    return groups;
  }, [filteredItems]);
  
  // Handle new items notification
  useEffect(() => {
    if (!autoRefresh && items.length > 0) {
      // Track new items that arrived while auto-refresh was off
      setNewItemsCount((prev) => prev + 1);
    }
  }, [items.length, autoRefresh]);
  
  // Load new items
  const handleLoadNewItems = useCallback(() => {
    setNewItemsCount(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  // Handle filter change
  const handleFilterChange = useCallback((filterId) => {
    setActiveFilter(filterId);
  }, []);
  
  // Handle scope change
  const handleScopeChange = useCallback((scopeId) => {
    setActiveScope(scopeId);
  }, []);
  
  const classNames = [
    'celebration-feed',
    `celebration-feed--${variant}`,
    isLoading && 'celebration-feed--loading',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      className={classNames} 
      style={{ maxHeight }}
      {...props}
    >
      {/* Header */}
      <header className="celebration-feed__header">
        <h2 className="celebration-feed__title">
          <span className="celebration-feed__title-icon">🎊</span>
          Celebrations
        </h2>
        
        {/* Scope Selector */}
        {showScopeSelector && (
          <div className="celebration-feed__scope-selector">
            {FEED_SCOPES.map((scope) => (
              <button
                key={scope.id}
                type="button"
                className={`celebration-feed__scope-btn ${activeScope === scope.id ? 'celebration-feed__scope-btn--active' : ''}`}
                onClick={() => handleScopeChange(scope.id)}
                title={scope.label}
              >
                <span>{scope.icon}</span>
                <span className="celebration-feed__scope-label">{scope.label}</span>
              </button>
            ))}
          </div>
        )}
      </header>
      
      {/* Filters */}
      {showFilters && (
        <div className="celebration-feed__filters">
          {FEED_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`celebration-feed__filter ${activeFilter === filter.id ? 'celebration-feed__filter--active' : ''}`}
              onClick={() => handleFilterChange(filter.id)}
            >
              <span className="celebration-feed__filter-icon">{filter.icon}</span>
              <span className="celebration-feed__filter-label">{filter.label}</span>
            </button>
          ))}
        </div>
      )}
      
      {/* Search (for non-compact variants) */}
      {variant !== 'compact' && variant !== 'sidebar' && (
        <div className="celebration-feed__search">
          <span className="celebration-feed__search-icon">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search celebrations..."
            className="celebration-feed__search-input"
          />
        </div>
      )}
      
      {/* New Items Notification */}
      {newItemsCount > 0 && (
        <button
          type="button"
          className="celebration-feed__new-items"
          onClick={handleLoadNewItems}
        >
          <span>🔔</span>
          {newItemsCount} new celebration{newItemsCount > 1 ? 's' : ''}
        </button>
      )}
      
      {/* Feed Content */}
      <div className="celebration-feed__content">
        {Object.keys(groupedItems).length > 0 ? (
          Object.entries(groupedItems).map(([date, dateItems]) => (
            <div key={date} className="celebration-feed__group">
              <div className="celebration-feed__group-header">
                <span className="celebration-feed__group-date">{date}</span>
                <span className="celebration-feed__group-count">
                  {dateItems.length} celebration{dateItems.length > 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="celebration-feed__items">
                {dateItems.map((item) => (
                  <CelebrationItem
                    key={item.id}
                    item={item}
                    currentUserId={currentUserId}
                    onUserClick={onUserClick}
                    onItemClick={onItemClick}
                    onPraise={onPraise}
                    onShare={onShare}
                    variant={variant === 'sidebar' ? 'compact' : variant}
                    showActions={variant !== 'compact' && variant !== 'sidebar'}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="celebration-feed__empty">
            <span className="celebration-feed__empty-icon">🎊</span>
            <p className="celebration-feed__empty-text">{emptyMessage}</p>
            {activeFilter !== 'all' && (
              <button
                type="button"
                className="celebration-feed__clear-filter"
                onClick={() => setActiveFilter('all')}
              >
                Show all celebrations
              </button>
            )}
          </div>
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div className="celebration-feed__loading">
            <div className="celebration-feed__spinner" />
            <span>Loading celebrations...</span>
          </div>
        )}
        
        {/* Load More */}
        {hasMore && !isLoading && (
          <button
            type="button"
            className="celebration-feed__load-more"
            onClick={onLoadMore}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export { FEED_FILTERS, FEED_SCOPES };
export default CelebrationFeed;