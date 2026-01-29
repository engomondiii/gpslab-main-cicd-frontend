/**
 * GPS Lab Platform - PraiseFeed Component
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
  { id: 'party', label: 'My Party', icon: '👥' }
];

/**
 * PraiseFeed Component
 */
const PraiseFeed = ({
  praises = [],
  currentUserId,
  partyId = null,
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
  
  const classNames = [
    'praise-feed',
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
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`praise-feed__filter ${activeFilter === filter.id ? 'praise-feed__filter--active' : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              <span className="praise-feed__filter-icon">{filter.icon}</span>
              <span className="praise-feed__filter-label">{filter.label}</span>
            </button>
          ))}
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
            <span className="praise-feed__empty-icon">🎊</span>
            <p className="praise-feed__empty-text">{emptyMessage}</p>
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
            {filteredPraises.map((praise, index) => (
              <PraiseItem
                key={praise.id || index}
                praise={praise}
                currentUserId={currentUserId}
                onReact={onReact}
                onShare={onShare}
                onUserClick={onUserClick}
                variant={index === 0 ? 'featured' : 'default'}
              />
            ))}
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