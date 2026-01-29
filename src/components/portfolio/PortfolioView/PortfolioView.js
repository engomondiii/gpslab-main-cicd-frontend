/**
 * GPS Lab Platform - PortfolioView Component
 * 
 * Complete portfolio view with header, entries list,
 * and filtering options.
 * 
 * @module components/portfolio/PortfolioView/PortfolioView
 */

import React, { useState, useCallback, useMemo } from 'react';
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
 * PortfolioView Component
 */
const PortfolioView = ({
  user = {},
  entries = [],
  categories = [],
  isOwnPortfolio = false,
  onEditPortfolio,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
  onEntryClick,
  onShare,
  isLoading = false,
  className = '',
  ...props
}) => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calculate stats
  const portfolioStats = useMemo(() => ({
    totalEntries: entries.length,
    totalViews: entries.reduce((sum, e) => sum + (e.views || 0), 0),
    totalLikes: entries.reduce((sum, e) => sum + (e.likes || 0), 0),
    featuredCount: entries.filter((e) => e.isFeatured).length
  }), [entries]);
  
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
  }, [entries, selectedCategory, searchQuery, sortBy]);
  
  const handleEntryClick = useCallback((entry) => {
    if (onEntryClick) {
      onEntryClick(entry);
    }
  }, [onEntryClick]);
  
  const classNames = [
    'portfolio-view',
    isLoading && 'portfolio-view--loading',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <PortfolioHeader
        user={user}
        portfolioStats={portfolioStats}
        isOwnPortfolio={isOwnPortfolio}
        onEditPortfolio={onEditPortfolio}
        onAddEntry={onAddEntry}
        onShare={onShare}
      />
      
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
              className={`portfolio-view__entry ${entry.isFeatured ? 'portfolio-view__entry--featured' : ''}`}
              onClick={() => handleEntryClick(entry)}
            >
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
              <span className="portfolio-view__empty-icon">📁</span>
              <h3>No entries found</h3>
              {searchQuery || selectedCategory !== 'all' ? (
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

export { VIEW_MODES, SORT_OPTIONS };
export default PortfolioView;