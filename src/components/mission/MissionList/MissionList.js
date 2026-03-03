/**
 * GPS Lab Platform - MissionList Component
 * GPS 101 INTEGRATION: Filters, identifies, and displays GPS 101 missions with special badges
 */

import React, { useState, useMemo, useCallback } from 'react';
import MissionListItem from './MissionListItem';
import './MissionList.css';

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
    { value: 'gps101', label: 'GPS 101 Basic' }, // NEW: GPS 101 filter
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
  ],
  program: [ // NEW: Program filter
    { value: 'all', label: 'All Programs' },
    { value: 'gps101', label: 'GPS 101 Basic' },
    { value: 'regular', label: 'Regular Missions' }
  ]
};

const SORT_OPTIONS = [
  { value: 'default', label: 'Default Order' },
  { value: 'difficulty_asc', label: 'Difficulty: Easy → Hard' },
  { value: 'difficulty_desc', label: 'Difficulty: Hard → Easy' },
  { value: 'xp_desc', label: 'XP: High → Low' },
  { value: 'xp_asc', label: 'XP: Low → High' },
  { value: 'gps101_first', label: 'GPS 101 First' } // NEW: GPS 101 sort
];

const DIFFICULTY_ORDER = { easy: 1, medium: 2, hard: 3, expert: 4 };

