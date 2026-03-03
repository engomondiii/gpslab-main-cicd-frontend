/**
 * GPS Lab Platform - PortfolioView Component
 * GPS 101 INTEGRATION: Display GPS 101 deliverables section, completion indicator
 * 
 * Complete portfolio view with header, entries list,
 * and filtering options.
 * 
 * @module components/portfolio/PortfolioView/PortfolioView
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PortfolioHeader from './PortfolioHeader';
import './PortfolioView.css';

/**
 * Portfolio view modes
 */
const VIEW_MODES = [
  { id: 'grid', icon: '▦', label: 'Grid' },
  { id: 'list', icon: '☰', label: 'List' }
];

/**
 * Sort options
 */
const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'popular', label: 'Most Popular' },
  { id: 'alphabetical', label: 'A-Z' }
];

/**
 * NEW: GPS 101 deliverable names
 */
const GPS101_DELIVERABLES = {
  1: 'Identity Statement',
  2: 'Life Problem Candidate',
  3: 'Problem Owner Story',
  4: 'Life Purpose Statement',
  5: 'Purpose-Driven Project'
};

/**
 * PortfolioView Component
 */
const PortfolioView = ({
  user = {},
  entries = [],
  categories = [],
  // NEW: GPS 101 props
  isGPS101Enrolled = false,
  gps101Deliverables = [],
  gps101Progress = 0,
  gps101CurrentStage = 1,
  orangeBeaconUnlocked = false,
  showGPS101Section = true,
  isOwnPortfolio = false,
  onEditPortfolio,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
  onEntryClick,
  onShare,
  // NEW: GPS 101 handlers
  onViewGPS101,
  onEditGPS101Deliverable,
  isLoading = false,
  className = '',
  ...props
}) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGPS101Only, setShowGPS101Only] = useState(false);
  
  // Calculate stats
  const portfolioStats = useMemo(() => ({
    totalEntries: entries.length,
    totalViews: entries.reduce((sum, e) => sum + (e.views || 0), 0),
    totalLikes: entries.reduce((sum, e) => sum + (e.likes || 0), 0),
    featuredCount: entries.filter((e) => e.isFeatured).length,
    // NEW: GPS 101 stats
    gps101Count: gps101Deliverables.filter(d => d.isCompleted).length
  }), [entries, gps101Deliverables]);
  
  // Get unique categories from entries
  const allCategories = useMemo(() => {
    const cats = new Set(categories);
    entries.forEach((e) => {
      if (e.category) cats.add(e.category);
    });
    return ['all', ...Array.from(cats)];
  }, [entries, categories]);
  
  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    let result = entries;
    
    // NEW: Filter for GPS 101 deliverables only
    if (showGPS101Only) {
      result = result.filter(e => e.isGPS101Deliverable);
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((e) => e.category === selectedCategory);
    }
    
    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((e) =>
        e.title?.toLowerCase().includes(query) ||
        e.description?.toLowerCase().includes(query) ||
        e.tags?.some((t) => t.toLowerCase().includes(query))
      );
    }
    
    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'alphabetical':
          return (a.title || '').localeCompare(b.title || '');
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    
    return result;
  }, [entries, selectedCategory, searchQuery, sortBy, showGPS101Only]);
  
  const handleEntryClick = useCallback((entry) => {
    if (onEntryClick) {
      onEntryClick(entry);
    }
  }, [onEntryClick]);
  
  const classNames = [
    'portfolio-view',
    isLoading && 'portfolio-view--loading',
    isGPS101Enrolled && showGPS101Section && 'portfolio-view--with-gps101',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <PortfolioHeader
        user={user}
        portfolioStats={portfolioStats}
        isOwnPortfolio={isOwnPortfolio}
        // NEW: GPS 101 props
        isGPS101Enrolled={isGPS101Enrolled}
        gps101Progress={gps101Progress}
        orangeBeaconUnlocked={orangeBeaconUnlocked}
        onEditPortfolio={onEditPortfolio}
        onAddEntry={onAddEntry}
        onShare={onShare}
        onViewGPS101={onViewGPS101}
      />
      
      {/* NEW: GPS 101 Deliverables Section */}
      {isGPS101Enrolled && showGPS101Section && (
        <section className="portfolio-view__gps101-section">
          <div className="portfolio-view__gps101-header">
            <div className="portfolio-view__gps101-title-section">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
              </svg>
              <div>
                <h3 className="portfolio-view__gps101-title">GPS 101 Deliverables</h3>
                <p className="portfolio-view__gps101-subtitle">Purpose Discovery Journey Artifacts</p>
              </div>
            </div>
            
            <div className="portfolio-view__gps101-stats">
              <div className="portfolio-view__gps101-progress">
                <span className="portfolio-view__gps101-progress-text">
                  {portfolioStats.gps101Count}/5 Complete
                </span>
                <div className="portfolio-view__gps101-progress-bar">
                  <div 
                    className="portfolio-view__gps101-progress-fill"
                    style={{ width: `${gps101Progress}%` }}
                  />
                </div>
              </div>
              
              {orangeBeaconUnlocked && (
                <div className="portfolio-view__gps101-beacon">
                  <span className="portfolio-view__gps101-beacon-icon">🟠</span>
                  <span className="portfolio-view__gps101-beacon-label">Orange Beacon</span>
                </div>
              )}
            </div>
            
            {onViewGPS101 && (
              <button
                type="button"
                className="portfolio-view__gps101-view-btn"
                onClick={onViewGPS101}
              >
                View GPS 101 Dashboard →
              </button>
            )}
          </div>
          
          <div className="portfolio-view__gps101-deliverables">
            {gps101Deliverables.map((deliverable, index) => (
              <article
                key={deliverable.stageNumber || index}
                className={`portfolio-view__gps101-deliverable ${deliverable.isCompleted ? 'portfolio-view__gps101-deliverable--completed' : ''} ${deliverable.stageNumber === gps101CurrentStage ? 'portfolio-view__gps101-deliverable--current' : ''}`}
                onClick={() => {
                  if (deliverable.isCompleted && deliverable.entryId) {
                    const entry = entries.find(e => e.id === deliverable.entryId);
                    if (entry) handleEntryClick(entry);
                  }
                }}
              >
                <div className="portfolio-view__gps101-deliverable-header">
                  <div className="portfolio-view__gps101-deliverable-stage">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                    </svg>
                    <span>Stage {deliverable.stageNumber}</span>
                  </div>
                  
                  {deliverable.isCompleted ? (
                    <span className="portfolio-view__gps101-deliverable-status portfolio-view__gps101-deliverable-status--complete">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      Complete
                    </span>
                  ) : deliverable.stageNumber === gps101CurrentStage ? (
                    <span className="portfolio-view__gps101-deliverable-status portfolio-view__gps101-deliverable-status--current">
                      In Progress
                    </span>
                  ) : (
                    <span className="portfolio-view__gps101-deliverable-status portfolio-view__gps101-deliverable-status--locked">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                      </svg>
                      Locked
                    </span>
                  )}
                </div>
                
                <h4 className="portfolio-view__gps101-deliverable-title">
                  {GPS101_DELIVERABLES[deliverable.stageNumber]}
                </h4>
                
                {deliverable.description && (
                  <p className="portfolio-view__gps101-deliverable-description">
                    {deliverable.description}
                  </p>
                )}
                
                {deliverable.isCompleted && deliverable.submittedDate && (
                  <span className="portfolio-view__gps101-deliverable-date">
                    Submitted {new Date(deliverable.submittedDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                )}
                
                {isOwnPortfolio && deliverable.isCompleted && onEditGPS101Deliverable && (
                  <button
                    type="button"
                    className="portfolio-view__gps101-deliverable-edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditGPS101Deliverable(deliverable);
                    }}
                  >
                    ✏️ Edit
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
      
      {/* Filters & Controls */}
      <div className="portfolio-view__controls">
        {/* Search */}
        <div className="portfolio-view__search">
          <span className="portfolio-view__search-icon">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries..."
            className="portfolio-view__search-input"
          />
        </div>
        
        {/* NEW: GPS 101 Filter Toggle */}
        {isGPS101Enrolled && (
          <button
            type="button"
            className={`portfolio-view__gps101-filter ${showGPS101Only ? 'portfolio-view__gps101-filter--active' : ''}`}
            onClick={() => setShowGPS101Only(!showGPS101Only)}
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
            </svg>
            GPS 101 Only
          </button>
        )}
        
        {/* Categories */}
        <div className="portfolio-view__categories">
          {allCategories.map((category) => (
            <button
              key={category}
              type="button"
              className={`portfolio-view__category ${selectedCategory === category ? 'portfolio-view__category--active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
        
        {/* Sort & View */}
        <div className="portfolio-view__options">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="portfolio-view__sort"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="portfolio-view__view-modes">
            {VIEW_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className={`portfolio-view__view-btn ${viewMode === mode.id ? 'portfolio-view__view-btn--active' : ''}`}
                onClick={() => setViewMode(mode.id)}
                title={mode.label}
              >
                {mode.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="portfolio-view__loading">
          <div className="portfolio-view__spinner" />
          <p>Loading portfolio...</p>
        </div>
      )}
      
      {/* Entries Grid/List */}
      {!isLoading && (
        <div className={`portfolio-view__entries portfolio-view__entries--${viewMode}`}>
          {filteredEntries.map((entry) => (
            <article
              key={entry.id}
              className={`portfolio-view__entry ${entry.isFeatured ? 'portfolio-view__entry--featured' : ''} ${entry.isGPS101Deliverable ? 'portfolio-view__entry--gps101' : ''}`}
              onClick={() => handleEntryClick(entry)}
            >
              {/* NEW: GPS 101 Badge */}
              {entry.isGPS101Deliverable && (
                <div className="portfolio-view__entry-gps101-badge">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                  </svg>
                  <span>GPS 101</span>
                  {entry.gps101StageNumber && (
                    <span className="portfolio-view__entry-gps101-stage">S{entry.gps101StageNumber}</span>
                  )}
                </div>
              )}
              
              {/* Thumbnail */}
              {entry.thumbnailUrl && (
                <div className="portfolio-view__entry-thumbnail">
                  <img src={entry.thumbnailUrl} alt={entry.title} />
                  {entry.isFeatured && (
                    <span className="portfolio-view__featured-badge">⭐ Featured</span>
                  )}
                </div>
              )}
              
              {/* Content */}
              <div className="portfolio-view__entry-content">
                <h3 className="portfolio-view__entry-title">{entry.title}</h3>
                {entry.description && (
                  <p className="portfolio-view__entry-desc">{entry.description}</p>
                )}
                
                {/* Tags */}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="portfolio-view__entry-tags">
                    {entry.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="portfolio-view__entry-tag">
                        {tag}
                      </span>
                    ))}
                    {entry.tags.length > 3 && (
                      <span className="portfolio-view__entry-tag portfolio-view__entry-tag--more">
                        +{entry.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Meta */}
                <div className="portfolio-view__entry-meta">
                  <span className="portfolio-view__entry-date">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                  <div className="portfolio-view__entry-stats">
                    <span>👁 {entry.views || 0}</span>
                    <span>❤️ {entry.likes || 0}</span>
                  </div>
                </div>
              </div>
              
              {/* Actions (own portfolio only) */}
              {isOwnPortfolio && (
                <div className="portfolio-view__entry-actions">
                  <button
                    type="button"
                    className="portfolio-view__entry-action"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditEntry && onEditEntry(entry);
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    className="portfolio-view__entry-action portfolio-view__entry-action--danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteEntry && onDeleteEntry(entry);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              )}
            </article>
          ))}
          
          {/* Empty State */}
          {filteredEntries.length === 0 && (
            <div className="portfolio-view__empty">
              <span className="portfolio-view__empty-icon">
                {showGPS101Only ? '🎓' : '📁'}
              </span>
              <h3>No entries found</h3>
              {searchQuery || selectedCategory !== 'all' || showGPS101Only ? (
                <p>Try adjusting your filters</p>
              ) : (
                <>
                  <p>
                    {isOwnPortfolio
                      ? 'Start building your portfolio by adding your first entry!'
                      : 'This portfolio is empty.'}
                  </p>
                  {isOwnPortfolio && (
                    <button
                      type="button"
                      className="portfolio-view__empty-btn"
                      onClick={onAddEntry}
                    >
                      ➕ Add Entry
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { VIEW_MODES, SORT_OPTIONS, GPS101_DELIVERABLES };
export default PortfolioView;