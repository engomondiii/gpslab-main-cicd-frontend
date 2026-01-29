/**
 * GPS Lab Platform - PortfolioEntryList Component
 * 
 * List/grid view of portfolio entries with
 * sorting and filtering.
 * 
 * @module components/portfolio/PortfolioEntries/PortfolioEntryList
 */

import React, { useState, useMemo, useCallback } from 'react';
import PortfolioEntryCard, { ENTRY_TYPES } from './PortfolioEntryCard';
import './PortfolioEntryList.css';

/**
 * PortfolioEntryList Component
 */
const PortfolioEntryList = ({
  entries = [],
  likedEntries = [],
  onEntryClick,
  onEditEntry,
  onDeleteEntry,
  onLikeEntry,
  showActions = false,
  viewMode = 'grid', // grid, list, compact
  sortBy = 'newest',
  filterType = 'all',
  className = '',
  ...props
}) => {
  const [localViewMode, setLocalViewMode] = useState(viewMode);
  const [localSortBy, setLocalSortBy] = useState(sortBy);
  const [localFilterType, setLocalFilterType] = useState(filterType);
  
  // Get entry types for filter
  const availableTypes = useMemo(() => {
    const types = new Set();
    entries.forEach((e) => {
      if (e.type) types.add(e.type);
    });
    return Array.from(types);
  }, [entries]);
  
  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    let result = entries;
    
    // Filter by type
    if (localFilterType !== 'all') {
      result = result.filter((e) => e.type === localFilterType);
    }
    
    // Sort
    result = [...result].sort((a, b) => {
      switch (localSortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'liked':
          return (b.likes || 0) - (a.likes || 0);
        case 'alphabetical':
          return (a.title || '').localeCompare(b.title || '');
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    
    return result;
  }, [entries, localFilterType, localSortBy]);
  
  const isLiked = useCallback((entryId) => {
    return likedEntries.includes(entryId);
  }, [likedEntries]);
  
  const classNames = [
    'portfolio-entry-list',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Controls */}
      <div className="portfolio-entry-list__controls">
        {/* Type Filter */}
        <div className="portfolio-entry-list__filters">
          <button
            type="button"
            className={`portfolio-entry-list__filter ${localFilterType === 'all' ? 'portfolio-entry-list__filter--active' : ''}`}
            onClick={() => setLocalFilterType('all')}
          >
            All
          </button>
          {availableTypes.map((type) => {
            const typeConfig = ENTRY_TYPES[type] || ENTRY_TYPES.other;
            return (
              <button
                key={type}
                type="button"
                className={`portfolio-entry-list__filter ${localFilterType === type ? 'portfolio-entry-list__filter--active' : ''}`}
                onClick={() => setLocalFilterType(type)}
              >
                <span>{typeConfig.icon}</span>
                {typeConfig.label}
              </button>
            );
          })}
        </div>
        
        {/* Right Controls */}
        <div className="portfolio-entry-list__right-controls">
          {/* Sort */}
          <select
            value={localSortBy}
            onChange={(e) => setLocalSortBy(e.target.value)}
            className="portfolio-entry-list__sort"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Most Viewed</option>
            <option value="liked">Most Liked</option>
            <option value="alphabetical">A-Z</option>
          </select>
          
          {/* View Mode */}
          <div className="portfolio-entry-list__view-modes">
            <button
              type="button"
              className={`portfolio-entry-list__view-btn ${localViewMode === 'grid' ? 'portfolio-entry-list__view-btn--active' : ''}`}
              onClick={() => setLocalViewMode('grid')}
              title="Grid View"
            >
              ▦
            </button>
            <button
              type="button"
              className={`portfolio-entry-list__view-btn ${localViewMode === 'list' ? 'portfolio-entry-list__view-btn--active' : ''}`}
              onClick={() => setLocalViewMode('list')}
              title="List View"
            >
              ☰
            </button>
            <button
              type="button"
              className={`portfolio-entry-list__view-btn ${localViewMode === 'compact' ? 'portfolio-entry-list__view-btn--active' : ''}`}
              onClick={() => setLocalViewMode('compact')}
              title="Compact View"
            >
              ≡
            </button>
          </div>
        </div>
      </div>
      
      {/* Results Count */}
      <div className="portfolio-entry-list__results">
        <span className="portfolio-entry-list__count">
          {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>
      
      {/* Entries Grid */}
      <div className={`portfolio-entry-list__grid portfolio-entry-list__grid--${localViewMode}`}>
        {filteredEntries.map((entry) => (
          <PortfolioEntryCard
            key={entry.id}
            entry={entry}
            onClick={onEntryClick}
            onEdit={onEditEntry}
            onDelete={onDeleteEntry}
            onLike={onLikeEntry}
            showActions={showActions}
            isLiked={isLiked(entry.id)}
            variant={localViewMode === 'compact' ? 'compact' : 'default'}
          />
        ))}
      </div>
      
      {/* Empty State */}
      {filteredEntries.length === 0 && (
        <div className="portfolio-entry-list__empty">
          <span className="portfolio-entry-list__empty-icon">📭</span>
          <p>No entries found</p>
          {localFilterType !== 'all' && (
            <button
              type="button"
              className="portfolio-entry-list__clear-filter"
              onClick={() => setLocalFilterType('all')}
            >
              Clear filter
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PortfolioEntryList;