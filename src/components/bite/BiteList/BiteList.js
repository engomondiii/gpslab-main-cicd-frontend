/**
 * GPS Lab Platform - BiteList Component
 * 
 * Filterable list view of bite tasks with grouping options.
 * 
 * @module components/bite/BiteList/BiteList
 */

import React, { useState, useMemo, useCallback } from 'react';
import BiteListItem, { BITE_STATUS, BITE_TYPE, BITE_PRIORITY } from './BiteListItem';
import './BiteList.css';

/**
 * Filter options
 */
export const BITE_FILTER_OPTIONS = {
  status: [
    { value: 'all', label: 'All Status' },
    ...Object.entries(BITE_STATUS).map(([key, val]) => ({ value: key, label: val.label }))
  ],
  type: [
    { value: 'all', label: 'All Types' },
    ...Object.entries(BITE_TYPE).map(([key, val]) => ({ value: key, label: val.label }))
  ],
  priority: [
    { value: 'all', label: 'All Priorities' },
    ...Object.entries(BITE_PRIORITY).map(([key, val]) => ({ value: key, label: val.label }))
  ]
};

/**
 * Sort options
 */
export const BITE_SORT_OPTIONS = [
  { value: 'default', label: 'Default Order' },
  { value: 'priority_desc', label: 'Priority: High → Low' },
  { value: 'priority_asc', label: 'Priority: Low → High' },
  { value: 'due_asc', label: 'Due Date: Earliest' },
  { value: 'due_desc', label: 'Due Date: Latest' },
  { value: 'xp_desc', label: 'XP: High → Low' },
  { value: 'created_desc', label: 'Newest First' },
  { value: 'created_asc', label: 'Oldest First' }
];

/**
 * Group options
 */
export const BITE_GROUP_OPTIONS = [
  { value: 'none', label: 'No Grouping' },
  { value: 'status', label: 'Group by Status' },
  { value: 'type', label: 'Group by Type' },
  { value: 'priority', label: 'Group by Priority' },
  { value: 'mission', label: 'Group by Mission' }
];

const PRIORITY_ORDER = { critical: 4, high: 3, medium: 2, low: 1 };

/**
 * BiteList Component
 */
