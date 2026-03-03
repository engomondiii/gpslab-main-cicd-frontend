/**
 * GPS Lab Platform - PraiseFeed Component
 * GPS 101 INTEGRATION: GPS 101 context in praise feed, Orange Beacon unlock praise
 * 
 * Scrollable feed of praise items with filtering,
 * infinite scroll, and real-time updates.
 * 
 * @module components/praise/PraiseFeed/PraiseFeed
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import PraiseItem from './PraiseItem';
import './PraiseFeed.css';

/**
 * Filter options
 */
const FILTER_OPTIONS = [
  { id: 'all', label: 'All', icon: '🌐' },
  { id: 'received', label: 'Received', icon: '📥' },
  { id: 'sent', label: 'Sent', icon: '📤' },
  { id: 'party', label: 'My Party', icon: '👥' },
  // NEW: GPS 101 filter
  { id: 'gps101', label: 'GPS 101', icon: '🎓' }
];

/**
 * PraiseFeed Component
 */
const PraiseFeed = ({
  praises = [],
  currentUserId,
  partyId = null,
  // NEW: GPS 101 props
  showGPS101Filter = true,
  highlightGPS101 = true,
  onLoadMore,
  onReact,
  onShare,
  onUserClick,
  onGivePraise,
  hasMore = false,
  isLoading = false,
  isLoadingMore = false,
  showFilters = true,
  showHeader = true,
  emptyMessage = 'No praise yet. Be the first to give praise!',
  className = '',
  ...props
}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [newPraiseCount, setNewPraiseCount] = useState(0);
  const feedRef = useRef(null);
  const loadMoreRef = useRef(null);
  
  // Filter praises
  const filteredPraises = praises.filter((praise) => {
    switch (activeFilter) {
      case 'received':
        return praise.recipient?.id === currentUserId;
      case 'sent':
        return praise.sender?.id === currentUserId;
      case 'party':
        return praise.partyId === partyId;
      // NEW: GPS 101 filter
      case 'gps101':
        return praise.isGPS101 || praise.context?.isGPS101;
      default:
        return true;
    }
  });
  
  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || isLoadingMore) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && onLoadMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(loadMoreRef.current);
    
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, onLoadMore]);
  
  // Handle new praise notification
  const handleShowNewPraises = useCallback(() => {
    setNewPraiseCount(0);
    if (feedRef.current) {
      feedRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);
  
  // Get available filters (conditionally include GPS 101)
  const availableFilters = React.useMemo(() => {
    if (!showGPS101Filter) {
      return FILTER_OPTIONS.filter(f => f.id !== 'gps101');
    }
    return FILTER_OPTIONS;
  }, [showGPS101Filter]);
  
  const classNames = [
    'praise-feed',
    highlightGPS101 && 'praise-feed--highlight-gps101',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      {showHeader && (
        <header className="praise-feed__header">
          <div className="praise-feed__header-content">
            <h2 className="praise-feed__title">
              <span className="praise-feed__title-icon">🎉</span>
              Praise Feed
            </h2>
            <p className="praise-feed__subtitle">
              Celebrating GPS Lab community achievements
              {activeFilter === 'gps101' && ' • GPS 101 Purpose Discovery'}
            </p>
          </div>
          
          {onGivePraise && (
            <button
              type="button"
              className="praise-feed__give-btn"
              onClick={onGivePraise}
            >
              <span className="praise-feed__give-icon">✨</span>
              Give Praise
            </button>
          )}
        </header>
      )}
      
      {/* Filters */}
      {showFilters && (
        <div className="praise-feed__filters">
          {availableFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`praise-feed__filter ${activeFilter === filter.id ? 'praise-feed__filter--active' : ''} ${filter.id === 'gps101' ? 'praise-feed__filter--gps101' : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              <span className="praise-feed__filter-icon">{filter.icon}</span>
              <span className="praise-feed__filter-label">{filter.label}</span>
            </button>
          ))}
        </div>
      )}
      
      {/* NEW: GPS 101 Filter Banner */}
      {activeFilter === 'gps101' && (
        <div className="praise-feed__gps101-banner">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
          </svg>
          <div>
            <h3 className="praise-feed__gps101-banner-title">GPS 101 Praise</h3>
            <p className="praise-feed__gps101-banner-text">
              Celebrating purpose discovery milestones, stage completions, and Orange Beacon unlocks
            </p>
          </div>
        </div>
      )}
      
      {/* New Praise Notification */}
      {newPraiseCount > 0 && (
        <button
          type="button"
          className="praise-feed__new-notification"
          onClick={handleShowNewPraises}
        >
          <span className="praise-feed__new-icon">🎉</span>
          {newPraiseCount} new praise{newPraiseCount > 1 ? 's' : ''}
        </button>
      )}
      
      {/* Feed Content */}
      <div ref={feedRef} className="praise-feed__content">
        {/* Loading State */}
        {isLoading && (
          <div className="praise-feed__loading">
            <div className="praise-feed__spinner" />
            <span>Loading praises...</span>
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && filteredPraises.length === 0 && (
          <div className="praise-feed__empty">
            <span className="praise-feed__empty-icon">
              {activeFilter === 'gps101' ? '🎓' : '🎊'}
            </span>
            <p className="praise-feed__empty-text">
              {activeFilter === 'gps101' 
                ? 'No GPS 101 praise yet. Give praise for purpose discovery achievements!'
                : emptyMessage}
            </p>
            {onGivePraise && (
              <button
                type="button"
                className="praise-feed__empty-btn"
                onClick={onGivePraise}
              >
                <span className="praise-feed__empty-btn-icon">🎉</span>
                Give First Praise
              </button>
            )}
          </div>
        )}
        
        {/* Praise List */}
        {!isLoading && filteredPraises.length > 0 && (
          <div className="praise-feed__list">
            {filteredPraises.map((praise, index) => {
              const isGPS101 = praise.isGPS101 || praise.context?.isGPS101;
              
              return (
                <PraiseItem
                  key={praise.id || index}
                  praise={praise}
                  currentUserId={currentUserId}
                  onReact={onReact}
                  onShare={onShare}
                  onUserClick={onUserClick}
                  variant={index === 0 ? 'featured' : 'default'}
                  // NEW: GPS 101 props
                  isGPS101={isGPS101}
                  gps101Context={praise.context?.gps101}
                  highlightGPS101={highlightGPS101}
                />
              );
            })}
          </div>
        )}
        
        {/* Load More Trigger */}
        {hasMore && (
          <div ref={loadMoreRef} className="praise-feed__load-more">
            {isLoadingMore ? (
              <>
                <div className="praise-feed__spinner praise-feed__spinner--small" />
                <span>Loading more...</span>
              </>
            ) : (
              <span>Scroll for more</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PraiseFeed;