const MissionList = ({
  missions = [],
  title = 'Missions',
  subtitle,
  stageNumber,
  showFilters = true,
  showSearch = true,
  showSort = true,
  showProgramFilter = true, // NEW: Toggle program filter
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
    difficulty: 'all',
    program: 'all' // NEW: Program filter state
  });
  const [sortBy, setSortBy] = useState('default');
  
  // NEW: Helper to identify GPS 101 missions
  const isGPS101Mission = useCallback((mission) => {
    return mission.isGPS101 === true || 
           mission.type === 'gps101' || 
           mission.programType === 'gps101' ||
           mission.courseId === 'gps-101-basic' ||
           (mission.tags && mission.tags.includes('gps101'));
  }, []);
  
  const handleFilterChange = useCallback((filterKey, value) => {
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  }, [filters, onFilterChange]);
  
  const filteredMissions = useMemo(() => {
    let result = [...missions];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(m =>
        m.title?.toLowerCase().includes(query) ||
        m.description?.toLowerCase().includes(query)
      );
    }
    
    // Status filter
    if (filters.status !== 'all') {
      result = result.filter(m => m.status === filters.status);
    }
    
    // Type filter
    if (filters.type !== 'all') {
      if (filters.type === 'gps101') {
        result = result.filter(m => isGPS101Mission(m));
      } else {
        result = result.filter(m => m.type === filters.type);
      }
    }
    
    // Difficulty filter
    if (filters.difficulty !== 'all') {
      result = result.filter(m => m.difficulty === filters.difficulty);
    }
    
    // NEW: Program filter
    if (filters.program !== 'all') {
      if (filters.program === 'gps101') {
        result = result.filter(m => isGPS101Mission(m));
      } else if (filters.program === 'regular') {
        result = result.filter(m => !isGPS101Mission(m));
      }
    }
    
    // Sorting
    if (sortBy === 'difficulty_asc') {
      result.sort((a, b) => (DIFFICULTY_ORDER[a.difficulty] || 0) - (DIFFICULTY_ORDER[b.difficulty] || 0));
    } else if (sortBy === 'difficulty_desc') {
      result.sort((a, b) => (DIFFICULTY_ORDER[b.difficulty] || 0) - (DIFFICULTY_ORDER[a.difficulty] || 0));
    } else if (sortBy === 'xp_desc') {
      result.sort((a, b) => (b.xpReward || 0) - (a.xpReward || 0));
    } else if (sortBy === 'xp_asc') {
      result.sort((a, b) => (a.xpReward || 0) - (b.xpReward || 0));
    } else if (sortBy === 'gps101_first') {
      // NEW: GPS 101 missions first
      result.sort((a, b) => {
        const aIsGPS = isGPS101Mission(a) ? 1 : 0;
        const bIsGPS = isGPS101Mission(b) ? 1 : 0;
        return bIsGPS - aIsGPS;
      });
    }
    
    return result;
  }, [missions, searchQuery, filters, sortBy, isGPS101Mission]);
  
  // NEW: Separate GPS 101 stats
  const missionStats = useMemo(() => {
    const gps101Missions = missions.filter(m => isGPS101Mission(m));
    const regularMissions = missions.filter(m => !isGPS101Mission(m));
    
    return {
      total: missions.length,
      completed: missions.filter(m => m.status === 'completed').length,
      gps101Total: gps101Missions.length,
      gps101Completed: gps101Missions.filter(m => m.status === 'completed').length,
      regularTotal: regularMissions.length,
      regularCompleted: regularMissions.filter(m => m.status === 'completed').length
    };
  }, [missions, isGPS101Mission]);
  
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setFilters({
      status: 'all',
      type: 'all',
      difficulty: 'all',
      program: 'all'
    });
    setSortBy('default');
  }, []);
  
  const hasActiveFilters = searchQuery ||
    filters.status !== 'all' ||
    filters.type !== 'all' ||
    filters.difficulty !== 'all' ||
    filters.program !== 'all' ||
    sortBy !== 'default';
  
  return (
    <div className={`mission-list mission-list--${viewMode} ${className}`} {...props}>
      <div className="mission-list__header">
        <div className="mission-list__title-section">
          <h2 className="mission-list__title">{title}</h2>
          {subtitle && <p className="mission-list__subtitle">{subtitle}</p>}
          
          {/* Updated stats with GPS 101 breakdown */}
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
            
            {/* NEW: GPS 101 stats badge */}
            {missionStats.gps101Total > 0 && (
              <>
                <span className="mission-list__stat-separator">•</span>
                <span className="mission-list__stat mission-list__stat--gps101">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                  </svg>
                  <span className="mission-list__stat-value">{missionStats.gps101Completed}/{missionStats.gps101Total}</span>
                  <span className="mission-list__stat-label">GPS 101</span>
                </span>
              </>
            )}
          </div>
        </div>
        
        <div className="mission-list__view-toggle">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`mission-list__view-btn ${viewMode === 'list' ? 'mission-list__view-btn--active' : ''}`}
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`mission-list__view-btn ${viewMode === 'grid' ? 'mission-list__view-btn--active' : ''}`}
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
          </button>
        </div>
      </div>
      
      {(showFilters || showSearch || showSort) && (
        <div className="mission-list__toolbar">
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
          
          {showFilters && (
            <div className="mission-list__filters">
              {/* NEW: Program filter */}
              {showProgramFilter && missionStats.gps101Total > 0 && (
                <select
                  value={filters.program}
                  onChange={(e) => handleFilterChange('program', e.target.value)}
                  className="mission-list__filter-select mission-list__filter-select--program"
                >
                  {FILTER_OPTIONS.program.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}
              
              {/* Existing filters */}
              {Object.entries(FILTER_OPTIONS)
                .filter(([key]) => key !== 'program') // Exclude program from loop
                .map(([key, options]) => (
                  <select
                    key={key}
                    value={filters[key]}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    className="mission-list__filter-select"
                  >
                    {options.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ))}
            </div>
          )}
          
          {showSort && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="mission-list__sort-select"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}
          
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="mission-list__clear-btn">
              Clear All
            </button>
          )}
        </div>
      )}
      
      <div className="mission-list__results">
        <span className="mission-list__results-count">
          {filteredMissions.length} mission{filteredMissions.length !== 1 ? 's' : ''}
        </span>
      </div>
      
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
                isGPS101={isGPS101Mission(mission)} // NEW: Pass GPS 101 flag
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