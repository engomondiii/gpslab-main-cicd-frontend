/**
 * GPS Lab Platform - MissionList Component
 */

import React, { useState, useMemo, useCallback } from 'react';
import MissionListItem from './MissionListItem';
import './MissionList.css';

const FILTER_OPTIONS = {
  status: [{ value: 'all', label: 'All Status' }, { value: 'available', label: 'Available' }, { value: 'in_progress', label: 'In Progress' }, { value: 'completed', label: 'Completed' }, { value: 'locked', label: 'Locked' }],
  type: [{ value: 'all', label: 'All Types' }, { value: 'standard', label: 'Standard' }, { value: 'boss', label: 'Boss Battle' }, { value: 'checkpoint', label: 'Checkpoint' }, { value: 'challenge', label: 'Challenge' }, { value: 'party', label: 'Party Quest' }],
  difficulty: [{ value: 'all', label: 'All Difficulties' }, { value: 'easy', label: 'Easy' }, { value: 'medium', label: 'Medium' }, { value: 'hard', label: 'Hard' }, { value: 'expert', label: 'Expert' }]
};

const SORT_OPTIONS = [{ value: 'default', label: 'Default Order' }, { value: 'difficulty_asc', label: 'Difficulty: Easy → Hard' }, { value: 'difficulty_desc', label: 'Difficulty: Hard → Easy' }, { value: 'xp_desc', label: 'XP: High → Low' }, { value: 'xp_asc', label: 'XP: Low → High' }];
const DIFFICULTY_ORDER = { easy: 1, medium: 2, hard: 3, expert: 4 };

const MissionList = ({ missions = [], title = 'Missions', subtitle, stageNumber, showFilters = true, showSearch = true, showSort = true, defaultView = 'list', onMissionClick, onMissionAccept, onFilterChange, isLoading = false, emptyMessage = 'No missions available', className = '', ...props }) => {
  const [viewMode, setViewMode] = useState(defaultView);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ status: 'all', type: 'all', difficulty: 'all' });
  const [sortBy, setSortBy] = useState('default');
  
  const handleFilterChange = useCallback((filterKey, value) => { const newFilters = { ...filters, [filterKey]: value }; setFilters(newFilters); onFilterChange?.(newFilters); }, [filters, onFilterChange]);
  
  const filteredMissions = useMemo(() => {
    let result = [...missions];
    if (searchQuery) { const query = searchQuery.toLowerCase(); result = result.filter(m => m.title?.toLowerCase().includes(query) || m.description?.toLowerCase().includes(query)); }
    if (filters.status !== 'all') result = result.filter(m => m.status === filters.status);
    if (filters.type !== 'all') result = result.filter(m => m.type === filters.type);
    if (filters.difficulty !== 'all') result = result.filter(m => m.difficulty === filters.difficulty);
    if (sortBy === 'difficulty_asc') result.sort((a, b) => (DIFFICULTY_ORDER[a.difficulty] || 0) - (DIFFICULTY_ORDER[b.difficulty] || 0));
    else if (sortBy === 'difficulty_desc') result.sort((a, b) => (DIFFICULTY_ORDER[b.difficulty] || 0) - (DIFFICULTY_ORDER[a.difficulty] || 0));
    else if (sortBy === 'xp_desc') result.sort((a, b) => (b.xpReward || 0) - (a.xpReward || 0));
    else if (sortBy === 'xp_asc') result.sort((a, b) => (a.xpReward || 0) - (b.xpReward || 0));
    return result;
  }, [missions, searchQuery, filters, sortBy]);
  
  const missionStats = useMemo(() => ({ total: missions.length, completed: missions.filter(m => m.status === 'completed').length }), [missions]);
  const clearFilters = useCallback(() => { setSearchQuery(''); setFilters({ status: 'all', type: 'all', difficulty: 'all' }); setSortBy('default'); }, []);
  const hasActiveFilters = searchQuery || filters.status !== 'all' || filters.type !== 'all' || filters.difficulty !== 'all' || sortBy !== 'default';
  
  return (
    <div className={`mission-list mission-list--${viewMode} ${className}`} {...props}>
      <div className="mission-list__header">
        <div className="mission-list__title-section">
          <h2 className="mission-list__title">{title}</h2>
          {subtitle && <p className="mission-list__subtitle">{subtitle}</p>}
          <div className="mission-list__stats"><span className="mission-list__stat"><span className="mission-list__stat-value">{missionStats.completed}</span><span className="mission-list__stat-label">Completed</span></span><span className="mission-list__stat-divider">/</span><span className="mission-list__stat"><span className="mission-list__stat-value">{missionStats.total}</span><span className="mission-list__stat-label">Total</span></span></div>
        </div>
        <div className="mission-list__view-toggle">
          <button type="button" onClick={() => setViewMode('list')} className={`mission-list__view-btn ${viewMode === 'list' ? 'mission-list__view-btn--active' : ''}`}><svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/></svg></button>
          <button type="button" onClick={() => setViewMode('grid')} className={`mission-list__view-btn ${viewMode === 'grid' ? 'mission-list__view-btn--active' : ''}`}><svg viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg></button>
        </div>
      </div>
      
      {(showFilters || showSearch || showSort) && (
        <div className="mission-list__toolbar">
          {showSearch && <div className="mission-list__search"><svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/></svg><input type="text" placeholder="Search missions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="mission-list__search-input" /></div>}
          {showFilters && <div className="mission-list__filters">{Object.entries(FILTER_OPTIONS).map(([key, options]) => <select key={key} value={filters[key]} onChange={(e) => handleFilterChange(key, e.target.value)} className="mission-list__filter-select">{options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select>)}</div>}
          {showSort && <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="mission-list__sort-select">{SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select>}
          {hasActiveFilters && <button type="button" onClick={clearFilters} className="mission-list__clear-btn">Clear All</button>}
        </div>
      )}
      
      <div className="mission-list__results"><span className="mission-list__results-count">{filteredMissions.length} mission{filteredMissions.length !== 1 ? 's' : ''}</span></div>
      
      <div className="mission-list__content">
        {isLoading ? (
          <div className="mission-list__loading">{[...Array(3)].map((_, i) => <div key={i} className="mission-list__skeleton"><div className="mission-list__skeleton-icon" /><div className="mission-list__skeleton-content"><div className="mission-list__skeleton-title" /><div className="mission-list__skeleton-desc" /><div className="mission-list__skeleton-meta" /></div></div>)}</div>
        ) : filteredMissions.length > 0 ? (
          <div className={`mission-list__items mission-list__items--${viewMode}`}>{filteredMissions.map(mission => <MissionListItem key={mission.id} {...mission} stageNumber={stageNumber || mission.stageNumber} onClick={onMissionClick} onAccept={onMissionAccept} variant={viewMode === 'grid' ? 'card' : 'default'} />)}</div>
        ) : (
          <div className="mission-list__empty"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg><p>{hasActiveFilters ? 'No missions match your filters' : emptyMessage}</p>{hasActiveFilters && <button type="button" onClick={clearFilters} className="mission-list__empty-btn">Clear Filters</button>}</div>
        )}
      </div>
    </div>
  );
};

export { FILTER_OPTIONS, SORT_OPTIONS };
export default MissionList;