const BiteList = ({
  bites = [],
  title = 'Tasks',
  subtitle,
  showFilters = true,
  showSearch = true,
  showSort = true,
  showGrouping = false,
  defaultGroupBy = 'none',
  onBiteClick,
  onBiteStatusChange,
  onCreateBite,
  isLoading = false,
  emptyMessage = 'No tasks found',
  className = '',
  ...props
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ status: 'all', type: 'all', priority: 'all' });
  const [sortBy, setSortBy] = useState('default');
  const [groupBy, setGroupBy] = useState(defaultGroupBy);
  
  /**
   * Handle filter change
   */
  const handleFilterChange = useCallback((filterKey, value) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
  }, []);
  
  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setFilters({ status: 'all', type: 'all', priority: 'all' });
    setSortBy('default');
    setGroupBy('none');
  }, []);
  
  /**
   * Filter and sort bites
   */
  const processedBites = useMemo(() => {
    let result = [...bites];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(bite => 
        bite.title?.toLowerCase().includes(query) ||
        bite.description?.toLowerCase().includes(query) ||
        bite.id?.toLowerCase().includes(query) ||
        bite.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply filters
    if (filters.status !== 'all') {
      result = result.filter(bite => bite.status === filters.status);
    }
    if (filters.type !== 'all') {
      result = result.filter(bite => bite.type === filters.type);
    }
    if (filters.priority !== 'all') {
      result = result.filter(bite => bite.priority === filters.priority);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'priority_desc':
        result.sort((a, b) => (PRIORITY_ORDER[b.priority] || 0) - (PRIORITY_ORDER[a.priority] || 0));
        break;
      case 'priority_asc':
        result.sort((a, b) => (PRIORITY_ORDER[a.priority] || 0) - (PRIORITY_ORDER[b.priority] || 0));
        break;
      case 'due_asc':
        result.sort((a, b) => new Date(a.dueDate || '9999') - new Date(b.dueDate || '9999'));
        break;
      case 'due_desc':
        result.sort((a, b) => new Date(b.dueDate || '0') - new Date(a.dueDate || '0'));
        break;
      case 'xp_desc':
        result.sort((a, b) => (b.xpReward || 0) - (a.xpReward || 0));
        break;
      case 'created_desc':
        result.sort((a, b) => new Date(b.createdAt || '0') - new Date(a.createdAt || '0'));
        break;
      case 'created_asc':
        result.sort((a, b) => new Date(a.createdAt || '0') - new Date(b.createdAt || '0'));
        break;
      default:
        break;
    }
    
    return result;
  }, [bites, searchQuery, filters, sortBy]);
  
  /**
   * Group bites
   */
  const groupedBites = useMemo(() => {
    if (groupBy === 'none') {
      return [{ key: 'all', label: null, bites: processedBites }];
    }
    
    const groups = {};
    
    processedBites.forEach(bite => {
      let groupKey;
      let groupLabel;
      
      switch (groupBy) {
        case 'status':
          groupKey = bite.status || 'backlog';
          groupLabel = BITE_STATUS[groupKey]?.label || groupKey;
          break;
        case 'type':
          groupKey = bite.type || 'task';
          groupLabel = BITE_TYPE[groupKey]?.label || groupKey;
          break;
        case 'priority':
          groupKey = bite.priority || 'medium';
          groupLabel = BITE_PRIORITY[groupKey]?.label || groupKey;
          break;
        case 'mission':
          groupKey = bite.missionId || 'unassigned';
          groupLabel = bite.missionTitle || 'Unassigned';
          break;
        default:
          groupKey = 'all';
          groupLabel = 'All Tasks';
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = { key: groupKey, label: groupLabel, bites: [] };
      }
      groups[groupKey].bites.push(bite);
    });
    
    // Sort groups
    const orderedKeys = groupBy === 'status' 
      ? Object.keys(BITE_STATUS)
      : groupBy === 'priority'
      ? ['critical', 'high', 'medium', 'low']
      : Object.keys(groups).sort();
    
    return orderedKeys
      .filter(key => groups[key])
      .map(key => groups[key]);
  }, [processedBites, groupBy]);
  
  /**
   * Stats
   */
  const stats = useMemo(() => ({
    total: bites.length,
    filtered: processedBites.length,
    completed: bites.filter(b => b.status === 'completed').length,
    inProgress: bites.filter(b => b.status === 'in_progress').length
  }), [bites, processedBites]);
  
  const hasActiveFilters = searchQuery || filters.status !== 'all' || filters.type !== 'all' || filters.priority !== 'all' || sortBy !== 'default';
  
  const classNames = ['bite-list', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="bite-list__header">
        <div className="bite-list__title-section">
          <h2 className="bite-list__title">{title}</h2>
          {subtitle && <p className="bite-list__subtitle">{subtitle}</p>}
          <div className="bite-list__stats">
            <span className="bite-list__stat">
              <span className="bite-list__stat-value bite-list__stat-value--completed">{stats.completed}</span>
              <span className="bite-list__stat-label">Done</span>
            </span>
            <span className="bite-list__stat-divider">/</span>
            <span className="bite-list__stat">
              <span className="bite-list__stat-value">{stats.total}</span>
              <span className="bite-list__stat-label">Total</span>
            </span>
          </div>
        </div>
        
        {/* Create Button */}
        {onCreateBite && (
          <button 
            type="button" 
            onClick={onCreateBite}
            className="bite-list__create-btn"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            New Task
          </button>
        )}
      </div>
      
      {/* Toolbar */}
      {(showFilters || showSearch || showSort || showGrouping) && (
        <div className="bite-list__toolbar">
          {/* Search */}
          {showSearch && (
            <div className="bite-list__search">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
              </svg>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bite-list__search-input"
              />
            </div>
          )}
          
          {/* Filters */}
          {showFilters && (
            <div className="bite-list__filters">
              {Object.entries(BITE_FILTER_OPTIONS).map(([key, options]) => (
                <select
                  key={key}
                  value={filters[key]}
                  onChange={(e) => handleFilterChange(key, e.target.value)}
                  className="bite-list__filter-select"
                >
                  {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
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
              className="bite-list__sort-select"
            >
              {BITE_SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}
          
          {/* Grouping */}
          {showGrouping && (
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="bite-list__group-select"
            >
              {BITE_GROUP_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}
          
          {/* Clear Filters */}
          {hasActiveFilters && (
            <button 
              type="button" 
              onClick={clearFilters}
              className="bite-list__clear-btn"
            >
              Clear All
            </button>
          )}
        </div>
      )}
      
      {/* Results Count */}
      <div className="bite-list__results">
        <span className="bite-list__results-count">
          {stats.filtered} task{stats.filtered !== 1 ? 's' : ''}
          {hasActiveFilters && stats.filtered !== stats.total && ` (filtered from ${stats.total})`}
        </span>
      </div>
      
      {/* Content */}
      <div className="bite-list__content">
        {isLoading ? (
          <div className="bite-list__loading">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bite-list__skeleton">
                <div className="bite-list__skeleton-type" />
                <div className="bite-list__skeleton-content">
                  <div className="bite-list__skeleton-title" />
                  <div className="bite-list__skeleton-desc" />
                  <div className="bite-list__skeleton-meta" />
                </div>
              </div>
            ))}
          </div>
        ) : processedBites.length > 0 ? (
          <div className="bite-list__groups">
            {groupedBites.map(group => (
              <div key={group.key} className="bite-list__group">
                {group.label && (
                  <div className="bite-list__group-header">
                    <h3 className="bite-list__group-title">{group.label}</h3>
                    <span className="bite-list__group-count">{group.bites.length}</span>
                  </div>
                )}
                <div className="bite-list__items">
                  {group.bites.map(bite => (
                    <BiteListItem
                      key={bite.id}
                      {...bite}
                      onClick={onBiteClick}
                      onStatusChange={onBiteStatusChange}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bite-list__empty">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <p>{hasActiveFilters ? 'No tasks match your filters' : emptyMessage}</p>
            {hasActiveFilters && (
              <button 
                type="button" 
                onClick={clearFilters}
                className="bite-list__empty-btn"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BiteList;