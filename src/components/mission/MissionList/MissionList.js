/**
 * GPS Lab Platform - MissionList Component
 * 
 * Displays a filterable, sortable list of missions.
 * Integrates with dashboard activity and stage progress.
 * 
 * @module components/mission/MissionList/MissionList
 */

import React, { useState, useMemo, useCallback } from 'react';
import MissionListItem from './MissionListItem';
import './MissionList.css';

/**
 * Filter options
 */
const FILTER_OPTIONS = {
  status: [
    { value: 'all', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'locked', label: 'Locked' }
  ],
  type: [
    { value: 'all', label: 'All Types' },
    { value: 'standard', label: 'Standard' },
    { value: 'boss', label: 'Boss Battle' },
    { value: 'checkpoint', label: 'Checkpoint' },
    { value: 'challenge', label: 'Challenge' },
    { value: 'party', label: 'Party Quest' }
  ],
  difficulty: [
    { value: 'all', label: 'All Difficulties' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
    { value: 'expert', label: 'Expert' }
  ]
};

/**
 * Sort options
 */
const SORT_OPTIONS = [
  { value: 'default', label: 'Default Order' },
  { value: 'difficulty_asc', label: 'Difficulty: Easy → Hard' },
  { value: 'difficulty_desc', label: 'Difficulty: Hard → Easy' },
  { value: 'xp_desc', label: 'XP: High → Low' },
  { value: 'xp_asc', label: 'XP: Low → High' },
  { value: 'time_asc', label: 'Time: Short → Long' },
  { value: 'time_desc', label: 'Time: Long → Short' }
];

/**
 * Difficulty sort order
 */
const DIFFICULTY_ORDER = { easy: 1, medium: 2, hard: 3, expert: 4 };

/**
 * MissionList Component
 */
const MissionList = ({
  missions = [],
  title = 'Missions',
  subtitle,
  stageNumber,
  showFilters = true,
  showSearch = true,
  showSort = true,
  defaultView = 'list',
  onMissionClick,
  onMissionAccept,
  onFilterChange,
  isLoading = false,
  emptyMessage = 'No missions available',
  className = '',
  ...props
}) => {
  const [viewMode, setViewMode] = useState(defaultView);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    difficulty: 'all'
  });
  const [sortBy, setSortBy] = useState('default');
  
  /**
   * Handle filter change
   */
  const handleFilterChange = useCallback((filterKey, value) => {
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  }, [filters, onFilterChange]);
  
  /**
   * Filtered and sorted missions
   */
  const filteredMissions = useMemo(() => {
    let result = [...missions];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(mission => 
        mission.title?.toLowerCase().includes(query) ||
        mission.description?.toLowerCase().includes(query) ||
        mission.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Status filter
    if (filters.status !== 'all') {
      result = result.filter(mission => mission.status === filters.status);
    }
    
    // Type filter
    if (filters.type !== 'all') {
      result = result.filter(mission => mission.type === filters.type);
    }
    
    // Difficulty filter
    if (filters.difficulty !== 'all') {
      result = result.filter(mission => mission.difficulty === filters.difficulty);
    }
    
    // Sort
    switch (sortBy) {
      case 'difficulty_asc':
        result.sort((a, b) => 
          (DIFFICULTY_ORDER[a.difficulty] || 0) - (DIFFICULTY_ORDER[b.difficulty] || 0)
        );
        break;
      case 'difficulty_desc':
        result.sort((a, b) => 
          (DIFFICULTY_ORDER[b.difficulty] || 0) - (DIFFICULTY_ORDER[a.difficulty] || 0)
        );
        break;
      case 'xp_desc':
        result.sort((a, b) => (b.xpReward || 0) - (a.xpReward || 0));
        break;
      case 'xp_asc':
        result.sort((a, b) => (a.xpReward || 0) - (b.xpReward || 0));
        break;
      case 'time_asc':
        result.sort((a, b) => (a.estimatedTime || 0) - (b.estimatedTime || 0));
        break;
      case 'time_desc':
        result.sort((a, b) => (b.estimatedTime || 0) - (a.estimatedTime || 0));
        break;
      default:
        // Keep original order
        break;
    }
    
    return result;
  }, [missions, searchQuery, filters, sortBy]);
  
  /**
   * Mission stats
   */
  const missionStats = useMemo(() => {
    const stats = {
      total: missions.length,
      available: 0,
      in_progress: 0,
      completed: 0,
      locked: 0
    };
    
    missions.forEach(mission => {
      if (stats[mission.status] !== undefined) {
        stats[mission.status]++;
      }
    });
    
    return stats;
  }, [missions]);
  
  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setFilters({ status: 'all', type: 'all', difficulty: 'all' });
    setSortBy('default');
  }, []);
  
  const hasActiveFilters = searchQuery || 
    filters.status !== 'all' || 
    filters.type !== 'all' || 
    filters.difficulty !== 'all' ||
    sortBy !== 'default';
  
  const classNames = [
    'mission-list',
    `mission-list--${viewMode}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="mission-list__header">
        <div className="mission-list__title-section">
          <h2 className="mission-list__title">{title}</h2>
          {subtitle && <p className="mission-list__subtitle">{subtitle}</p>}
          
          {/* Stats */}
          <div className="mission-list__stats">
            <span className="mission-list__stat">
              <span className="mission-list__stat-value">{missionStats.completed}</span>
              <span className="mission-list__stat-label">Completed</span>
            </span>
            <span className="mission-list__stat-divider">/</span>
            <span className="mission-list__stat">
              <span className="mission-list__stat-value">{missionStats.total}</span>
              <span className="mission-list__stat-label">Total</span>
            </span>
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="mission-list__view-toggle">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`mission-list__view-btn ${viewMode === 'list' ? 'mission-list__view-btn--active' : ''}`}
            aria-label="List view"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`mission-list__view-btn ${viewMode === 'grid' ? 'mission-list__view-btn--active' : ''}`}
            aria-label="Grid view"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Toolbar */}
      {(showFilters || showSearch || showSort) && (
        <div className="mission-list__toolbar">
          {/* Search */}
          {showSearch && (
            <div className="mission-list__search">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
              </svg>
              <input
                type="text"
                placeholder="Search missions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mission-list__search-input"
              />
            </div>
          )}
          
          {/* Filters */}
          {showFilters && (
            <div className="mission-list__filters">
              {Object.entries(FILTER_OPTIONS).map(([key, options]) => (
                <select
                  key={key}
                  value={filters[key]}
                  onChange={(e) => handleFilterChange(key, e.target.value)}
                  className="mission-list__filter-select"
                >
                  {options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          )}
          
          {/* Sort */}
          {showSort && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="mission-list__sort-select"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          
          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mission-list__clear-btn"
            >
              Clear All
            </button>
          )}
        </div>
      )}
      
      {/* Results Count */}
      <div className="mission-list__results">
        <span className="mission-list__results-count">
          {filteredMissions.length} mission{filteredMissions.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      {/* Content */}
      <div className="mission-list__content">
        {isLoading ? (
          <div className="mission-list__loading">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="mission-list__skeleton">
                <div className="mission-list__skeleton-icon" />
                <div className="mission-list__skeleton-content">
                  <div className="mission-list__skeleton-title" />
                  <div className="mission-list__skeleton-desc" />
                  <div className="mission-list__skeleton-meta" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredMissions.length > 0 ? (
          <div className={`mission-list__items mission-list__items--${viewMode}`}>
            {filteredMissions.map(mission => (
              <MissionListItem
                key={mission.id}
                {...mission}
                stageNumber={stageNumber || mission.stageNumber}
                onClick={onMissionClick}
                onAccept={onMissionAccept}
                variant={viewMode === 'grid' ? 'card' : 'default'}
              />
            ))}
          </div>
        ) : (
          <div className="mission-list__empty">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            <p>{hasActiveFilters ? 'No missions match your filters' : emptyMessage}</p>
            {hasActiveFilters && (
              <button type="button" onClick={clearFilters} className="mission-list__empty-btn">
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { FILTER_OPTIONS, SORT_OPTIONS };
export default MissionList;