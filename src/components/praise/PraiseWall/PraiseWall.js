/**
 * GPS Lab Platform - PraiseWall Component
 * 
 * Masonry-style public wall displaying praise from the
 * entire GPS Lab community with celebration animations.
 * 
 * @module components/praise/PraiseWall/PraiseWall
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import PraiseItem from '../PraiseFeed/PraiseItem';
import './PraiseWall.css';

/**
 * Sort options for the wall
 */
const SORT_OPTIONS = [
  { id: 'recent', label: 'Most Recent', icon: '🕐' },
  { id: 'popular', label: 'Most Popular', icon: '❤️' },
  { id: 'badges', label: 'With Badges', icon: '🏆' }
];

/**
 * Stage filter options
 */
const STAGE_FILTERS = [
  { id: 'all', label: 'All Stages', color: 'var(--gps-primary)' },
  { id: '1', label: 'Stage 1', color: 'var(--beacon-red)' },
  { id: '2', label: 'Stage 2', color: 'var(--beacon-orange)' },
  { id: '3', label: 'Stage 3', color: 'var(--beacon-yellow)' },
  { id: '4', label: 'Stage 4', color: 'var(--beacon-green)' },
  { id: '5', label: 'Stage 5', color: 'var(--beacon-blue)' },
  { id: '6', label: 'Stage 6', color: 'var(--beacon-indigo)' },
  { id: '7', label: 'Stage 7', color: 'var(--beacon-purple)' }
];

/**
 * PraiseWall Component
 */
const PraiseWall = ({
  praises = [],
  currentUserId,
  onLoadMore,
  onReact,
  onShare,
  onUserClick,
  onGivePraise,
  hasMore = false,
  isLoading = false,
  isLoadingMore = false,
  stats = {},
  className = '',
  ...props
}) => {
  const [sortBy, setSortBy] = useState('recent');
  const [stageFilter, setStageFilter] = useState('all');
  const [showCelebration, setShowCelebration] = useState(false);
  const wallRef = useRef(null);
  const loadMoreRef = useRef(null);
  
  // Sort and filter praises
  const processedPraises = praises
    .filter((praise) => {
      if (stageFilter === 'all') return true;
      return praise.sender?.stage?.toString() === stageFilter ||
             praise.recipient?.stage?.toString() === stageFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.reactions || 0) - (a.reactions || 0);
        case 'badges':
          return (b.badge ? 1 : 0) - (a.badge ? 1 : 0);
        default: // recent
          return new Date(b.timestamp) - new Date(a.timestamp);
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
  
  // Celebration animation trigger
  const triggerCelebration = useCallback(() => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  }, []);
  
  const classNames = [
    'praise-wall',
    showCelebration && 'praise-wall--celebrating',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <header className="praise-wall__header">
        <div className="praise-wall__header-content">
          <h1 className="praise-wall__title">
            <span className="praise-wall__title-icon">🏆</span>
            GPS Lab Praise Wall
          </h1>
          <p className="praise-wall__subtitle">
            Celebrating our global community of problem solvers
          </p>
        </div>
        
        {/* Stats */}
        <div className="praise-wall__stats">
          <div className="praise-wall__stat">
            <span className="praise-wall__stat-value">{stats.totalPraises || 0}</span>
            <span className="praise-wall__stat-label">Total Praises</span>
          </div>
          <div className="praise-wall__stat">
            <span className="praise-wall__stat-value">{stats.todayPraises || 0}</span>
            <span className="praise-wall__stat-label">Today</span>
          </div>
          <div className="praise-wall__stat">
            <span className="praise-wall__stat-value">{stats.badgesAwarded || 0}</span>
            <span className="praise-wall__stat-label">Badges</span>
          </div>
        </div>
      </header>
      
      {/* Controls */}
      <div className="praise-wall__controls">
        <div className="praise-wall__controls-left">
          {/* Sort */}
          <div className="praise-wall__sort">
            <label className="praise-wall__sort-label">Sort by:</label>
            <div className="praise-wall__sort-options">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`praise-wall__sort-btn ${sortBy === option.id ? 'praise-wall__sort-btn--active' : ''}`}
                  onClick={() => setSortBy(option.id)}
                >
                  <span className="praise-wall__sort-icon">{option.icon}</span>
                  <span className="praise-wall__sort-text">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Stage Filter */}
          <div className="praise-wall__stage-filter">
            <label className="praise-wall__stage-label">Stage:</label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="praise-wall__stage-select"
            >
              {STAGE_FILTERS.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {onGivePraise && (
          <button
            type="button"
            className="praise-wall__give-btn"
            onClick={() => {
              onGivePraise();
              triggerCelebration();
            }}
          >
            <span className="praise-wall__give-icon">🎉</span>
            Give Praise
            <span className="praise-wall__give-baraka">+5 🪙</span>
          </button>
        )}
      </div>
      
      {/* Wall Content */}
      <div ref={wallRef} className="praise-wall__content">
        {/* Loading State */}
        {isLoading && (
          <div className="praise-wall__loading">
            <div className="praise-wall__spinner" />
            <span>Loading the Praise Wall...</span>
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && processedPraises.length === 0 && (
          <div className="praise-wall__empty">
            <span className="praise-wall__empty-icon">🌟</span>
            <h3 className="praise-wall__empty-title">The Wall Awaits!</h3>
            <p className="praise-wall__empty-text">
              Be the first to add praise to this wall and celebrate our community!
            </p>
            {onGivePraise && (
              <button
                type="button"
                className="praise-wall__empty-btn"
                onClick={onGivePraise}
              >
                <span className="praise-wall__empty-btn-icon">🎉</span>
                Add First Praise
              </button>
            )}
          </div>
        )}
        
        {/* Masonry Grid */}
        {!isLoading && processedPraises.length > 0 && (
          <div className="praise-wall__masonry">
            {processedPraises.map((praise, index) => (
              <div key={praise.id || index} className="praise-wall__item">
                <PraiseItem
                  praise={praise}
                  currentUserId={currentUserId}
                  onReact={onReact}
                  onShare={onShare}
                  onUserClick={onUserClick}
                  variant={praise.badge ? 'featured' : 'default'}
                />
              </div>
            ))}
          </div>
        )}
        
        {/* Load More */}
        {hasMore && (
          <div ref={loadMoreRef} className="praise-wall__load-more">
            {isLoadingMore ? (
              <>
                <div className="praise-wall__spinner praise-wall__spinner--small" />
                <span>Loading more praises...</span>
              </>
            ) : (
              <span>Scroll for more</span>
            )}
          </div>
        )}
      </div>
      
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="praise-wall__celebration">
          <div className="praise-wall__confetti">
            {Array.from({ length: 50 }).map((_, i) => (
              <span 
                key={i} 
                className="praise-wall__confetti-piece"
                style={{
                  '--delay': `${Math.random() * 3}s`,
                  '--x': `${Math.random() * 100}%`,
                  '--rotation': `${Math.random() * 360}deg`
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PraiseWall;